const express = require('express');
const router = express.Router();
const passport = require('passport');
const path = require('path');
const {   BookAppointment, 
          getDoctorSlots,
          getBookingHistory,
          DownloadInvoice,
          CancelAppointment, 
          CreateOrder,
          ConfirmPayment} = require('../Controller/AppointmentController');

router.post('/create-order', CreateOrder);
router.post('/confirm-payment', ConfirmPayment);
router.get('/book-appointment/:docId',getDoctorSlots);
router.post('/book-appointment',passport.authenticate('user-rule', { session: false }), BookAppointment);
router.get('/download/:appointmentId', DownloadInvoice);
router.get('/booking-history/:userId',passport.authenticate('user-rule', { session: false }), getBookingHistory);
router.get('/cancel-appoint/:appId',passport.authenticate('user-rule', { session: false }), CancelAppointment);

module.exports = router;


                    