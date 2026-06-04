const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest' },
  uid: String,
  electronics: String,
  brand: String,
  status: { type: String, enum: ['Under Repair','Parts Needed','Service Finished','Cancelled'] },
  statusDate: String,
  serviceEngineer: String,
  amount: Number,
}, { timestamps: true });

module.exports = mongoose.model('Status', statusSchema);
