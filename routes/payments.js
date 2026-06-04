const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const Payment = require('../models/Payment');
const ServiceRequest = require('../models/ServiceRequest');

// POST submit payment (user)
router.post('/', protect, async (req, res) => {
  try {
    const { serviceId, lastFourDigits, amount } = req.body;
    
    const request = await ServiceRequest.findById(serviceId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const payment = await Payment.create({
      serviceId,
      uid: req.user.uid,
      electronics: request.electronics,
      amount,
      lastFourDigits,
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all payments (admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const payments = await Payment.find({}).populate('serviceId').sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET own payment history (user)
router.get('/my', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ uid: req.user.uid }).populate('serviceId').sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
