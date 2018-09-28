const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const passport = require('passport');
const helmet = require('helmet');

const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');

// create our Express app
const app = express();


app.set('view engine', 'pug');

app.use(helmet());
app.use(express.static('public'));

app.use(bodyParser.json());                         // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ url: process.env.DATABASE })
}))
app.use(flash());

require('./handlers/passport');
app.use(passport.initialize());
app.use(passport.session());

// Pass variables to templates and all requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.currentPath = req.path;
  // flash is an object in the format { key: [message], key2: [message] }
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  next();
})

// After allllll that above middleware, we finally handle our own routes!
app.use('/', routes);

app.use(errorHandlers.notFound);

// app.use(errorHandlers.flashValidationErrors);

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}

// done! we export it so we can start the site in start.js
module.exports = app;
