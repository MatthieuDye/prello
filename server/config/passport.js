const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = (passport) => {

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_REDIRECT_URL,
                passReqToCallback: true
            },
            (accessToken, refreshToken, profile, done) => {
                console.log(profile);
                //     User.findOne({ googleId: profile.id }).then(existingUser => {
                //         //         if (existingUser) {
                //         //             done(null, existingUser);
                //         //         } else {
                //         //             new User({
                //         //                 //googleId: profile.id,
                //         //                 userName: pr
                //         //                 firstName: profile.displayName,
                //         //                 email: profile.emails[0].value,
                //         //
                //         //             })
                //         //                 .save()
                //         //                 .then(user => done(null, user));
                //         //         }
                //         //     });

            }
        )
    );
};
