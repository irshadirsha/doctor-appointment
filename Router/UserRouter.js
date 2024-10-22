const express = require ('express')
const router= express.Router()

const {register, login, verifyOtp, getdata, refreshToken} = require('../Controller/UserController')
router.post('/register', register);

router.post('/verify-otp', verifyOtp)

router.post('/login', login)

router.post('/refresh-token',refreshToken)

module.exports = router
// router.get('/data', passport.authenticate('jwt', { session: false }),getdata)
 