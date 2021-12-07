const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // ERROR full url from local
        callbackURL: 'http://localhost:3333/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        // add user to mongoDB
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };

        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
        //.done add user
      }
    )
  );

  // ERROR: https://stackoverflow.com/questions/19948816/passport-js-error-failed-to-serialize-user-into-session
  passport.serializeUser((user, done) => done(null, user));

  // global session of user
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
