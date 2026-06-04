const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin', salt);

    const admin = await User.findOne({ uid: 'admin' });
    if (!admin) {
      await User.create({
        fname: 'Administrator',
        uid: 'admin',
        password: hashedPassword,
        email: 'admin@applianceserv.com',
        address: 'Admin Office',
        mobile: '0000000000',
        role: 'admin',
      });
      console.log('Admin user seeded successfully');
    } else {
      console.log('Admin user already exists');
    }
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
