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
  clientId: auth.linkedinAuth.LINKEDIN_CLIENT_ID,
  clientSecret: auth.linkedinAuth.LINKEDIN_CLIENT_SECRET,
  callbackURL: auth.linkedinAuth.LINKEDIN_CALLBACKURL,
  profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline']
}, 
  (token, refreshToken, profile, done) => {
    User.findOne({
      'linkedin.id': profile.id,
      'linkedin.email': profile.email,
      'linkedin.name': profile.email,
      'linkedin.token': profile.token
    }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, user);
      } else {
        const newUser = new User();
        newUser.linkedin.id = profile.id;
        newUser.linkedin.email = profile.emails[0].value;
        newUser.linkedin.name = profile.name;
        newUser.linkedin.token = profile.token;

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
