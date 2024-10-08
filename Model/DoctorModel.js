const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  speciality: { type: String, required: true },
  degree: { type: String, required: true },
  experience: { type: String, required: true },
  about: { type: String, required: true },
  available: { type: Boolean, default: false },
  refreshToken : { type: String },
  fees: { type: Number, required: true },
  slots_booked: [
    {
      date: { type: String, required: true }, 
      slots: [
        {
          time: { type: String, required: true },
          isBooked: { type: Boolean, default: false }
        }
      ]
    }
  ],  
  address: { type: Object, required: true },
  role: { type: String, default: 'doctor' },
  date: { type: Number, required: true }
},);

doctorSchema.index({ email: 1 });
doctorSchema.index({ speciality: 1 });
doctorSchema.index({ "slots_booked.date": 1 });
doctorSchema.index({ available: 1 });

module.exports = mongoose.model('Doctor', doctorSchema);
