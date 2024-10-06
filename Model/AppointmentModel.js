const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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

appointmentSchema.index({ userId: 1 });
appointmentSchema.index({ docId: 1 });
appointmentSchema.index({ slotDate: 1, slotTime: 1 });
appointmentSchema.index({ cancelled: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);



