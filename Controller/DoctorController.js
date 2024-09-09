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

// Get available doctors and their time slots for a given date
exports.getAvailableDoctorsOnDate = async (req, res) => {
    const { day, month, year } = req.params;
    const requestedDate = new Date(`${year}-${month}-${day}`); // Create date from URL params

    try {
        // Fetch doctors whose availability falls within the requested date
        const doctors = await Doctor.find({
            datefrom: { $lte: requestedDate }, // datefrom should be less than or equal to the requested date
            dateto: { $gte: requestedDate } // dateto should be greater than or equal to the requested date
        });

        const availableDoctors = [];

        for (let doctor of doctors) {
            const openingTime = parseTime(doctor.openingTime);
            const closingTime = parseTime(doctor.closingTime);

            // Fetch booked appointments for the doctor on the requested date
            const bookedAppointments = await Appointment.find({
                doctor: doctor._id,
                date: requestedDate // Ensure you're checking against the same date
            }).select('time');

            // Extract booked times
            const bookedTimes = bookedAppointments.map(appointment => parseTime(appointment.time));

            // Generate available time slots for the doctor
            const availableSlots = getAvailableTimeSlots(openingTime, closingTime, bookedTimes);

            // If the doctor has available slots, add them to the result
            if (availableSlots.length > 0) {
                availableDoctors.push({
                    doctorId: doctor._id,
                    name: doctor.name,
                    specialization: doctor.specialization,
                    availableSlots: availableSlots
                });
            }
        }

        if (availableDoctors.length > 0) {
            res.json({ availableDoctors });
        } else {
            res.status(404).json({ message: 'No available doctors for the selected date' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching available doctors and time slots', error });
    }
};


const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    const upperModifier = modifier.toUpperCase();

    if (upperModifier === 'PM' && hours !== 12) hours += 12;
    if (upperModifier === 'AM' && hours === 12) hours = 0;

    return hours * 60 + (minutes || 0); 
};

// Helper function to generate available time slots between opening and closing times
const getAvailableTimeSlots = (openingTime, closingTime, bookedTimes) => {
    const availableSlots = [];
    const slotInterval = 30; // 30 minutes per slot, adjust as needed

    for (let time = openingTime; time < closingTime; time += slotInterval) {
        // Check if this time slot is already booked
        if (!bookedTimes.includes(time)) {
            availableSlots.push(formatTime(time));
        }
    }

    return availableSlots;
};

// Helper function to convert minutes from midnight back into "hh:mm AM/PM" format
const formatTime = (timeInMinutes) => {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${period}`;
};


// Find doctors by specialization
// Find doctors by specialization (case-insensitive)
exports.getAvailableDoctorsOnSpec = async (req, res) => {
    const { specialization } = req.query;
    console.log("API called for specialization doctor", specialization);

    try {
        // Perform a case-insensitive search using regular expression
        const doctors = await Doctor.find({
            specialization: { $regex: new RegExp(specialization, 'i') }
        });
        
        if (!doctors || doctors.length === 0) {
            return res.status(404).json({ message: 'No doctors found with this specialization' });
        }

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


// const Doctor = require('../Model/DoctorModel');
// const Appointment = require('../Model/AppointmentModel');



