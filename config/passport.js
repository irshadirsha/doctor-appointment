const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../Model/UserModel');
const dotenv = require('dotenv');
dotenv.config();
const opts = {
    // Extract token from the Authorization header as a Bearer token
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            console.log("inside passport")
            try {
                console.log("JWT Payload-------: ", jwt_payload);

                const user = await User.findById(jwt_payload.id);
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            } catch (error) {
                console.error(error);
                return done(error, false);
            }
        })
    );
};
