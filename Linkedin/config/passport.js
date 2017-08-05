const passport = require('passport');
const LinkedinStrategy = require('passport-linkedin').Strategy;

const User = require('../app/models/user');
const auth = require('./auth');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use('linkedin', new LinkedinStrategy({
  consumerKey: auth.linkedinAuth.LINKEDIN_API_KEY,
  consumerSecret: auth.linkedinAuth.LINKEDIN_SECRET_KEY,
  callbackURL: auth.linkedinAuth.LINKEDIN_CALLBACKURL,
  profileFields: auth.linkedinAuth.LINKEDIN_SCOPE
}, 
  (token, refreshToken, profile, done) => {
    User.findOne({
      'linkedin.id': profile.id,
      'linkedin.email': profile.email,
      'linkedin.name': profile.displayName,
      'linkedin.headline': profile.headline
    }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, user);
      } else {
        const newUser = new User();
        newUser.linkedin.id = profile.id;
        newUser.linkedin.name = profile.displayName;
        newUser.linkedin.email = profile.emails[0].value;
        newUser.linkedin.headline = profile._json.headline;

        newUser.save((err) => {
          if (err) {
            throw err;
          }
          return done(null, newUser);
        });
      }
    });
  }));

module.exports = passport;
