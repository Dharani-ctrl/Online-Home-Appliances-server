const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const Status = require('../models/Status');
const ServiceRequest = require('../models/ServiceRequest');

// POST status update with amount (admin) — also updates ServiceRequest.status
router.post('/', protect, admin, async (req, res) => {
  try {
    const { serviceId, status, statusDate, amount } = req.body;
    
    const request = await ServiceRequest.findById(serviceId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Update the status on the ServiceRequest document itself
    request.status = status;
    await request.save();

    const newStatus = await Status.create({
      serviceId: request._id,
      uid: request.uid,
      electronics: request.electronics,
      brand: request.brand,
      status,
      statusDate,
      serviceEngineer: request.serviceEngineer,
      amount: amount || 0,
    });

    res.status(201).json(newStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all status logs (admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const logs = await Status.find({}).populate('serviceId').sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET own statuses (user)
router.get('/my', protect, async (req, res) => {
  try {
    const statuses = await Status.find({ uid: req.user.uid }).populate('serviceId').sort({ createdAt: -1 });
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
