const { check, body } = require('express-validator/check');

module.exports.validateStore = [
  body('name').isString().exists({ checkFalsy: true }).withMessage('Please enter store name'),
  body('description').isString().exists({ checkFalsy: true }).withMessage('Please enter store description'),
  body('location.address').exists({ checkFalsy: true }).withMessage('Please enter store address'),
  body('location.coordinates').custom(([lat, lng], { req, location, path }) => {
    return (typeof lat === 'string' && typeof lng === 'string' && lat !== '' && lng !== '');
  }).withMessage('Latitude and longitude must be supplied')
];