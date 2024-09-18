const express = require ('express')
const router= express.Router()

const {register, login, verifyOtp, getdata} = require('../Controller/UserController')
router.post('/register', register);

router.post('/verify-otp', verifyOtp)

router.post('/login', login)

// router.get('/data', passport.authenticate('jwt', { session: false }),getdata)

module.exports = router
 