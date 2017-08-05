const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

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

passport.use('github', new GitHubStrategy({
  clientID: auth.githubAuth.GITHUB_CLIENT_ID,
  clientSecret: auth.githubAuth.GITHUB_CLIENT_SECRET,
  callbackURL: auth.githubAuth.GITHUB_CALLBACKURL
},
(token, refreshToken, profile, done) => {
  process.nextTick(() => {
    //look for the user in the database based on their github id
    User.findOne({
      'github.id': profile.id,
      'github.login': profile.login,
      'github.name': profile.name,
      'github.username': profile.username,
      'github.email': profile.email
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
        //if there is no user found with that github id, create one
        const newUser = new User();

        //set all of the github info in the user model
        newUser.github.id = profile.id;  //sets the users github id
        newUser.github.token = token  //saves the token that github provides the user
        newUser.github.name = profile.displayName;  //sets the users name
        newUser.github.username = profile.username;
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
