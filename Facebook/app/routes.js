const passport = require('../config/passport');

module.exports = (app, passport) => {
  app.get('/', (req, res) => {
    res.render('index.ejs')
  });

  //For any routes that require the user to be logged in, 
  //call the isLoggedIn function before handling the req and res
  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs', {
      user: req.user  //we will get the user from the session
    });
  });

  //route for Facebook authentication and login
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
  }));

  //by default, Facebook will provide information, however, emails need to be specified.
  //this is done by the scope. If desired, further scopes can be specified, but be aware
  //that some scopes require Facebook to review and approve your use of the scope

  app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};
