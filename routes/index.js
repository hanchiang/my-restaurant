const express = require('express');
const router = express.Router();
const passport = require('passport');

const { catchErrors } = require('../handlers/errorHandlers');
const storeController = require('../controllers/storeController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { validator } = require('../utils');

// Store routes
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));

router.get('/add', authController.isLoggedIn, storeController.addStore);
router.post('/stores',
  storeController.upload,
  validator.validateStore,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore));

router.get('/stores/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.post('/stores/:id',
  storeController.upload,
  validator.validateStore,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);

// Authenticate routes
router.get('/login', userController.login);
router.post('/login', authController.login);
router.get('/register', userController.register);
router.post('/register',
  validator.validateRegister,
  catchErrors(userController.createUser),
  authController.login
);
router.get('/logout', authController.logout);

// Account routes
router.get('/account', userController.account);
router.post('/account',
  validator.validateAccount,
  catchErrors(userController.updateAccount)
);
router.post('/account/password', 
  validator.validatePassword,
  userController.updatePassword
);




module.exports = router;
