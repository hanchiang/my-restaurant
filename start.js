const db = require('./db');
const logger = require('./utils/logger');

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

// Start our app!
const app = require('./app');
const port = process.env.PORT || 7777;

db.connect()
  .then(() => {
    const server = app.listen(port, () => {
      logger.info(`Express running → PORT ${port}`);
    });
  });

