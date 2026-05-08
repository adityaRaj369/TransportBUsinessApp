const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  product: { type: String },
  message: { type: String },
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
