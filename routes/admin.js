const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const Employee = require('../models/Employee');
const ServiceRequest = require('../models/ServiceRequest');
const Status = require('../models/Status');
const Payment = require('../models/Payment');

// Add new engineer (Employee)
router.post('/employees', protect, admin, async (req, res) => {
  try {
    const { empId, empName, address, mobile, email } = req.body;
    const employee = await Employee.create({
      empId,
      empName,
      address,
      mobile,
      email,
    });
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all engineers
router.get('/employees', protect, admin, async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all service requests
router.get('/requests', protect, admin, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({}).sort({ requestDate: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update appointment date and assign engineer
router.put('/appoint/:id', protect, admin, async (req, res) => {
  try {
    const { appointmentDate, empId } = req.body;
    
    const employee = await Employee.findOne({ empId });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.appointmentDate = appointmentDate;
    request.empId = employee.empId;
    request.engineerName = employee.empName;
    request.engineerMobile = employee.mobile;

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update status and amount
router.put('/status/:id', protect, admin, async (req, res) => {
  try {
    const { statusText, amount } = req.body;
    
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = statusText;
    await request.save();

    // Create status log
    const status = await Status.create({
      serviceRequestId: request._id,
      uid: request.uid,
      electronics: request.electronics,
      brand: request.brand,
      statusText,
      engineerName: request.engineerName,
      amount: amount || 0,
    });

    res.json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all status logs
router.get('/status-logs', protect, admin, async (req, res) => {
  try {
    const logs = await Status.find({}).sort({ statusDate: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all payments
router.get('/payments', protect, admin, async (req, res) => {
  try {
    const payments = await Payment.find({}).sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
