const Favorite = require('../models/Favorite');

exports.getAllFavorites = async () => {
  return await Favorite.find().populate('user', 'name').populate('recipe', 'title');
};

exports.getFavoritesByUser = async (userId) => {
  return await Favorite.find({ user: userId }).populate('recipe');
};

exports.findExistingFavorite = async (userId, recipeId) => {
  return await Favorite.findOne({ user: userId, recipe: recipeId });
};

exports.addFavorite = async (userId, recipeId) => {
  const favorite = new Favorite({
    user: userId,
    recipe: recipeId,
  });
  return await favorite.save();
};

exports.updateFavorite = async (id, data) => {
  return await Favorite.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteFavorite = async (id) => {
  return await Favorite.findByIdAndDelete(id);
};

exports.toggleFavorite = async (userId, recipeId) => {
  const existing = await Favorite.findOne({ user: userId, recipe: recipeId });

  if (existing) {
    await Favorite.deleteOne({ _id: existing._id });
    return { message: 'Рецепт видалено з улюбленого', isFavorite: false };
  } else {
    const newFavorite = new Favorite({ user: userId, recipe: recipeId });
    await newFavorite.save();
    return { message: 'Рецепт додано до улюбленого', isFavorite: true };
  }
};
