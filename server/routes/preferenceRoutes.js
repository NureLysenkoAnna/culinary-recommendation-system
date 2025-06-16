const express = require('express');
const router = express.Router();
const {
  getAllPreferences,
  getPreferenceByUser,
  createPreference,
  updatePreference,
  deletePreference
} = require('../controllers/preferenceController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRoleMiddleware');

router.get('/', getAllPreferences);
router.get('/user/:userId', getPreferenceByUser);
router.post('/', authMiddleware, checkRole(['user']), createPreference);
router.put('/:id', authMiddleware, checkRole(['user']), updatePreference);
router.delete('/:id', authMiddleware, checkRole(['user']), deletePreference);

module.exports = router;