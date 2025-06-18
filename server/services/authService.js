const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '2h',
  });
};

exports.registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Користувач вже існує');
  }

  const user = new User({ name, email, password });
  await user.save();

  const token = generateToken(user);
  return { user: { id: user._id, name: user.name, email: user.email, }, token };
};

exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Неправильний email або пароль');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Неправильний email або пароль');
  }

  const token = generateToken(user);
  return { user: { id: user._id, name: user.name, role: user.role, email: user.email }, token };
};
