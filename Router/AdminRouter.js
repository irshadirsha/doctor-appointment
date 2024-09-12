const express = require ('express');
const passport = require('passport');
const router= express.Router()

const { addDoctor, editDoctor, removeDoctor, manageSlots, AdminLogin, GetDoctors, addDoctorSlots } = require('../Controller/AdminController');

router.post('/admin-login',AdminLogin)

router.post('/add-doctor',  addDoctor);
router.get('/get-doctors',  GetDoctors);

router.post('/add-slots/:doctorId', addDoctorSlots);
router.put('/edit-doctor/:doctorId', passport.authenticate('jwt', { session: false }), editDoctor);
router.delete('/remove-doctor/:doctorId', passport.authenticate('jwt', { session: false }), removeDoctor);
router.put('/manage-slots/:doctorId', passport.authenticate('jwt', { session: false }), manageSlots);


module.exports =router
