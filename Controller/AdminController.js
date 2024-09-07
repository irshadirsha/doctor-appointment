const Doctor = require('../Model/DoctorModel');
const mongoose = require ('mongoose')
// Add a new doctor
exports.addDoctor = async (req, res) => {
    console.log("add api called for doctor");
    
    const { name, specialization, datefrom, dateto, openingTime, closingTime } = req.body;
    console.log("Received data: ", name, specialization, datefrom, dateto, openingTime, closingTime);

    try {
        const newDoctor = new Doctor({
            name,
            specialization,
            datefrom,
            dateto,
            openingTime,
            closingTime
        });

        await newDoctor.save();
        res.status(201).json({ message: 'Doctor added successfully', doctor: newDoctor });
    } catch (error) {
        res.status(500).json({ message: 'Error adding doctor', error });
    }
};



// Edit doctor details
exports.editDoctor = async (req, res) => {
    const { doctorId } = req.params;
    const { name, specialization, datefrom, dateto, openingTime, closingTime } = req.body;

    try {
        const doctor = await Doctor.findByIdAndUpdate(
            doctorId, 
            { name, specialization, datefrom, dateto, openingTime, closingTime }, 
            { new: true }
        );
        
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.json({ message: 'Doctor updated successfully', doctor });
    } catch (error) {
        res.status(500).json({ message: 'Error updating doctor', error });
    }
};

exports.removeDoctor = async (req, res) => {
    let { doctorId } = req.params;
    console.log("API called for remove with doctorId:", doctorId);

    try {
        doctorId = doctorId.trim();
        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({ message: 'Invalid doctor ID format' });
        }
        const doctor = await Doctor.findOneAndDelete({ _id: doctorId });
        
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.json({ message: 'Doctor removed successfully' });
    } catch (error) {
        console.error("Error in removing doctor:", error); 
        res.status(500).json({ message: 'Error in removing doctor', error: error.message || error });
    }
};


// Manage available time slots for doctors
exports.manageSlots = async (req, res) => {
    const { doctorId } = req.params;
    const { availableSlots } = req.body;
    try {
        // Find the doctor by ID
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        doctor.availableSlots = availableSlots;
        await doctor.save();

        res.json({ message: 'Doctor time slots updated successfully', doctor });
    } catch (error) {
        console.error("Error updating time slots:", error);
        res.status(500).json({ message: 'Error updating time slots', error });
    }
};

