const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRoleMiddleware');

// CRUD
router.get('/',  getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', authMiddleware, checkRole(['admin']), updateUser);
router.delete('/:id',authMiddleware, checkRole(['admin']), deleteUser);

module.exports = router;
