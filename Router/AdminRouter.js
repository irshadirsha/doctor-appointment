const express = require ('express');
const passport = require('passport');
const router= express.Router()

const { addDoctor,
        removeDoctor, 
        AdminLogin, 
        GetDoctors, 
        addDoctorSlots, 
        GetAllAppointment, 
        GetDashboard} = require('../Controller/AdminController');

router.post('/admin-login',AdminLogin)

router.post('/add-doctor',passport.authenticate('admin-rule', { session: false }),  addDoctor);
router.get('/get-doctors', GetDoctors);
router.get('/get-appointment',passport.authenticate('admin-rule', { session: false }),GetAllAppointment) 
router.post('/add-slots/:doctorId',passport.authenticate('admin-rule', { session: false }), addDoctorSlots);
router.delete('/remove-doctor/:doctorId',passport.authenticate('admin-rule', { session: false }), removeDoctor);
router.get('/dashboard-stats',passport.authenticate('admin-rule', { session: false }), GetDashboard)


module.exports =router
     