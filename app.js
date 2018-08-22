const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');
const db = require('./db');

// create our Express app
const app = express();

app.set('view engine', 'pug');

app.use(express.static('public'));

// app.use(bodyParser.json());                         // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Pass variables to templates and requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.currentPath = req.path;
  next();
})

// After allllll that above middleware, we finally handle our own routes!
app.use('/', routes);

app.use(errorHandlers.notFound);
app.use(errorHandlers.flashValidationErrors);

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}

// done! we export it so we can start the site in start.js
module.exports = app;
