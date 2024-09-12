const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  adminName: { type: String, required: true },
  adminEmail: { type: String, required: true, unique: true },
  adminPassword: { type: String, required: true },
  role: { type: String, default: 'admin' }
});

module.exports = mongoose.model('Admin', userSchema);
