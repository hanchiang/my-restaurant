const express = require('express');
const router = express.Router();

const { catchErrors } = require('../handlers/errorHandlers');
const storeController = require('../controllers/storeController');
const validator = require('../utils');

// Do work here
router.get('/', storeController.getStores);
router.get('/stores', storeController.getStores);
router.post('/stores',
  storeController.upload,
  validator.validateStore,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore));

router.get('/add', storeController.addStore);


module.exports = router;
