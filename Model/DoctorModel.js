const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    openingTime:{
      type:String
    },
    closingTime:{
      type:String
    },
    datefrom:{
      type: Date, 
      required: true
    },
    dateto:{
      type: Date,
      required: true
    },
    // availableSlots: [
    //   {
    //       date: String,
    //       slots: [String]
    //   }
  // ],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Doctor', doctorSchema);
