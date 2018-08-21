const path = require('path');

const express = require('express');

const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');

// create our Express app
const app = express();

app.set('view engine', 'pug');

app.use(express.static('public'));

// Pass variables to templates and requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.currentPath = req.path;
  next();
})

// After allllll that above middleware, we finally handle our own routes!
app.use('/', routes);

// done! we export it so we can start the site in start.js
module.exports = app;
