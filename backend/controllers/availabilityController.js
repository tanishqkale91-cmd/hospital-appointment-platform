const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { HttpError, asyncHandler } = require('../middlewares/errorHandler');
const {
  isValidObjectId,
  isValidDate,
  isValidTime,
  todayString,
  toMinutes,
  isPastSlot,
  generateSlots,
} = require('../utils/validators');

const getOwnDoctor = async (user) => {
  const doctor = await Doctor.findOne({ user: user._id });
  if (!doctor) throw new HttpError(404, 'Doctor profile not found');
  if (!doctor.isActive) throw new HttpError(403, 'Doctor account is deactivated');
  return doctor;
};

/** Validate a full availability window; throws 400 on bad input. */
const validateWindow = ({ date, startTime, endTime, slotDuration }) => {
  if (!isValidDate(date)) throw new HttpError(400, 'Date must be a valid YYYY-MM-DD');
  if (date < todayString()) throw new HttpError(400, 'Date cannot be in the past');
  if (!isValidTime(startTime) || !isValidTime(endTime)) throw new HttpError(400, 'Times must be HH:MM (24h)');
  if (toMinutes(endTime) <= toMinutes(startTime)) throw new HttpError(400, 'End time must be after start time');
  if (!Number.isInteger(slotDuration) || slotDuration < 10 || slotDuration > 120) {
    throw new HttpError(400, 'Slot duration must be a whole number between 10 and 120 minutes');
  }
  if (generateSlots(startTime, endTime, slotDuration).length === 0) {
    throw new HttpError(400, 'The window is shorter than a single slot');
  }
  if (date === todayString() && isPastSlot(date, endTime)) {
    throw new HttpError(400, 'The availability window has already ended');
  }
};

const assertNoOverlap = async (doctorId, { date, startTime, endTime }, excludeId) => {
  const others = await Availability.find({
    doctor: doctorId,
    date,
    isActive: true,
    ...(excludeId ? { _id: { $ne: excludeId } } : {}),
  });
  const s = toMinutes(startTime);
  const e = toMinutes(endTime);
  if (others.some((o) => s < toMinutes(o.endTime) && toMinutes(o.startTime) < e)) {
    throw new HttpError(409, 'This window overlaps with an existing availability on the same date');
  }
};

/** Booked appointments sitting in the slots of an availability window. */
const bookedInWindow = async (availability) => {
  const starts = availability.getSlots().map((s) => s.startTime);
  return Appointment.find({
    doctor: availability.doctor,
    date: availability.date,
    status: { $in: Appointment.ACTIVE_STATUSES },
    startTime: { $in: starts },
  });
};

// POST /api/availability  (doctor)
const createAvailability = asyncHandler(async (req, res) => {
  const doctor = await getOwnDoctor(req.user);
  const { date, startTime, endTime } = req.body;
  const slotDuration = req.body.slotDuration === undefined ? 30 : Number(req.body.slotDuration);
  validateWindow({ date, startTime, endTime, slotDuration });
  await assertNoOverlap(doctor._id, { date, startTime, endTime });
  const availability = await Availability.create({ doctor: doctor._id, date, startTime, endTime, slotDuration });
  res.status(201).json({ success: true, message: 'Availability created', data: availability });
});

// GET /api/availability/me?from=&includeInactive=  (doctor)
const getMyAvailability = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) throw new HttpError(404, 'Doctor profile not found');
  const filter = { doctor: doctor._id };
  if (req.query.includeInactive !== 'true') filter.isActive = true;
  if (req.query.from) {
    if (!isValidDate(req.query.from)) throw new HttpError(400, 'Invalid from date');
    filter.date = { $gte: req.query.from };
  }
  const items = await Availability.find(filter).sort({ date: 1, startTime: 1 });
  res.status(200).json({ success: true, message: 'Availability retrieved', data: items });
});

const loadOwned = async (req) => {
  if (!isValidObjectId(req.params.id)) throw new HttpError(400, 'Invalid availability id');
  const doctor = await getOwnDoctor(req.user);
  const availability = await Availability.findById(req.params.id);
  if (!availability) throw new HttpError(404, 'Availability not found');
  if (String(availability.doctor) !== String(doctor._id)) {
    throw new HttpError(403, 'This availability belongs to another doctor');
  }
  return availability;
};

// PUT /api/availability/:id  (doctor)
const updateAvailability = asyncHandler(async (req, res) => {
  const availability = await loadOwned(req);
  const next = {
    date: req.body.date ?? availability.date,
    startTime: req.body.startTime ?? availability.startTime,
    endTime: req.body.endTime ?? availability.endTime,
    slotDuration: req.body.slotDuration === undefined ? availability.slotDuration : Number(req.body.slotDuration),
  };
  validateWindow(next);

  // Existing booked appointments must still fit into the updated window.
  const booked = await bookedInWindow(availability);
  if (booked.length) {
    if (next.date !== availability.date) {
      throw new HttpError(409, 'Cannot move a window that has booked appointments; cancel them first');
    }
    const newStarts = generateSlots(next.startTime, next.endTime, next.slotDuration).map((s) => s.startTime);
    if (booked.some((a) => !newStarts.includes(a.startTime))) {
      throw new HttpError(409, 'Update would remove slots that already have booked appointments');
    }
  }
  if (availability.isActive) await assertNoOverlap(availability.doctor, next, availability._id);

  Object.assign(availability, next);
  if (req.body.isActive !== undefined) availability.isActive = Boolean(req.body.isActive);
  await availability.save();
  res.status(200).json({ success: true, message: 'Availability updated', data: availability });
});

// DELETE /api/availability/:id  (doctor) - deactivates
const removeAvailability = asyncHandler(async (req, res) => {
  const availability = await loadOwned(req);
  if ((await bookedInWindow(availability)).length) {
    throw new HttpError(409, 'This window has booked appointments; cancel them before removing it');
  }
  availability.isActive = false;
  await availability.save();
  res.status(200).json({ success: true, message: 'Availability removed', data: availability });
});

/** Annotate every slot of the given windows with an `available` flag. */
const buildSlotView = async (doctorId, windows) => {
  if (!windows.length) return [];
  const dates = [...new Set(windows.map((w) => w.date))];
  const booked = await Appointment.find({ doctor: doctorId, date: { $in: dates }, status: { $in: Appointment.ACTIVE_STATUSES } }).select(
    'date startTime'
  );
  const taken = new Set(booked.map((b) => `${b.date}|${b.startTime}`));
  return windows.map((w) => {
    const slots = w.getSlots().map((s) => ({
      ...s,
      date: w.date,
      availabilityId: w._id,
      available: !taken.has(`${w.date}|${s.startTime}`) && !isPastSlot(w.date, s.startTime),
    }));
    return {
      _id: w._id,
      doctor: w.doctor,
      date: w.date,
      startTime: w.startTime,
      endTime: w.endTime,
      slotDuration: w.slotDuration,
      slots,
      availableSlots: slots.filter((s) => s.available).length,
    };
  });
};

const loadActiveDoctor = async (id) => {
  if (!isValidObjectId(id)) throw new HttpError(400, 'Invalid doctor id');
  const doctor = await Doctor.findById(id);
  if (!doctor || !doctor.isActive) throw new HttpError(404, 'Doctor not found');
  return doctor;
};

// GET /api/availability/doctor/:doctorId?from=&to=
const getDoctorAvailability = asyncHandler(async (req, res) => {
  const doctor = await loadActiveDoctor(req.params.doctorId);
  const from = req.query.from || todayString();
  if (!isValidDate(from)) throw new HttpError(400, 'Invalid from date');
  const range = { $gte: from };
  if (req.query.to) {
    if (!isValidDate(req.query.to)) throw new HttpError(400, 'Invalid to date');
    range.$lte = req.query.to;
  }
  const windows = await Availability.find({ doctor: doctor._id, isActive: true, date: range }).sort({
    date: 1,
    startTime: 1,
  });
  const data = await buildSlotView(doctor._id, windows);
  res.status(200).json({ success: true, message: 'Availability retrieved', data });
});

// GET /api/availability/doctor/:doctorId/slots?date=YYYY-MM-DD
const getDoctorSlots = asyncHandler(async (req, res) => {
  const doctor = await loadActiveDoctor(req.params.doctorId);
  const { date } = req.query;
  if (!isValidDate(date)) throw new HttpError(400, 'A valid date (YYYY-MM-DD) query parameter is required');
  const windows = await Availability.find({ doctor: doctor._id, isActive: true, date }).sort({ startTime: 1 });
  const view = await buildSlotView(doctor._id, windows);
  const slots = view.flatMap((v) => v.slots);
  res.status(200).json({ success: true, message: 'Slots retrieved', data: slots });
});

module.exports = {
  createAvailability,
  getMyAvailability,
  updateAvailability,
  removeAvailability,
  getDoctorAvailability,
  getDoctorSlots,
};
