const recommendationService = require('../services/recommendationService');

exports.getRecommendations = async (req, res) => {
  try {
    const recipes = await recommendationService.getRecommendedRecipes(req.user.id);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Помилка отримання рекомендацій', error: err.message });
  }
};

exports.getRandomRecipe = async (req, res) => {
  try {
    const userId = req.user.id;
    const recipe = await recommendationService.getRandomRecommendedRecipe(userId);

    if (!recipe) {
      return res.status(404).json({ message: 'Не знайдено жодного рецепта, який відповідає вподобанням' });
    }

    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Помилка під час отримання випадкового рецепта', error: err.message });
  }
};

