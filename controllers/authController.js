const passport = require('passport');
const db = require('../db');
const mailer = require('../utils/mail');
const validator = require('../utils/validator');
const { hashPassword } = require('../handlers/auth');

exports.login = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  successFlash: 'Welcome!'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('info', 'Bye!');
  res.redirect('/');
}

exports.isLoggedIn = (req, res, next) => {
  if (!req.user) {
    req.flash('error', 'Oops! You need to log in in order to do that.')
    return res.redirect('back');
  }
  next();
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await db.get().collection('users').findOne({ email });

  if (user) {
    const token = Buffer.from(user.email).toString('hex');
    const tokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    const result = await db.get().collection('users').updateOne(
      { email },
      { $set: {
        token,
        tokenExpires,
        updated: new Date()
      }}
    );

    if (result.result.ok === 1) {
      const url = `${process.env.APP_URL}/account/reset/${token}`;
      await mailer.sendMail({url, name: user.name, to: user.email});
      req.flash('success', 'Instructions to reset your password has been sent to your email!')
    } else {
      req.flash('error', 'Server error. Try again later');
    }
  } else {
    req.flash('error', 'Oops! Email not found');
  }
  res.redirect('/login');
}

exports.updatePassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await db.get().collection('users').findOne(
    { token, tokenExpires: { $gt: Date.now() } }
  )

  if (!user) {
    req.flash('error', 'Your reset password request has expired. Please request for a password reset again.')
    return res.redirect('/login');
  }

  if (validator.handleValidationError(req)) {
    return res.redirect('back');
  }

  const hash = await hashPassword(password);

  const result = await db.get().collection('users').updateOne(
    { token },
    { $set: { hash },
      $unset: { token: '', tokenExpires: '' }
    }
  );

  if (result.result.ok === 1) {
    req.flash('success', 'Successfully changed password!');
    res.redirect('/login');
  } else {
    req.flash('Server error. Please try again later.')
    res.redirect('/account/reset')
  }

}