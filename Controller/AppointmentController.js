const Doctor = require('../Model/DoctorModel');
const { generateInvoice } = require('../utils/invoiceUtils'); 
const User = require('../Model/UserModel'); 
const AppointmentModel = require('../Model/AppointmentModel');
const path = require('path');

exports.DownloadInvoice = async (req, res) => {
     console.log("in side downloadinvoice ------")
     console.log("dir--", __dirname)
    const invoicePath = path.join(__dirname, `../invoices/${req.params.appointmentId}.pdf`);

  console.log("invoice ", invoicePath)                  
  res.download(invoicePath, (err) => {
      if (err) {
          console.error('Error downloading invoice:', err); 
          return res.status(500).json({ success: false, message: 'Error downloading invoice' });
      }
  });
};

// get slot for book an appointment
exports.getDoctorSlots = async (req, res) => {
  try {
      const { docId } = req.params;
      console.log("api called in get slot ", docId);

      const doctor = await Doctor.findById(docId);
      if (!doctor) {
          return res.status(404).json({ success: false, message: 'Doctor not found' });
      }

      // Fetch available slots
      const slots = doctor.slots_booked.map(slot => ({
          date: slot.date,
          slots: slot.slots.map(timeSlot => ({
              time: timeSlot.time,
              isBooked: timeSlot.isBooked,
          })),
      }));

      res.status(200).json({ success: true, doctor, slots });
  } catch (error) {
      console.error('Error fetching doctor slots:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
};

// booking appointment
exports.BookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime ,userId} = req.body;
    console.log("docId, slotDate, slotTime", docId, slotDate, slotTime);
    console.log("id",userId);
    const doctor = await Doctor.findById(docId);
    const user = await User.findById(userId);

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Check if the slot is already booked
    const slotForDate = doctor.slots_booked.find(slot => slot.date === slotDate);
    if (slotForDate) {
      const timeSlot = slotForDate.slots.find(slot => slot.time === slotTime && slot.isBooked);
      if (timeSlot) {
        return res.status(400).json({ success: false, message: 'This slot is already booked' });
      }
    }

    const amount = doctor.fees;

    const appointment = new AppointmentModel({
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

    await appointment.save();

       const invoicePath = generateInvoice(appointment);
       console.log('Invoice generated at:', invoicePath);   

    // Mark the slot as booked true
    const slot = doctor.slots_booked.find(slot => slot.date === slotDate);
    if (slot) {
      const timeSlot = slot.slots.find(slot => slot.time === slotTime);
      if (timeSlot) timeSlot.isBooked = true;
    }

    await doctor.save(); 

    res.status(200).json({ success: true, message: 'Appointment booked successfully', appointment, invoicePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// booking history for user
exports.getBookingHistory = async (req, res) => {
  const { userId } = req.params; 
  console.log("Received userId:", userId); 

  try {
      const bookings = await AppointmentModel.find({ userId: userId.trim() })
      .populate('userId')
      .populate('docId')
      .sort({ createdAt: -1 })
      
      
      if (!bookings || bookings.length === 0) {
          return res.status(404).json({
              success: false,
              message: "No bookings found for this user"
          });
      }

      res.status(200).json({
          success: true,
          data: bookings,
      });
  } catch (error) {
      console.error("Error fetching booking history:", error.message); 
      res.status(500).json({
          success: false,
          message: "Failed to fetch booking history",
          error: error.message
      });
  }
};

exports.CancelAppointment = async (req, res) => {
    const { appId } = req.params;
    console.log("api calledinside cancel appoinment");
    
    try {
        const appointment = await AppointmentModel.findById(appId);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Check if appointment is already canceled or completed
        if (appointment.cancelled) {
            return res.status(400).json({ success: false, message: 'Appointment is already canceled' });
        }
        if (appointment.isCompleted) {
            return res.status(400).json({ success: false, message: 'Cannot cancel a completed appointment' });
        }

        appointment.cancelled = true;
        await appointment.save();

        return res.status(200).json({ success: true, message: 'Appointment canceled successfully' });
    } catch (error) {
        console.error('Error canceling appointment:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};


