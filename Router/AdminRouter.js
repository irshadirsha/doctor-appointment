const express = require ('express');
const passport = require('passport');
const router= express.Router()

const { addDoctor, editDoctor, removeDoctor, manageSlots } = require('../Controller/AdminController');

router.post('/add-doctor', passport.authenticate('jwt', { session: false }), addDoctor);
router.put('/edit-doctor/:doctorId', passport.authenticate('jwt', { session: false }), editDoctor);
router.delete('/remove-doctor/:doctorId', passport.authenticate('jwt', { session: false }), removeDoctor);
router.put('/manage-slots/:doctorId', passport.authenticate('jwt', { session: false }), manageSlots);


module.exports =router
