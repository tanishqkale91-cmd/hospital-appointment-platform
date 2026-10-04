const User = require('../models/User');
const Appointment = require('../models/Appointment');
const { HttpError, asyncHandler } = require('../middlewares/errorHandler');
const { isValidObjectId, isValidDate, escapeRegex, pick, todayString } = require('../utils/validators');

// GET /api/patients/profile
const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: 'Profile retrieved', data: req.user });
});

// PUT /api/patients/profile
const updateProfile = asyncHandler(async (req, res) => {
  const updates = pick(req.body, ['name', 'phone', 'dateOfBirth', 'gender', 'bloodGroup', 'address']);
  if (updates.name !== undefined && !String(updates.name).trim()) throw new HttpError(400, 'Name cannot be empty');
  if (updates.dateOfBirth) {
    if (!isValidDate(updates.dateOfBirth)) throw new HttpError(400, 'Date of birth must be YYYY-MM-DD');
    if (updates.dateOfBirth > todayString()) throw new HttpError(400, 'Date of birth cannot be in the future');
  }
  if (updates.gender !== undefined && !['', 'male', 'female', 'other'].includes(updates.gender)) {
    throw new HttpError(400, 'Gender must be male, female or other');
  }
  Object.assign(req.user, updates);
  await req.user.save();
  res.status(200).json({ success: true, message: 'Profile updated', data: req.user });
});

// GET /api/patients/appointments  - own appointments (upcoming and past)
const getAppointments = asyncHandler(async (req, res) => {
  const filter = { patient: req.user._id };
  if (req.query.status) {
    if (!['booked', 'completed', 'cancelled'].includes(req.query.status)) {
      throw new HttpError(400, 'Invalid status filter');
    }
    filter.status = req.query.status;
  }
  const items = await Appointment.find(filter)
    .populate(Appointment.populateFields)
    .sort({ date: -1, startTime: -1 });
  res.status(200).json({ success: true, message: 'Appointments retrieved', data: items });
});

// GET /api/patients/history  - completed or cancelled appointments, or booked ones in the past
const getHistory = asyncHandler(async (req, res) => {
  const today = todayString();
  const items = await Appointment.find({
    patient: req.user._id,
    $or: [{ status: { $in: ['completed', 'cancelled'] } }, { date: { $lt: today } }],
  })
    .populate(Appointment.populateFields)
    .sort({ date: -1, startTime: -1 });
  res.status(200).json({ success: true, message: 'Appointment history retrieved', data: items });
});

// GET /api/patients?search=  (admin)
const listPatients = asyncHandler(async (req, res) => {
  const filter = { role: 'patient' };
  if (req.query.search) {
    const re = new RegExp(escapeRegex(req.query.search), 'i');
    filter.$or = [{ name: re }, { email: re }];
  }
  const patients = await User.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, message: 'Patients retrieved', data: patients });
});

// GET /api/patients/:id  (admin)
const getPatient = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) throw new HttpError(400, 'Invalid patient id');
  const patient = await User.findOne({ _id: req.params.id, role: 'patient' });
  if (!patient) throw new HttpError(404, 'Patient not found');
  res.status(200).json({ success: true, message: 'Patient retrieved', data: patient });
});

module.exports = { getProfile, updateProfile, getAppointments, getHistory, listPatients, getPatient };
