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
  available: { type: Boolean, default: true },
  fees: { type: Number, required: true },
  slots_booked: { type: Object, default: {} },
  address: { type: Object, required: true },
  date: { type: Number, required: true },
}, { minimize: false })


module.exports = mongoose.model('Doctor', doctorSchema);




// const mongoose = require('mongoose');

// const doctorSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     specialization: {
//         type: String,
//         required: true,
//     },
//     openingTime:{
//       type:String
//     },
//     closingTime:{
//       type:String
//     },
//     datefrom:{
//       type: Date, 
//       required: true
//     },
//     dateto:{
//       type: Date,
//       required: true
//     },
//     // availableSlots: [
//     //   {
//     //       date: String,
//     //       slots: [String]
//     //   }
//   // ],
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     }
// });

// module.exports = mongoose.model('Doctor', doctorSchema);
