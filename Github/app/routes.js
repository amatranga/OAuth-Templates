const passport = require('../config/passport');

module.exports = (app, passport) => {
  app.get('/', (req, res) => {
    res.render('index.ejs')
  });

  //For any routes that requrie the user to be logged in,
  //call the isLoggedIn function before handling the req and res
  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs', {
      user: req.user  //we will get the user from the session
    });
  });

  //route for Google authentication and login
  app.get('/auth/github', passport.authenticate('github', {
    scope: ['user:email']
  }));

  app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  });

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
}
