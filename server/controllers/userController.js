const userService = require('../services/userService');

// GET /api/users
exports.getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });
  res.json(user);
};

// POST /api/users
exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/users/:id
exports.updateUser = async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });

  res.json({ message: 'Користувача оновлено', user });
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  const user = await userService.deleteUser(req.params.id);
  if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });

  res.json({ message: 'Користувача видалено' });
};
