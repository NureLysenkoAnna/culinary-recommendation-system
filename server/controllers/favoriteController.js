const favoriteService = require('../services/favoriteService');

// GET /api/favorites
exports.getAllFavorites = async (req, res) => {
  const favorites = await favoriteService.getAllFavorites();
  res.json(favorites);
};

// GET /api/favorites/user/:userId
exports.getFavoritesByUser = async (req, res) => {
  const favorites = await favoriteService.getFavoritesByUser(req.params.userId);
  res.json(favorites);
};

// POST /api/favorites
exports.addToFavorites = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { recipeId } = req.body;

    const existing = await favoriteService.findExistingFavorite(userId, recipeId);
    if (existing) {
      return res.status(400).json({ message: 'Рецепт вже в улюблених' });
    }

    const favorite = await favoriteService.addFavorite(userId, recipeId);
    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ message: 'Помилка додавання до улюбленого', error: err.message });
  }
};

// PUT /api/favorites/:id
exports.updateFavorite = async (req, res) => {
  const favorite = await favoriteService.updateFavorite(req.params.id, req.body);
  if (!favorite) return res.status(404).json({ message: 'Не знайдено' });

  res.json(favorite);
};

// DELETE /api/favorites/:id
exports.deleteFavorite = async (req, res) => {
  const favorite = await favoriteService.deleteFavorite(req.params.id);
  if (!favorite) return res.status(404).json({ message: 'Не знайдено' });

  res.json({ message: 'Уподобання видалено' });
};

exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipeId } = req.params;

    const result = await favoriteService.toggleFavorite(userId, recipeId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при зміні статусу улюбленого', error: err.message });
  }
};
