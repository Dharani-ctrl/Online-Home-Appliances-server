const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Generate JWT
const generateToken = (id, uid, role) => {
  return jwt.sign({ id, uid, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register User
router.post('/register', async (req, res) => {
  try {
    const { fname, uid, password, email, address, mobile } = req.body;

    const userExists = await User.findOne({ uid });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fname, uid, password: hashedPassword, email, address, mobile, role: 'user'
    });

    res.status(201).json({
      _id: user._id, uid: user.uid, role: user.role, token: generateToken(user._id, user.uid, user.role)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { uid, password } = req.body;
    const user = await User.findOne({ uid });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user._id, uid: user.uid, role: user.role, token: generateToken(user._id, user.uid, user.role)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Login
router.post('/admin-login', async (req, res) => {
  try {
    const { uid, password } = req.body;
    const admin = await User.findOne({ uid, role: 'admin' });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({
        id: admin._id, uid: admin.uid, role: admin.role, token: generateToken(admin._id, admin.uid, admin.role)
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
