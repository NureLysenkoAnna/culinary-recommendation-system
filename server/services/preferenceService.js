const Preference = require('../models/Preference');

exports.getAllPreferences = async () => {
  return await Preference.find().populate('user', 'name email');
};

exports.getPreferenceByUser = async (userId) => {
  return await Preference.findOne({ user: userId });
};

exports.findExistingPreference = async (userId) => {
  return await Preference.findOne({ user: userId });
};

exports.createPreference = async (data) => {
  const preference = new Preference(data);
  return await preference.save();
};

exports.updatePreference = async (id, data) => {
  return await Preference.findByIdAndUpdate(id, data, { new: true });
};

exports.deletePreference = async (id) => {
  return await Preference.findByIdAndDelete(id);
};
