/**
 * Creates the first admin account and a few default departments.
 * Safe to run repeatedly. Usage: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Department = require('../models/Department');

const DEPARTMENTS = [
  ['General Medicine', 'Primary care and general health concerns'],
  ['Cardiology', 'Heart and cardiovascular system'],
  ['Neurology', 'Brain, spine and nervous system'],
  ['Orthopedics', 'Bones, joints and muscles'],
  ['Pediatrics', 'Medical care for children'],
];

const run = async () => {
  const { MONGO_URI, ADMIN_NAME = 'System Admin', ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('MONGO_URI, ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
  }
  await mongoose.connect(MONGO_URI);

  if (await User.findOne({ email: ADMIN_EMAIL.toLowerCase() })) {
    console.log(`Admin ${ADMIN_EMAIL} already exists`);
  } else {
    await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' });
    console.log(`Admin created: ${ADMIN_EMAIL}`);
  }

  for (const [name, description] of DEPARTMENTS) {
    if (!(await Department.exists({ name }))) {
      await Department.create({ name, description });
      console.log(`Department created: ${name}`);
    }
  }
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
