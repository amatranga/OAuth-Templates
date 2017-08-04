const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

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

passport.use('facebook', new FacebookStrategy({
  clientID: auth.facebookAuth.FACEBOOK_CLIENT_ID,
  clientSecret: auth.facebookAuth.FACEBOOK_CLIENT_SECRET,
  callbackURL: auth.facebookAuth.FACEBOOK_CALLBACKURL,
  profileFields: ['id', 'emails', 'name']
},
  (token, refreshToken, profile, done) => {
    process.nextTick(() => {
      //look for the user in the database based on their facebook id
      User.findOne({
        'facebook.id': profile.id,
        'facebook.fisrtName': profile.name.givenName,
        'facebook.lastName': profile.name.familyName,
        'facebook.email': profile.email,
        'facebook.token': profile.token
        }, (err, user) => {
        //if there is an error, immediately stop and return the error
        //an error here is most likely to be an error connecting to the database
        if (err) {
          return done(err);
        }
        //if the user is found, log them in
        if (user) {
          return done(null, user);  //user found, return them
        } else {
          //if there is no user found with that Facebook id, create one
          const newUser = new User();

          //set all of the Facebook info in the user model
          newUser.facebook.id = profile.id;  //sets the users facebook id
          newUser.facebook.token = token;  //saves the token that facebook provides the user
          newUser.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`;  //sets the users name
          newUser.facebook.email = profile.emails[0].value;  //Facebook can return multiple emails, so we will just look at the first one
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
