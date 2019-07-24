const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
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

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('User not found!');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordCorrect = await bcrypt(password, user.password);

    if (!isPasswordCorrect) {
      const error = new Error('Wrong Password!');
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
  } catch (err) {}
};
