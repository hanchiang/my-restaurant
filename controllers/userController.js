
const _ = require('lodash');
const md5 = require('md5');

const db = require('../db');
const auth = require('../handlers/auth');
const { validator } = require('../utils');
const { hashPassword } = require('../handlers/auth');

exports.login = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.register = (req, res) => {
  res.render('register', { title: 'Register' });
};

exports.createUser = async (req, res, next) => {
  if (validator.handleValidationError(req)) {
    return res.redirect('/register');
  }

  const existingUser = await db.get().collection('users').findOne({ email: req.body.email });
  if (existingUser) {
    req.flash('error', 'Email is already in use.');
    return res.redirect('/register');
  }

  const now = new Date();
  req.body.created = now;
  req.body.updated = now;

  req.body.hash = await auth.hashPassword(req.body.password);
  const gravatarHash = md5(req.body.email.trim().toLowerCase());
  req.body.gravatar = `https://gravatar.com/avatar/${gravatarHash}?s=200`;

  const user = _.pick(req.body, 'name', 'email', 'hash', 'gravatar', 'created', 'updated');
  await db.get().collection('users').insertOne(user);
  
  next();
}

exports.account = (req, res) => {
  res.render('account', { title: 'My Account' });
}

exports.updateAccount = async (req, res) => {
  if (validator.handleValidationError(req)) {
    return res.redirect('/account');
  }

  await db.get().collection('users').findOneAndUpdate(
    { _id: req.user._id },
    { 
      $set: {
        name: req.body.name,
        email: req.body.email,
        updated: new Date()
      }
    }
  )
  req.flash('success', 'Successfully update profile!')
  res.redirect('/account');
};

exports.updatePassword = async (req, res) => {
  if (validator.handleValidationError(req)) {
    return res.redirect('/account');
  }

  const hash = await hashPassword(req.body.password);

  await db.get().collection('users').findOneAndUpdate(
    { _id: req.user._id },
    { $set: { hash }
    }
  );

  req.flash('success', 'Successfully changed password!');
  res.redirect('/account');
}