require('dotenv').config({ path: 'variables.env.test' });

const app = require('../app');
const db = require('../db');


const makeServer = () => {
  return new Promise((resolve, reject) => {
    const port = process.env.PORT || 7777;

    db.connect()
      .then((s) => {
        const server = app.listen(port, () => {
          resolve(server);
        });
      })
      .catch(err => {
        reject(err);
      })
  })
}

module.exports = makeServer;