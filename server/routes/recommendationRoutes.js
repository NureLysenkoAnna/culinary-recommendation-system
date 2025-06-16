const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRoleMiddleware');

router.get('/recommendations', authMiddleware, checkRole(['user']), recommendationController.getRecommendations);

router.get('/random', authMiddleware, checkRole(['user']), recommendationController.getRandomRecipe);

module.exports = router;
