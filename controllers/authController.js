const passport = require('passport');

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