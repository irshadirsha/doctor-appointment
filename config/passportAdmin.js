const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const Admin = require('../Model/AdminModel'); 
const dotenv = require('dotenv');
dotenv.config();
console.log("inside passport 1 Admin");

const opts = {
    //token from the Authorization header
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET, 
};
console.log("inside passport 2 Admin");

module.exports = (passport) => {
console.log("inside passport 3  Admin");

    passport.use(
        'admin-rule',
        new JwtStrategy(opts, async (jwt_payload, done) => {
            console.log("inside passport verification for admin");
            try {
                console.log("JWT Payload for Admin:", jwt_payload);

                const admin = await Admin.findById(jwt_payload.id);
                if (admin) {
                    console.log(`Admin authenticated successfully`);
                    console.log(`auth success
                        in side 
                        passport
                        verification
                        for
                        Admin
                        auth
                        successfull
                        `);
                    return done(null, admin); 
                }
                return done(null, false); 
            } catch (error) {
                console.error(error);
                return done(error, false); 
            }
        })
    );
};
