const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest' },
  uid: String,
  electronics: String,
  amount: Number,
  paymentDate: { type: Date, default: Date.now },
  lastFourDigits: String,
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
