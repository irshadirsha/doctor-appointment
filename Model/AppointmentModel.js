const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    // userId: { type: String, required: true },
    // docId: { type: String, required: true },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    docId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Doctor', 
        required: true 
    },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false }
},{ timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);




// const mongoose = require('mongoose');

// const appointmentSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
//     date: { type: String, required: true },
//     time: { type: String, required: true },
//     transactionId: { type: String, required: true },
//     status: { type: String, default: 'Booked' },
//     createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Appointment', appointmentSchema);
