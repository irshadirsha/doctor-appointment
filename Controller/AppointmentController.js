const Appointment = require('../Model/AppointmentModel');
const Doctor = require('../Model/DoctorModel');
const { generateInvoice } = require('../utils/invoiceUtils'); 

// Book an appointment
exports.bookAppointment = async (req, res) => {
    console.log("api called")
    const { userId, doctorId, date, time, transactionId } = req.body;
  console.log("userId, doctorId, date, time, transactionId ",userId, doctorId, date, time, transactionId );
  
    try {
     
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const openingTime = parseTime(doctor.openingTime);
        const closingTime = parseTime(doctor.closingTime);
        const requestedTime = parseTime(time);

        if (requestedTime < openingTime || requestedTime > closingTime) {
            return res.status(400).json({ message: `Doctor is only available between ${doctor.openingTime} and ${doctor.closingTime}.` });
        }

        const existingAppointment = await Appointment.findOne({
            doctor: doctorId,
            date: date,
            time: time
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'This time slot is already booked. Please choose another time.' });
        }

        const newAppointment = new Appointment({ user: userId, doctor: doctorId, date, time, transactionId });
        await newAppointment.save();

        
        const populatedAppointment = await Appointment.findById(newAppointment._id)
            .populate('user') 
            .populate('doctor'); 
  
        const invoice = generateInvoice(populatedAppointment);

        res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment, invoice });
    } catch (error) {
        res.status(500).json({ message: 'Error booking appointment', error });
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

// Get booking history for a user
exports.getBookingHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        const appointments = await Appointment.find({ user: userId })
            .populate('doctor', 'name specialization')
            .sort({ createdAt: -1 }); 
        res.json({ appointments });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booking history', error });
    }
};
