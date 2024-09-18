const Doctor = require('../Model/DoctorModel');
const jwt = require('jsonwebtoken');
const AppointmentModel = require('../Model/AppointmentModel');
const { default: mongoose } = require('mongoose');


exports.DoctorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      const doctor = await Doctor.findOne({ email });
      console.log("doctor",doctor)
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
  
      if (password !== doctor.password) {
          console.log("pass not mathc")
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      // Create a JWT token   
      const token = jwt.sign(
        { id: doctor._id, email: doctor.email, role:"doctor" },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } 
      );
     console.log("token", token)
      res.status(200).json({
        message: 'Login successful',
        status:true,
        token,    
        doctor: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          speciality: doctor.speciality,
        }
      });
    } catch (error) {
      console.error('Error logging in doctor:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };


exports.DoctorProfile = async(req,res)=>{
    const doctorId = req.params.id;
    console.log("id doc profile", doctorId);
    
    const doctor = await Doctor.findById(doctorId);
    try {
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json({ doctor });
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
}


exports.getDoctorAppointments = async (req, res) => {
    const doctorId = req.params.doctorId;
    console.log("DoctorId", doctorId)
    try {
        const objectIdDoctor = new mongoose.Types.ObjectId(doctorId.trim());

        const appointments = await AppointmentModel.find({ docId:objectIdDoctor })
            .populate('userId') 
            .populate('docId')
            .sort({ slotDate: -1 });

            console.log("appointments",appointments)

        if (!appointments.length) {
            return res.status(404).json({ message: 'No appointments found for this doctor' });
        }
  
        res.status(200).json({
            success:true,
            appointments
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Server error', error });
    }                      
  };


exports.CancelAppointment = async (req, res) => {
        const { docId, appointmentId } = req.params;
        console.log(" docId, appointmentId", docId, appointmentId);
        try {
          const appointment = await AppointmentModel.findOne({
            _id: appointmentId,
            docId: docId,
          });

          console.log("fetched",appointment)
      
          if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
          }
      
          if (appointment.cancelled) {
            return res.status(400).json({ message: 'Appointment is already cancelled' });
          }
      
          appointment.cancelled = true;
          await appointment.save();
      
          res.status(200).json({ message: 'Appointment cancelled successfully', appointment });
        } catch (error) {
          console.error('Error cancelling appointment:', error);
          res.status(500).json({ message: 'Server error' });
        }
      };
  
exports.CompleteAppointment = async (req, res) => {
        const { docId, appointmentId } = req.params;
        console.log(" docId, appointmentId", docId, appointmentId);
        
        try {
          const appointment = await AppointmentModel.findOne({
            _id: appointmentId,
            docId: docId,
          });
          console.log("appointments",appointment);
      
          if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
          }
      
          if (appointment.isCompleted) {
            return res.status(400).json({ message: 'Appointment is already completed' });
          }
      
          appointment.isCompleted = true;
          await appointment.save();
          console.log(appointment)
          res.status(200).json({ message: 'Appointment completed successfully', appointment });
        } catch (error) {
          console.error('Error completing appointment:', error);
          res.status(500).json({ message: 'Server error' });
        }
      };

exports.DoctorDashBoard = async (req, res) => {
        const { docId } = req.params;
        console.log("api in doctor dashboard", docId);
        try {
          const appointments = await AppointmentModel.find({ docId });
          console.log("appointments", appointments);
          
          const completedAppointments = appointments.filter(appointment => appointment.isCompleted);
      
          const earnings = completedAppointments.reduce((total, appointment) => total + appointment.amount, 0);
        

          const latestAppointments = await AppointmentModel.find({
            docId,
            isCompleted: true,
          })
            .sort({ slotDate: -1 })
            .limit(5);
          
          res.json({
            earnings,
            appointments: appointments.length,
            patients:appointments.length,
            latestAppointments
          });
        } catch (error) {
          res.status(500).json({ message: 'Error fetching dashboard data', error });
        }
      }



