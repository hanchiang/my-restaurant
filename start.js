const db = require('./db');

// Make sure we are running node 7.6+
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 7 || (major === 7 && minor <= 5)) {
  console.log('🛑 🌮 🐶 💪 💩\nHey You! \n\t ya you! \n\t\tBuster! \n\tYou\'re on an older version of node that doesn\'t support the latest and greatest things we are learning (Async + Await)! Please go to nodejs.org and download version 7.6 or greater. 👌\n ');
  process.exit();
}

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

// READY?! Let's go!
// db.connect();
// console.log('After db connected!');

// Start our app!
const app = require('./app');
const port = process.env.PORT || 7777;

db.connect()
  .then(() => {
    const server = app.listen(port, () => {
      console.log(`Express running → PORT ${port}`);
    });
  });

