const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Favorite', favoriteSchema);

