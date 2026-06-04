const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fname: String,
  uid: { type: String, unique: true },
  password: String,
  email: String,
  address: String,
  mobile: String,
  role: { type: String, enum: ['user','admin'], default: 'user' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
