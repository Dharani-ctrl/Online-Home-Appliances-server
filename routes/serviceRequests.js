const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const ServiceRequest = require('../models/ServiceRequest');
const Employee = require('../models/Employee');

// POST new request (user)
router.post('/', protect, async (req, res) => {
  try {
    const request = await ServiceRequest.create({
      uid: req.user.uid,
      ...req.body,
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all requests (admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({}).sort({ requestDate: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET own requests (user)
router.get('/my', protect, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ uid: req.user.uid }).sort({ requestDate: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT assign engineer + appointment date (admin)
router.put('/:id/assign', protect, admin, async (req, res) => {
  try {
    const { appointmentDate, empId } = req.body;
    
    const employee = await Employee.findOne({ empId });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.appointmentDate = appointmentDate;
    request.empId = employee.empId;
    request.serviceEngineer = employee.empName;
    request.engineerMobile = employee.mobile;

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
