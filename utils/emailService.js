const nodemailer = require('nodemailer');

exports.sendOtp = async (email, otp) => {
    console.log("sending otp utils");

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.PASSWORD,
        },
    });

    // Styled HTML email template for OTP
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Your OTP for Verification',
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #4CAF50; text-align: center;">OTP Verification</h2>
                <p style="font-size: 16px; color: #555;">
                    Dear User,
                </p>
                <p style="font-size: 16px; color: #555;">
                    Please use the following One-Time Password (OTP) to complete your verification process:
                </p>
                <div style="background-color: #f9f9f9; padding: 15px; border: 1px solid #ddd; text-align: center;">
                    <p style="font-size: 24px; font-weight: bold; color: #333;">${otp}</p>
                </div>
                <p style="font-size: 16px; color: #555; margin-top: 20px;">
                    This OTP is valid for Only 2 Minutes. Please do not share this OTP with anyone for security reasons.
                </p>
                <p style="font-size: 16px; color: #555;">
                    If you did not request this OTP, please ignore this email or contact support.
                </p>
                <br>
                <p>Best regards,</p>
                <p style="font-weight: bold; color: #4CAF50;">Priscripto Team</p>
                <p style="font-size: 12px; color: #777;">This is an automated email. Please do not reply.</p>
                <hr style="border-top: 1px solid #eee; margin-top: 20px;">
                <p style="font-size: 12px; color: #777;">© 2024 Your Company. All rights reserved.</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};


exports.sendInvoice = async (email, invoice) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
    auth: {
        user:process.env.EMAIL_ADDRESS,
        pass:process.env.PASSWORD
    },
  });

    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Appointment Invoice',
        text: `Your invoice is ${invoice}`,
    };

    await transporter.sendMail(mailOptions);
};




// const nodemailer = require("nodemailer");
// require('dotenv').config();
// const sendEmail = async (recipient, subject, message) => {
//   let mailTransporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user:process.env.EMAIL_ADDRESS,
//         pass:process.env.PASSWORD
//     },
//   });

//   let mailOptions = {
//     from: "I-Club",
//     to: recipient,
//     subject: subject,
//     text: message,
//   };

//   try {
//     await mailTransporter.sendMail(mailOptions);
//     console.log("Email sent successfully....");
//   } catch (error) {
//     console.log("Error sending email:", error);
//     throw new Error("Error sending the verification email.");
//   }
// };

// module.exports = sendEmail;
