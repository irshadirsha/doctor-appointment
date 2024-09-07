const express = require ('express')
const router= express.Router()

const { getAvailableDoctors, manageSlots  } = require('../Controller/DoctorController');
const passport = require('passport');

// Get available doctors
router.get('/available-slots', passport.authenticate('jwt', { session: false }), getAvailableDoctors);

// Manage doctor time slots
router.put('/slots/:doctorId', passport.authenticate('jwt', { session: false }), manageSlots);

module.exports = router;

