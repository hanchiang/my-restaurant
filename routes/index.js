const express = require('express');
const router = express.Router();
const passport = require('passport');

const { catchErrors } = require('../handlers/errorHandlers');
const storeController = require('../controllers/storeController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const reviewController = require('../controllers/reviewController');
const { validator } = require('../utils');

// Store routes
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/page/:page', catchErrors(storeController.getStores));

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

router.get('/tags', catchErrors(storeController.getStoresByTags));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTags));

router.get('/map', storeController.map);
router.get('/hearts', catchErrors(storeController.heartedStores));
router.get('/hearts/page/:page', catchErrors(storeController.heartedStores));
router.get('/top', catchErrors(storeController.topStores));

// Authenticate routes
router.get('/login',
  (req, res, next) => {
    if (req.user) {
      return res.redirect('/');
    }
    next();
  },
  userController.login);
router.post('/login', authController.login);
router.get('/register', userController.register);
router.post('/register',
  validator.validateRegister,
  catchErrors(userController.createUser),
  authController.login
);
router.get('/logout', authController.logout);

router.post('/account/forgot', catchErrors(authController.forgotPassword));
router.get('/account/reset/:token', userController.resetPassword);
router.post('/account/reset/:token', 
  validator.validatePassword,
  authController.updatePassword
);

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

// Review routes
router.post('/reviews/:id',
  authController.isLoggedIn,
  reviewController.addReview
)

// API
router.get('/api/stores/near', catchErrors(storeController.mapStores));
router.get('/api/stores/search', catchErrors(storeController.searchStores));
router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));

module.exports = router;
