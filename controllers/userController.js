const { validationResult } = require('express-validator/check');
const _ = require('lodash');
const md5 = require('md5');

const db = require('../db');
const auth = require('../handlers/auth');

exports.login = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.register = (req, res) => {
  res.render('register', { title: 'Register' });
};

exports.createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.locals.h.setFlashErrors(req, errors);
    return res.redirect('/register');
  }

  const existingUser = await db.get().collection('users').findOne({ email: req.body.email });
  if (existingUser) {
    req.flash('error', 'Email is already in use.');
    return res.redirect('/register');
  }

  req.body.hash = await auth.hashPassword(req.body.password);
  const gravatarHash = md5(req.body.email.trim().toLowerCase());
  req.body.gravatar = `https://gravatar.com/avatar/${gravatarHash}?s=200`;
  const user = _.pick(req.body, 'name', 'email', 'hash', 'gravatar');
  await db.get().collection('users').insertOne(user);
  
  next();
}