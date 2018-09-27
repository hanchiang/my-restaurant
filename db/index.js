const MongoClient = require('mongodb').MongoClient;
const logger = require('../utils/logger');

let db;

const registerErrorEvents = (events) => {
  events.forEach(event => {
    db.on(event, (err) => {
      logger.error({err});
    })
  })
}

exports.connect = () => {
  if (!db) {
    return MongoClient.connect(process.env.DATABASE, { useNewUrlParser: true })
      .then(connection => {
        db = connection.db();
        logger.info('Connected to database!');

        registerErrorEvents(['error', 'timeout', 'parseError']);

        db.on('reconnect', (err) => {
          logger.info('Reconnected to database!');
        });
      })
      .catch(err => {
        db = undefined;
        logger.error({ err });
      });
  }
  return Promise.resolve();
}

exports.get = () => db;