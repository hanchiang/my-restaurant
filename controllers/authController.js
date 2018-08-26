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