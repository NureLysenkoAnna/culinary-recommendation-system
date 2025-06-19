const User = require('../models/User');

exports.getAllUsers = async () => {
  return await User.find().select('-password');
};

exports.getUserById = async (id) => {
  return await User.findById(id).select('-password');
};

exports.createUser = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email вже використовується');

  const user = new User({ name, email, password, role });
  await user.save();
  return { id: user._id, name: user.name, email: user.email, role: user.role };
};

exports.updateUser = async (id, data) => {
  const user = await User.findById(id);
  if (!user) return null;

  user.name = data.name || user.name;
  user.email = data.email || user.email;
  user.role = data.role || user.role;

  if (data.password) {
    user.password = data.password; // захешовано автоматично при save
  }

  await user.save();
  return user;
};

exports.deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};
