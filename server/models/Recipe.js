const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String, // шлях до файлу або URL
    required: false,
    default: ''
  },
    cuisine: {
    type: String,
    enum: ['українська', 'італійська', 'французька', 'індійська', 'китайська', 'японська', 'американська', 'інше'],
    default: 'інше'
  },
  ingredients: [String],
  instructions: {
    type: String,
    required: true,
  },
  cookingTime: Number,
  complexity: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
