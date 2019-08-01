const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');

const authController = require('../controllers/auth');
const router = express.Router();

router.post('/login', authController.login);
router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .custom(value => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject('User already exists');
          }
        });
      })
      .normalizeEmail(),
  ],
  authController.signup
);

module.exports = router;
