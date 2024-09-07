const Doctor = require('../Model/DoctorModel');
const Appointment = require('../Model/AppointmentModel');

// Get available doctors and their time slots
exports.getAvailableDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().select('name specialization availableSlots');
        res.json({ doctors });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', error });
    }
};

// Manage available time slots for doctors
exports.manageSlots = async (req, res) => {
    const { doctorId } = req.params;
    const { availableSlots } = req.body;
    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        doctor.availableSlots = availableSlots;
        await doctor.save();
        res.json({ message: 'Doctor time slots updated successfully', doctor });
    } catch (error) {
        res.status(500).json({ message: 'Error updating time slots', error });
    }
};
