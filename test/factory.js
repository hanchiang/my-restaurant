
require('dotenv').config({ path: 'variables.env.test' });

const makeServer = async () => {
  const app = require('../app');
  const db = require('../db');
  const port = process.env.PORT || 7777;

  await db.connect()
  const server = app.listen(port, () => {
    // console.log(`Express running → PORT ${port}`);
  });
  return server;
}

module.exports = makeServer;