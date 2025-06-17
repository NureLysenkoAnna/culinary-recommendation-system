const authService = require('../services/authService');

exports.registerUser = async (req, res) => {
  try {
    const data = await authService.registerUser(req.body);
    res.status(201).json(data);
  } catch (err) {
    if (err.message === 'Користувач вже існує') {
      return res.status(409).json({ message: 'Цей email вже зареєстровано.' });
    }
    
    res.status(400).json({ message: 'Помилка реєстрації', error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const data = await authService.loginUser(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: 'Помилка входу', error: err.message });
  }
};