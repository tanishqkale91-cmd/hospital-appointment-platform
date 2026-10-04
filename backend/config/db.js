const mongoose = require('mongoose');

/**
 * Connect to MongoDB and make sure all model indexes exist.
 * The unique indexes on Appointment are what guarantee that a doctor/date/slot
 * can never be double booked, so we wait for them before accepting traffic.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined. Copy .env.example to .env and set it.');
  }
  mongoose.set('strictQuery', true);
  const conn = await mongoose.connect(uri);
  await Promise.all(Object.values(mongoose.models).map((model) => model.init()));
  console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};

module.exports = connectDB;
