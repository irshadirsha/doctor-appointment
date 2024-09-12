const Doctor = require('../Model/DoctorModel');
const mongoose = require ('mongoose')
// Add a new doctor
const jwt = require('jsonwebtoken');
const Admin = require('../Model/AdminModel');
const Appointment = require('../Model/AppointmentModel');

// Admin Login
exports.AdminLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log("called admin",email,password)
    try {
      // Find admin by email
      const admin = await Admin.findOne({ adminEmail: email, role: 'admin' });

      if (!admin) {
        return res.status(400).json({ message: 'Admin not found' });
      }
  
      // Verify password
      
      if (password!==admin.adminPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const payload = {
        id: admin._id,
        email: admin.adminEmail,
        role: admin.role
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

  exports.addDoctor = async (req, res) => {
      console.log("Add doctor API called");
  
      // Step 1: Destructure the incoming data from the request body
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
  
    //   console.log("Received data:", name, email, password, experience, fees, about, speciality, degree, address, image);
  
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
              available: true, 
              slots_booked: {}, 
              date: Date.now(), 
          });
  
       
          await newDoctor.save();
          console.log("newDoctor",newDoctor)
  
          res.status(201).json({ 
            message: 'Doctor added successfully', 
            doctor: newDoctor,
            status:true
        });
      } catch (error) {
        
          res.status(500).json({ message: 'Error adding doctor', error });
      }
  };
  

  exports.GetDoctors = async (req, res) => {
    try {
      // Fetch all doctors from the database
      const doctors = await Doctor.find();
  
      // If doctors are found, send them in the response
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
      // Handle any errors that occur during the database query
      console.error('Error fetching doctors:', error);
      return res.status(500).json({
        status: false,
        message: 'Server error. Please try again later.'
      });
    }
  };
  


// Controller to add time slots for a specific doctor
exports.addDoctorSlots = async (req, res) => {
  const { doctorId } = req.params;
  const { startDate, endDate, slots } = req.body; // Extract data from request body
  console.log("api called inside adddoc slott", doctorId, startDate, endDate,slots)
  if (!startDate || !endDate || slots.length === 0) {
    return res.status(400).json({ success: false, message: 'Please provide valid date range and slots' });
  }

  try {
    // Find the doctor by ID
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Add the selected slots for the specified date range
    const slotData = slots.reduce((acc, slot) => {
      acc[slot.time] = { isBooked: slot.isBooked, date: startDate }; // Using the start date for now
      return acc;
    }, {});

    // Add the slot data to the doctor's booked slots
    doctor.slots_booked[startDate] = slotData; // Store based on date

    // Save the updated doctor data
    await doctor.save();
    console.log("d00000",doctor)
    return res.status(200).json({ 
        doctor:doctor,
        success: true,
         message: 'Slots added successfully' 
        });
  } catch (error) {
    console.error('Error adding doctor slots:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
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

