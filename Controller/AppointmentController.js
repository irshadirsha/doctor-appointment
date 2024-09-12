const Appointment = require('../Model/AppointmentModel');
const Doctor = require('../Model/DoctorModel');
const { generateInvoice } = require('../utils/invoiceUtils'); 
const User = require('../Model/UserModel'); 

// Book an appointment
// Get doctor details and available slots
exports.getDoctorSlots = async (req, res) => {
    try {
        const { docId } = req.params;
        console.log("api calledin get slot ",docId)

        // Fetch doctor details by ID
        const doctor = await Doctor.findById(docId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        // Mocking available slots (this would typically come from your database)
        const slots = [
            [{ datetime: new Date(), time: '10:00 AM' }, { time: '11:00 AM' }],
            [{ datetime: new Date(), time: '12:00 PM' }, { time: '1:00 PM' }]
        ];

        res.status(200).json({ success: true, doctor, slots });
    } catch (error) {
        console.error('Error fetching doctor slots:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.BookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.user._id; // JWT contains authenticated user's info

    console.log("docId,slotDate,slotTime",docId,slotDate,slotTime)

    // Fetch doctor and user info
    const doctor = await Doctor.findById(docId);
    const user = await User.findById(userId);

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Check if the slot is already booked
    if (doctor.slots_booked[slotDate] && doctor.slots_booked[slotDate].includes(slotTime)) {
      return res.status(400).json({ success: false, message: 'This slot is already booked' });
    }

    // Calculate appointment fee
    const amount = doctor.fees;

    // Create new appointment
    const appointment = new Appointment({
      userId,
      docId,
      slotDate,
      slotTime,
      userData: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      docData: {
        name: doctor.name,
        speciality: doctor.speciality,
      },
      amount,
      date: Date.now(),
    });

    // Save appointment to database
    await appointment.save();

    // Mark the slot as booked in doctor data
    if (!doctor.slots_booked[slotDate]) {
      doctor.slots_booked[slotDate] = [];
    }
    doctor.slots_booked[slotDate].push(slotTime);

    await doctor.save(); // Save updated doctor slots

    res.status(200).json({ success: true, message: 'Appointment booked successfully', appointment });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// exports.bookAppointment = async (req, res) => {
//     console.log("api called")
//     const { userId, doctorId, date, time, transactionId } = req.body;
//   console.log("userId, doctorId, date, time, transactionId ",userId, doctorId, date, time, transactionId );
  
//     try {
     
//         const doctor = await Doctor.findById(doctorId);

//         if (!doctor) {
//             return res.status(404).json({ message: 'Doctor not found' });
//         }
//          // Check if the appointment date is within the doctor's available date range
//          const requestedDate = parseInt(date); // Ensure date is in integer format
//          const dateFrom = parseInt(doctor.datefrom);
//          const dateTo = parseInt(doctor.dateto);
 
//          if (requestedDate < dateFrom || requestedDate > dateTo) {
//              return res.status(400).json({ message: `Doctor is only available from date ${doctor.datefrom} to ${doctor.dateto}.` });
//          }

//         const openingTime = parseTime(doctor.openingTime);
//         const closingTime = parseTime(doctor.closingTime);
//         const requestedTime = parseTime(time);

//         if (requestedTime < openingTime || requestedTime > closingTime) {
//             return res.status(400).json({ message: `Doctor is only available between ${doctor.openingTime} and ${doctor.closingTime}.` });
//         }

//         const existingAppointment = await Appointment.findOne({
//             doctor: doctorId,
//             date: date,
//             time: time
//         });

//         if (existingAppointment) {
//             return res.status(400).json({ message: 'This time slot is already booked. Please choose another time.' });
//         }

//         const newAppointment = new Appointment({ user: userId, doctor: doctorId, date, time, transactionId });
//         await newAppointment.save();

        
//         const populatedAppointment = await Appointment.findById(newAppointment._id)
//             .populate('user') 
//             .populate('doctor'); 
  
//         const invoice = generateInvoice(populatedAppointment);

//         res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment, invoice });
//     } catch (error) {
//         res.status(500).json({ message: 'Error booking appointment', error });
//     }
// };


// const parseTime = (timeStr) => {
//     const [time, modifier] = timeStr.split(' ');
//     let [hours, minutes] = time.split(':').map(Number);

//     const upperModifier = modifier.toUpperCase();

//     if (upperModifier === 'PM' && hours !== 12) hours += 12;
//     if (upperModifier === 'AM' && hours === 12) hours = 0;

//     return hours * 60 + (minutes || 0); 
// };

// // Get booking history for a user
// exports.getBookingHistory = async (req, res) => {
//     console.log("api called succesfully in appontment history")
//     const { userId } = req.params;

//     try {
//         const appointments = await Appointment.find({ user: userId })
//             .populate('doctor')
//             .sort({ createdAt: -1 }); 
//         res.json({ appointments });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching booking history', error });
//     }
// };
