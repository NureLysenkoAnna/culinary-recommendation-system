const recipeService = require('../services/recipeService');

// GET /api/recipes
exports.getAllRecipes = async (req, res) => {
  const recipes = await recipeService.getAllRecipes();
  res.json(recipes);
};

// GET /api/recipes/:id
exports.getRecipeById = async (req, res) => {
  const recipe = await recipeService.getRecipeById(req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Рецепт не знайдено' });
  res.json(recipe);
};

// POST /api/recipes
exports.createRecipe = async (req, res) => {
  try {
    const recipe = await recipeService.createRecipe(req.body, req.user?.id);
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Помилка створення рецепта', error: err.message });
  }
};

// PUT /api/recipes/:id
exports.updateRecipe = async (req, res) => {
  const recipe = await recipeService.updateRecipe(req.params.id, req.body);
  if (!recipe) return res.status(404).json({ message: 'Рецепт не знайдено' });
  res.json(recipe);
};

// DELETE /api/recipes/:id
exports.deleteRecipe = async (req, res) => {
  const recipe = await recipeService.deleteRecipe(req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Рецепт не знайдено' });
  res.json({ message: 'Рецепт видалено' });
};

exports.searchRecipes = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ message: 'Потрібно вказати параметр запиту' });
    }

    const results = await recipeService.searchRecipes(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Помилка під час пошуку', error: err.message });
  }
};

exports.filterRecipes = async (req, res) => {
  try {
    const filters = {
      cuisine: req.query.cuisine,
      complexity: req.query.complexity,
      minTime: req.query.minTime,
      maxTime: req.query.maxTime,
      ingredient: req.query.ingredient,
      sortBy: req.query.sortBy,
      order: req.query.order
    };

    console.log('REQ.QUERY:', req.query);

    const results = await recipeService.filterRecipes(filters);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Помилка фільтрації', error: err.message });
  }
};

exports.getRecipesByIngredients = async (req, res) => {
  try {
    const ingredients = req.body.ingredients; // ['картопля', 'молоко', 'яйця']
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: 'Необхідно передати список інгредієнтів' });
    }

    const recipes = await recipeService.findRecipesByIngredients(ingredients);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Помилка пошуку за інгредієнтами', error: err.message });
  }
};

