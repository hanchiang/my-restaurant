const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');


const validators = {
  'password': body('password').isString().isLength({ min: 6 }).withMessage('Password needs to be at least 6 characters long'),
  'password-confirm': body('password-confirm').custom((value, { req, location, path }) => {
    return value === req.body.password;
  }).withMessage('Passwords do not match'),
  'email': body('email').isEmail().withMessage('Please enter a valid email')
}

// validator middlewares for various functions such as creating a store, registering a user, changing password
exports.validateStore = [
  body('name').isString().exists({ checkFalsy: true }).withMessage('Please enter store name'),
  sanitizeBody('name').escape(),
  body('description').isString().exists({ checkFalsy: true }).withMessage('Please enter store description'),
  sanitizeBody('description').escape(),
  body('address').exists({ checkFalsy: true }).withMessage('Please enter store address'),
  body('location.coordinates').custom(([lng, lat], { req, location, path }) => {
    return (typeof lat === 'string' && typeof lng === 'string' && lat !== '' && lng !== '');
  }).withMessage('Latitude and longitude must be supplied')
];

exports.validateRegister = [
  body('name').isString().exists({ checkFalsy: true }).withMessage('Please enter user name'),
  sanitizeBody('name').escape(),
  validators.email,
  validators.password,
  validators['password-confirm']
];

exports.validateAccount = [
  body('name').isString().exists({ checkFalsy: true }).withMessage('Please enter user name'),
  sanitizeBody('name').escape(),
  validators.email
];

exports.validatePassword = [
  validators.password,
  validators['password-confirm']
]

const setValidationErrors = (req, errors) => {
  errors.map(error => ({ message: error.msg }))
    .forEach(error => {
      req.flash('error', error.message);
    });
}

// If there are validation errors, set the flash errors and return true, else return false
exports.handleValidationError = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    setValidationErrors(req, errors.array());
    return true;
  }
  return false;
};