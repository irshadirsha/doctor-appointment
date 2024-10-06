const User = require('../Model/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpService = require('../utils/otpService');
const emailService = require('../utils/emailService');
const mongoose = require('mongoose');

// Helper function to generate tokens
const generateToken = (payload, secret, expiresIn) => {
    return jwt.sign(payload, secret, { expiresIn });
};
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
        console.log("otp",otp);
        
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
        user.otpCreatedAt = null;  
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
        console.log("login api called succesfully");
        const { email, password } = req.body;
        console.log("login api called succesfully",email,passowrd);
        
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
                role: "user"
        };

        const accessToken = generateToken(payload, process.env.JWT_SECRET, '1d'); 
        const refreshToken = generateToken(payload, process.env.JWT_REFRESH_SECRET, '7d');
        // const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });
        user.refreshToken = refreshToken;
        await user.save();
        res.json({
            // token,
            accessToken,
            refreshToken,
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

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
console.log("refresh token api called inuser ",refreshToken);

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
         console.log("decoded in user",decoded)
        // Check if the refresh token matches what's stored in the database
        const user = await User.findById(decoded.id);
        console.log("user--------",user);
        
        if (!user || user.refreshToken !== refreshToken) {
            console.log('invalid refresh token')
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Generate a new access token
        const payload = { id: user._id, email: user.email, role: "user" };
        const newAccessToken = generateToken(payload, process.env.JWT_SECRET, '1d');
        console.log("new access token",newAccessToken);
        
        res.json({
            accessToken: newAccessToken
        });
    } catch (error) {
        console.error("Error refreshing token:", error);
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
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