const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../Model/UserModel');
const dotenv = require('dotenv');
dotenv.config();
console.log("inside passport 1 user");
const opts = {

    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

module.exports = (passport) => {
    console.log("inside passport 2 user");
    passport.use(
        'user-rule',
        new JwtStrategy(opts, async (jwt_payload, done) => {
            console.log("inside passport verification for user")
            try {
                console.log("JWT__Payload------------------>>: ", jwt_payload);

                const user = await User.findById(jwt_payload.id);
                if (user) {
                    console.log(`auth success
                        in side 
                        passport
                        verification
                        for
                        user---------------------------------------------------------->
                        auth
                        successfull
                        `);
                
                    
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
