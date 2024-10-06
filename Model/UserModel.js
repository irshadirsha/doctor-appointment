const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
  otp: { type: String },  
  otpCreatedAt: {
    type: Date,
    default: Date.now,
    expires: 120},
  isVerified: { type: Boolean, default: false },  
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
});

userSchema.index({ email: 1 }); 
userSchema.index({ otp: 1 });  
userSchema.index({ otpCreatedAt: 1 });

module.exports = mongoose.model('User', userSchema);
