const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const ServiceRequest = require('../models/ServiceRequest');
const Status = require('../models/Status');
const Payment = require('../models/Payment');

// Submit new service request
router.post('/service-request', protect, async (req, res) => {
  try {
    const { electronics, brand, problem } = req.body;
    const request = await ServiceRequest.create({
      uid: req.user.uid,
      electronics,
      brand,
      problem,
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// View own status logs
router.get('/my-status', protect, async (req, res) => {
  try {
    const statuses = await Status.find({ uid: req.user.uid }).sort({ statusDate: -1 });
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// View own payments
router.get('/my-payments', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ uid: req.user.uid }).sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit payment
router.post('/pay/:serviceRequestId', protect, async (req, res) => {
  try {
    const { amount, electronics, cardLast4 } = req.body;
    
    // Create payment
    const payment = await Payment.create({
      serviceRequestId: req.params.serviceRequestId,
      uid: req.user.uid,
      electronics,
      amount,
      cardLast4,
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
