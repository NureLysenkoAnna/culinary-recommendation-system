const express = require('express');
const router = express.Router();
const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  filterRecipes,
  searchRecipes,
  getRecipesByIngredients
} = require('../controllers/recipeController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRoleMiddleware');

router.get('/filter', filterRecipes);
router.get('/search', searchRecipes);
router.post('/by-ingredients', getRecipesByIngredients);

router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.post('/', authMiddleware, checkRole(['moderator']), createRecipe);
router.put('/:id', authMiddleware, checkRole(['moderator']), updateRecipe);
router.delete('/:id', authMiddleware, checkRole(['moderator']), deleteRecipe);

module.exports = router;
