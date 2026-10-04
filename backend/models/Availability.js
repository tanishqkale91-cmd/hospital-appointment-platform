const mongoose = require('mongoose');
const { generateSlots } = require('../utils/validators');

/**
 * A doctor's working window on a single date, e.g. 2025-01-10 09:00-12:00 with
 * 30 minute slots. Individual slots are derived from the window, not stored.
 */
const availabilitySchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    startTime: { type: String, required: true }, // HH:MM
    endTime: { type: String, required: true }, // HH:MM
    slotDuration: { type: Number, default: 30, min: 10, max: 120 }, // minutes
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

availabilitySchema.index({ doctor: 1, date: 1 });

availabilitySchema.methods.getSlots = function getSlots() {
  return generateSlots(this.startTime, this.endTime, this.slotDuration);
};

/**
 * Find the active availability window that offers a slot starting at
 * `startTime` for a doctor on `date`. Returns { availability, slot } or null.
 */
availabilitySchema.statics.findSlot = async function findSlot(doctorId, date, startTime) {
  const windows = await this.find({ doctor: doctorId, date, isActive: true });
  for (const availability of windows) {
    const slot = availability.getSlots().find((s) => s.startTime === startTime);
    if (slot) return { availability, slot };
  }
  return null;
};

module.exports = mongoose.model('Availability', availabilitySchema);
