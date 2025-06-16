const express = require('express');
const router = express.Router();
const {
  getAllFavorites,
  getFavoritesByUser,
  addToFavorites,
  updateFavorite,
  deleteFavorite,
  toggleFavorite
} = require('../controllers/favoriteController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRoleMiddleware');

router.post('/toggle/:recipeId', authMiddleware, checkRole(['user']), toggleFavorite);
router.get('/', getAllFavorites);
router.get('/user/:userId',authMiddleware, getFavoritesByUser);
router.post('/', authMiddleware, checkRole(['user','admin', 'moderator']), addToFavorites);
router.put('/:id', authMiddleware, checkRole(['user','admin', 'moderator']), updateFavorite);
router.delete('/:id', authMiddleware, checkRole(['user','admin', 'moderator']), deleteFavorite);

module.exports = router;
