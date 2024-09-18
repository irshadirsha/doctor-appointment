const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const Doctor = require('../Model/DoctorModel'); 
const dotenv = require('dotenv');
dotenv.config();
console.log("inside passport 1 Doctor");
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

module.exports = (passport) => {
    console.log("inside passport 2 Doctor");
    passport.use(
        'doctor-rule',
        new JwtStrategy(opts, async (jwt_payload, done) => {
            console.log("Inside passport verification for doctor");
            try {
                console.log("JWT Payload for doctor: ", jwt_payload);

                const doctor = await Doctor.findById(jwt_payload.id);
                if (doctor) {
                    console.log("Doctor authentication successful");
                    console.log(`auth success
                        in side 
                        passport
                        verification
                        for
                        Doctor
                        auth
                        successfull
                        `);

                    return done(null, doctor);
                }
                return done(null, false);
            } catch (error) {
                console.error("Error during doctor authentication: ", error);
                return done(error, false);
            }
        })
    );
};
