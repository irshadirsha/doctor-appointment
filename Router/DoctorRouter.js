const express = require ('express')
const router= express.Router()

const { getAvailableDoctors, manageSlots, getAvailableDoctorsOnDate, getAvailableDoctorsOnSpec, DoctorLogin, DoctorProfile  } = require('../Controller/DoctorController');
const passport = require('passport');

// Get available doctors
router.post('/doctor-login',DoctorLogin)
router.get('/doctor-profile/:id',DoctorProfile)

router.get('/available-doctor', passport.authenticate('jwt', { session: false }), getAvailableDoctors);
router.get('/available-doctor-date/:day/:month/:year', passport.authenticate('jwt', { session: false }), getAvailableDoctorsOnDate);
router.get('/available-doctor-spec', passport.authenticate('jwt', { session: false }), getAvailableDoctorsOnSpec);

// Manage doctor time slots
router.put('/slots/:doctorId', passport.authenticate('jwt', { session: false }), manageSlots);

module.exports = router;

