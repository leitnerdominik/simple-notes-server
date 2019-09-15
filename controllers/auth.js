const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
  console.log('BODY: ', req.body);
  const errors = validationResult(req);
  console.log(errors.array());

  if (!errors.isEmpty()) {
    console.log('ERROR');

    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;

  if (password !== passwordConfirm) {
    const error = new Error('Password dont match!');
    error.statusCode = 401;
    throw error;
  }

  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const createdUser = new User({
      email,
      name,
      password: hashedPw,
    });

    const user = await createdUser.save();

    res.status(201).json({ message: 'User created!' });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('User not found!');
      error.message = 'Wrong credentials!';
      error.statusCode = 401;
      throw error;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      const error = new Error('Wrong Password!');
      error.message = 'Wrong credentials!';
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      'supersecretpassword',
      { expiresIn: '1h' }
    );
    res
      .status(200)
      .json({
        message: 'Logged in successfully!',
        token: token,
        userId: user._id.toString(),
      });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
