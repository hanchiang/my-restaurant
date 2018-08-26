const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ObjectId = require('mongodb').ObjectID;

const db = require('../db');
const auth = require('./auth');

passport.use(new LocalStrategy(
  {
    usernameField: 'email'
  },
  function(username, password, done) {
    console.log('in local strategy');
    db.get().collection('users').findOne({ email: username })
      .then(async user => {
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        const validPassword = await auth.checkPassword(password, user.hash);
        if (!validPassword) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      })
      .catch(err => {
        return done(err);
      });
  }
));

passport.serializeUser(function(user, done) {
  console.log('in serialise user');
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  console.log('in deserialise user');
  db.get().collection('users').findOne({ _id: ObjectId(id) })
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    })
})