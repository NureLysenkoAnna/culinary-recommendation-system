const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  diet: {
    type: String,
    enum: [
      'none',
      'vegetarian',
      'vegan',
      'gluten-free',
      'dairy-free',
      'paleo',
      'keto',
      'low-carb',
      'low-fat',
      'halal',
      'kosher'
    ],
    default: 'none'
  },
  allergies: [String], // ['nuts', 'gluten']
  dislikedIngredients: [String] // ['broccoli', 'onion']
}, { timestamps: true });

module.exports = mongoose.model('Preference', preferenceSchema);