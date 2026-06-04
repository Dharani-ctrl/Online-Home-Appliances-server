const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  uid: String,
  electronics: { type: String, enum: ['AC','TV','Washing Machine','Refrigerator','Microwave'] },
  brand: String,
  problem: String,
  requestDate: { type: Date, default: Date.now },
  appointmentDate: String,
  empId: String,
  serviceEngineer: String,
  engineerMobile: String,
  status: {
    type: String,
    enum: ['Pending', 'Under Repair', 'Parts Needed', 'Service Finished', 'Cancelled'],
    default: 'Pending'
  },
}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
