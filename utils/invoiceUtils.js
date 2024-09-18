const PDFDocument = require('pdfkit');
const fs = require('fs');

// Generate invoice PDF
exports.generateInvoice = (appointment) => {
    const doc = new PDFDocument();
    const filePath = `./invoices/${appointment._id}.pdf`;
    
    const currentDate = new Date();
    const invoiceDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    
    doc.pipe(fs.createWriteStream(filePath));
    
    // Invoice details
    doc.fontSize(12).text(`Date: ${invoiceDate}`, { align: 'right' });
    doc.moveDown(2).fontSize(20).text('Appointment Invoice', { align: 'center' });
    doc.moveDown(1).fontSize(14).text(`Hello, ${appointment.userData.name},`);
    doc.moveDown(0.5).fontSize(12).text('Thank you for booking your appointment with us.', { align: 'left' });

    // Doctor details
    doc.moveDown(2); 
    doc.fontSize(14).text('Doctor Information:', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Doctor: ${appointment.docData.name}`);
    doc.text(`Specialization: ${appointment.docData.speciality}`);
    doc.text(`Appointment Date: ${appointment.slotDate}`);
    doc.text(`Appointment Time: ${appointment.slotTime}`);
    
    // Transaction information
    doc.moveDown(2); 
    doc.fontSize(14).text('Transaction Information:', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Transaction ID: ${appointment._id}`);
    doc.text(`Fees: ₹${appointment.amount}`);
    doc.text(`Status: ${appointment.isCompleted ? 'Completed' : 'Pending'}`);
 
    doc.moveDown(4).fontSize(14).text('Thank you for choosing our services!', { align: 'center' });

    // Finalize the document
    doc.end();
    
    return filePath; 
};



// const PDFDocument = require('pdfkit');
// const fs = require('fs');

// // Generate invoice PDF
// exports.generateInvoice = (appointment) => {
//     const doc = new PDFDocument();
//     const filePath = `./invoices/${appointment._id}.pdf`;
    
//     const currentDate = new Date();
//     const invoiceDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    
//     doc.pipe(fs.createWriteStream(filePath));
    
//     doc.fontSize(12).text(`Date: ${invoiceDate}`, { align: 'right' });

//     doc.moveDown(2).fontSize(20).text('Appointment Invoice', { align: 'center' });
//     doc.moveDown(1).fontSize(14).text(`Hello, ${appointment.user.name},`);
//     doc.moveDown(0.5).fontSize(12).text('Thank you for booking your appointment with us.', { align: 'left' });

//     doc.moveDown(2); 
//     doc.fontSize(14).text('Doctor Information:', { underline: true });
//     doc.moveDown(0.5);
//     doc.fontSize(12).text(`Doctor: ${appointment.doctor.name}`);
//     doc.text(`Specialization: ${appointment.doctor.specialization}`);
//     doc.text(`Appointment Date: ${appointment.date}`);
//     doc.text(`Appointment Time: ${appointment.time}`);
//     doc.text(`Department: ${appointment.doctor.specialization}`);
    
//     doc.moveDown(2); 

//     doc.fontSize(14).text('Transaction Information:', { underline: true });
//     doc.moveDown(0.5);
//     doc.fontSize(12).text(`Transaction ID: ${appointment.transactionId}`);
//     doc.text(`Status: ${appointment.status}`);
 
//     doc.moveDown(4).fontSize(14).text('Thank you for choosing our services!', { align: 'center' });


//     doc.end();
    
//     return filePath; 
// };


