const Doctor = require('../Model/DoctorModel');
const mongoose = require ('mongoose')
const jwt = require('jsonwebtoken');
const Admin = require('../Model/AdminModel');
const Appointment = require('../Model/AppointmentModel');
const User = require ('../Model/UserModel')
const moment = require('moment'); 
const nodemailer = require('nodemailer');

// Admin Login
exports.AdminLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log("called admin",email,password)
    try {
      const admin = await Admin.findOne({ adminEmail: email, role: 'admin' });

      if (!admin) {
        return res.status(400).json({ message: 'Admin not found' });
      }

      if (password!==admin.adminPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const payload = {
        id: admin._id,
        email: admin.adminEmail,
        role: "admin"
            };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      // Send response
      res.json({
        status:"success",
        token,
        user: {
          id: admin._id,
          name: admin.adminName,
          email: admin.adminEmail,
          role: admin.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Add a new doctor
exports.addDoctor = async (req, res) => {
      console.log("Add doctor API called");
 
      const { 
          name, 
          email, 
          password, 
          experience, 
          fees, 
          about, 
          speciality, 
          degree, 
          address, 
          image 
      } = req.body;
  
      console.log("Received data:", name, email, password, experience, fees, about, speciality, degree, address, image);
  
      try {
          const newDoctor = new Doctor({
              name,
              email,
              password,
              image,
              experience,
              fees: Number(fees),
              about,
              speciality,
              degree,
              address: {
                  line1: address.line1, 
                  line2: address.line2
              },
              available: false, 
              slots_booked: [], 
              date: Date.now(), 
          });
  
       
          await newDoctor.save();
          console.log("newDoctor",newDoctor)
       
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.PASSWORD
            },
        });

        //  HTML email page
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: 'Welcome to Our Hospital - Your Login Credentials',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #4CAF50;">Welcome to Our Hospital, Dr. ${name}!</h2>
                    <p>We are pleased to have you on board. Please find your login credentials below:</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border: 1px solid #ddd;">
                        <p><strong>Username:</strong> ${email}</p>
                        <p><strong>Password:</strong> ${password}</p>
                    </div>
                    <p style="margin-top: 20px;">You can log in to the hospital management system and start managing your appointments.</p>
                    <p>If you have any questions, feel free to reach out to us.</p>
                    <br>
                    <p>Thank you,</p>
                    <p style="font-weight: bold;">Prescripto Admin Team</p>
                    <p style="color: #4CAF50;">Prescripto Hospital</p>
                    <hr style="border-top: 1px solid #eee; margin-top: 20px;">
                    <p style="font-size: 12px; color: #777;">This email is intended for Dr. ${name}. If you are not the intended recipient, please disregard this message.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        
  
          res.status(201).json({ 
            message: 'Doctor added successfully', 
            doctor: newDoctor,
            status:true
        });
      } catch (error) {
        
          res.status(500).json({ message: 'Error adding doctor', error });
      }
  };
  
// Get all doctors
exports.GetDoctors = async (req, res) => {
    try {
      const doctors = await Doctor.find();
  
      if (doctors.length > 0) {
        return res.status(200).json({
          status: true,
          doctors: doctors
        });
      } else {
        return res.status(404).json({
          status: false,
          message: 'No doctors found'
        });
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return res.status(500).json({
        status: false,
        message: 'Server error. Please try again later.'
      });
    }
  };



// Fetch all appointments for admin
exports.GetAllAppointment = async (req, res) => {
  try {
    console.log("api called in get appointment")
    const appointments = await Appointment.find() 
      .populate('docId') 
      .populate('userId'); 

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ success: false, message: 'No appointments found' });
    }

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ success: false, message: 'Error fetching appointments', error: error.message });
  }
};


exports.addDoctorSlots = async (req, res) => {
  const { doctorId } = req.params;
  const { startDate, endDate, slots } = req.body;

  if (!startDate || !endDate || slots.length === 0) {
    return res.status(400).json({ success: false, message: 'Please provide a valid date range and slots' });
  }

  try {
    // Find the doctor by ID
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }


    const allDates = generateDates(startDate, endDate); 
    console.log("doctor.slots_booked.length",doctor.slots_booked.length)
  if( doctor.slots_booked.length === 1){
    console.log("for first time ")
  }
  
    if (!doctor.slots_booked || doctor.slots_booked.length === 1) {
      doctor.slots_booked = [];
    }

    allDates.forEach(date => {
      const formattedDate = moment(date).format('YYYY-MM-DD');

      // Check if the date already exists 
      const existingDateEntry = doctor.slots_booked.find(entry => entry.date === formattedDate);

      if (existingDateEntry) {
        console.log(" If the date exists, only add new slots that are not already there");
        
        // If the date exists, only add new slots 

        slots.forEach(slot => {
          const existingSlot = existingDateEntry.slots.find(s => s.time === slot.time);
          if (!existingSlot) {
            // Add the new slot if it doesn't already exist
            existingDateEntry.slots.push({ time: slot.time, isBooked: slot.isBooked || false });
          }
        });
      } else {
                
        // If the date doesn't exist
        doctor.slots_booked.push({
          date: formattedDate,
          slots: slots.map(slot => ({
            time: slot.time,
            isBooked: slot.isBooked || false 
          }))
        });
      }
    });

    doctor.available=true
    await doctor.save();

    return res.status(200).json({ success: true, doctor });
  } catch (error) {
    console.error('Error adding doctor slots:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const generateDates = (startDate, endDate) => {
  const dates = [];
  let currentDate = moment(startDate);

  while (currentDate.isSameOrBefore(endDate)) {
    dates.push(currentDate.toDate());
    currentDate = currentDate.add(1, 'days');
  }

  return dates;
};


exports.removeDoctor = async (req, res) => {
  console.log("API called for remove with doctorId");
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

        res.json({ message: 'Doctor removed successfully',
          success:true
         });
    } catch (error) {
        console.error("Error in removing doctor:", error); 
        res.status(500).json({ message: 'Error in removing doctor', error: error.message || error });
    }
};


exports.GetDashboard= async (req, res) => {
  try {
      const totalDoctors = await Doctor.countDocuments();
      const totalPatients = await User.countDocuments(); 
      const totalAppointments = await Appointment.countDocuments();

      console.log("counts", totalDoctors, totalPatients, totalAppointments)
      const latestBookings = await Appointment.find()
          .sort({ createdAt: -1 })
          .limit(10)
          .populate('docId') 
          .populate('userId'); 
       console.log("latest booking", latestBookings);
       
      res.status(200).json({
          totalDoctors,
          totalPatients,
          totalAppointments,
          latestBookings,
      });
  } catch (error) {
      console.error("Error fetching admin dashboard stats:", error);
      res.status(500).json({ error: 'Error fetching dashboard statistics' });
  }
}