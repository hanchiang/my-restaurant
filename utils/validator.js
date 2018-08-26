const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter')

exports.validateStore = [
  body('name').isString().exists({ checkFalsy: true }).withMessage('Please enter store name'),
  sanitizeBody('name').escape(),
  body('description').isString().exists({ checkFalsy: true }).withMessage('Please enter store description'),
  sanitizeBody('description').escape(),
  body('location.address').exists({ checkFalsy: true }).withMessage('Please enter store address'),
  body('location.coordinates').custom(([lng, lat], { req, location, path }) => {
    return (typeof lat === 'string' && typeof lng === 'string' && lat !== '' && lng !== '');
  }).withMessage('Latitude and longitude must be supplied')
];

exports.validateRegister = [
  body('name').isString().exists({ checkFalsy: true }).withMessage('Please enter user name'),
  sanitizeBody('name').escape(),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isString().isLength({ min: 6 }).withMessage('Password needs to be at least 6 characters long'),
  body('password-confirm').custom((value, { req, location, path }) => {
    return value === req.body.password;
  })
    .withMessage('Passwords do not match')
];