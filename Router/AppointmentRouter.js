const express = require('express');
const router = express.Router();
const passport = require('passport');
const { bookAppointment, getBookingHistory } = require('../Controller/AppointmentController');

// Book an appointment
router.post('/book', passport.authenticate('jwt', { session: false }), bookAppointment);

// Get booking history for a user
router.get('/history/:userId', passport.authenticate('jwt', { session: false }), getBookingHistory);

module.exports = router;
