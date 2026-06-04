const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  empId: { type: String, unique: true },
  empName: String,
  address: String,
  mobile: String,
  email: String,
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
