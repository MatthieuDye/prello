const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require('../models/User');

module.exports = (passport) => {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_REDIRECT_URL,
                passReqToCallback: true
            },
            (req, accessToken, refreshToken, profile, done) => {
                //console.log(profile);
                User.findOne({email: profile.emails[0].value}).then(existingUser => {
                    if (existingUser) {
                        done(null, existingUser);
                    } else {
                        new User({

                            userName:  profile.name.givenName + profile.name.familyName,
                            lastName: profile.name.familyName,
                            firstName: profile.name.givenName,
                            email: profile.emails[0].value,
                            password: "test34560"

                        })
                            .save()
                            .then(user => done(null, user));
                    }
                });

            }
        )
    );
};
