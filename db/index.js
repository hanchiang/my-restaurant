const MongoClient = require('mongodb').MongoClient;

let db;

const registerErrorEvents = (events) => {
  events.forEach(event => {
    db.on(event, (err) => {
      console.log(`⚠⚠⚠ ${err.message}`);
    })
  })
}

exports.connect = () => {
  return MongoClient.connect(process.env.DATABASE, { useNewUrlParser: true })
    .then(connection => {
      db = connection.db();
      console.log('Connected to database 👍👍👍');

      registerErrorEvents(['error', 'timeout', 'parseError']);

      db.on('reconnect', (err) => {
        console.log('Reconnected to database!')
      });
    })
    .catch(err => {
      db = undefined;
      console.log(`☹☹☹ ${err.message}`);
    });
}

exports.get = () => db;