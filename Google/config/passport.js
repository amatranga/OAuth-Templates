const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

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

passport.use('google', new GoogleStrategy({
  clientID: auth.googleAuth.GOOGLE_CLIENT_ID,
  clientSecret: auth.googleAuth.GOOGLE_CLIENT_SECRET,
  callbackURL: auth.googleAuth.GOOGLE_CALLBACKURL
},
(token, refreshToken, profile, done) => {
  process.nextTick(() => {
    //look for the user in the database based on their google id
    User.findOne({
      'google.id': profile.id,
      'google.firstName': profile.name.givenName,
      'google.lastName': profile.name.familyName,
      'google.email': profile.email,
      'google.token': profile.token
    }, (err, user) => {
      //if there is an error, immediately stop and return the error
      //an error here is most likely to be an error connecting to the database
      if (err) {
        return done(err);
      }
      //if the user is fornd, log them
      if (user) {
        return done(null, user);  //user found, return them
      } else {
        //if there is no user found with that google id, create one
        const newUser = new User();

        //set all of the Google info in the user model
        newUser.google.id = profile.id;  //sets the users google id
        newUser.token = token  //saves the token that google provides the user
        newUser.google.name = `${profile.name.givenName} ${profile.name.familyName}`;  //sets the users name
        newUser.google.email = profile.emails[0].value;
        //Now that we have a user object, we will save it to the database
        newUser.save((err) => {
          if (err) {
            throw err;
          }
          //if successful, return the new user
          return done(null, newUser);
        });
      }
    });
  });
}));

module.exports = passport;
