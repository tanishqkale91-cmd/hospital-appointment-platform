const mongoose = require('mongoose');

const waitingListSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    desiredDate: { type: String, required: true }, // YYYY-MM-DD
    preferredTime: { type: String, default: '' }, // HH:MM, empty = any time
    status: { type: String, enum: ['waiting', 'assigned', 'cancelled'], default: 'waiting' },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }, // set when assigned
    notes: { type: String, trim: true, default: '', maxlength: 500 },
  },
  { timestamps: true }
);

waitingListSchema.index({ doctor: 1, desiredDate: 1, status: 1, createdAt: 1 });
waitingListSchema.index({ patient: 1, createdAt: -1 });

const populateFields = [
  { path: 'patient', select: 'name email phone' },
  {
    path: 'doctor',
    select: 'user department specialization',
    populate: [
      { path: 'user', select: 'name email' },
      { path: 'department', select: 'name' },
    ],
  },
];

const WaitingList = mongoose.model('WaitingList', waitingListSchema);
WaitingList.populateFields = populateFields;

module.exports = WaitingList;
