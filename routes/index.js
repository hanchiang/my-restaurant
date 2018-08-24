const express = require('express');
const router = express.Router();

const { catchErrors } = require('../handlers/errorHandlers');
const storeController = require('../controllers/storeController');
const validator = require('../utils');

// Do work here
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.post('/stores',
  storeController.upload,
  validator.validateStore,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore));

router.get('/add', storeController.addStore);
router.get('/stores/:slug', catchErrors(storeController.getStoreBySlug));


module.exports = router;
