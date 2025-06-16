const User = require('../models/User');

exports.getAllUsers = async () => {
  return await User.find().select('-password');
};

exports.getUserById = async (id) => {
  return await User.findById(id).select('-password');
};

exports.updateUser = async (id, data) => {
  const user = await User.findById(id);
  if (!user) return null;

  user.name = data.name || user.name;
  user.email = data.email || user.email;
  user.role = data.role || user.role;

  await user.save();
  return user;
};

exports.deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};
