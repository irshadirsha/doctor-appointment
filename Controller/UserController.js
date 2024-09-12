const User = require('../Model/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpService = require('../utils/otpService');
const emailService = require('../utils/emailService');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("api called in post register succesfully", name, email, password);
        
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = otpService.generateOtp();
        user = new User({
            name,
            email,
            password: hashedPassword,
            otp,
            otpCreatedAt: new Date(),
            isVerified: false,  
        });

        await user.save();

        await emailService.sendOtp(user.email, user.otp);
        res.status(201).json({ message: 'User registered successfully. OTP sent to email.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// OTP Verification
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log("api called--",email, otp);
        

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (!user.otp) {
            return res.status(400).json({ message: 'your OTP is expired' });
        }
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
       
        user.isVerified = true;
        user.otp = null;
        user.otpCreatedAt = null;  // Reset the otpCreatedAt field
        await user.save();

        res.status(200).json({
            status:true,
             message: 'OTP verified. User registration completed.'
            });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("login api called succesfully");
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Account not verified. Please verify your email.' });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT Token
        const payload = {
                id: user._id,
                email: user.email,
                role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// exports.getdata= async (req, res) => {
//     console.log("api called in check passs");
    
//     let user = await User.find();
//     console.log("user-------", user)
//     res.json({
//         message:"auth passed",
//         data:user
//     })
// }