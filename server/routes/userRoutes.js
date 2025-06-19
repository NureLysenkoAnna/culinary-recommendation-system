const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRoleMiddleware');

router.get('/',  getAllUsers);
router.get('/:id', getUserById);
router.post('/', authMiddleware, checkRole(['admin']), createUser);
router.put('/:id', authMiddleware, checkRole(['admin']), updateUser);
router.delete('/:id',authMiddleware, checkRole(['admin']), deleteUser);

module.exports = router;
