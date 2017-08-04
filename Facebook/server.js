const express = require('express');
const app = express();

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const dbConfig = require('./config/database.js');

//Configuration
mongoose.connect(dbConfig.url);

//set up express application
app.use(morgan('dev'));  //all requests will now be logged to the console
app.use(cookieParser());  //reads cookies, which are needed for auth
app.use(bodyParser());  //get information for html forms

app.set('view engine', 'ejs')  //sets up ejs for templating

//everything here is required for Passport
app.use(session({ secret: 'Whatever you want your session secret to be'}));
//your session secret will be used to sign the session cookie to prevent tampering
app.use(passport.initialize());
app.use(passport.session());  //persistent login sessions
app.use(flash());  //use connect-flash for any flash messages stored in the session

require('./app/routes.js')(app, passport);

//start the server
app.listen(PORT, () => {
  console.log('Facebook example running on port', PORT);
});
