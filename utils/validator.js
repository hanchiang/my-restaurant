const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter')

module.exports.validateStore = [
  body('name').isString().exists({ checkFalsy: true }).withMessage('Please enter store name'),
  sanitizeBody('name').escape(),
  body('description').isString().exists({ checkFalsy: true }).withMessage('Please enter store description'),
  sanitizeBody('description').escape(),
  body('location.address').exists({ checkFalsy: true }).withMessage('Please enter store address'),
  body('location.coordinates').custom(([lat, lng], { req, location, path }) => {
    return (typeof lat === 'string' && typeof lng === 'string' && lat !== '' && lng !== '');
  }).withMessage('Latitude and longitude must be supplied')
];