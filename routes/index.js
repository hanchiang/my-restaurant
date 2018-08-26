const express = require('express');
const router = express.Router();
const passport = require('passport');

const { catchErrors } = require('../handlers/errorHandlers');
const storeController = require('../controllers/storeController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { validator } = require('../utils');

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

router.get('/login', userController.login);
router.post('/login', authController.login);
router.get('/register', userController.register);
router.post('/register',
  validator.validateRegister,
  catchErrors(userController.createUser),
  authController.login
);
router.get('/logout', authController.logout);




module.exports = router;
