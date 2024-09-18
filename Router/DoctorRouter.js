const express = require ('express')
const router= express.Router()
const passport = require('passport');

const { 
    DoctorLogin, 
    DoctorProfile, 
    getDoctorAppointments,  
    CancelAppointment,
    CompleteAppointment,
    DoctorDashBoard} = require('../Controller/DoctorController');

router.post('/doctor-login',DoctorLogin)
router.get('/doctor-profile/:id', passport.authenticate('doctor-rule', { session: false }), DoctorProfile)
router.get('/doctor-appointments/:doctorId',passport.authenticate('doctor-rule', { session: false }),  getDoctorAppointments);              
router.put('/cancel-appoint/:docId/:appointmentId',passport.authenticate('doctor-rule', { session: false }),  CancelAppointment);
router.put('/complete-appoint/:docId/:appointmentId', passport.authenticate('doctor-rule', { session: false }),  CompleteAppointment);
router.get('/doctor-dashboard/:docId',passport.authenticate('doctor-rule', { session: false }),  DoctorDashBoard);             

module.exports = router;

//