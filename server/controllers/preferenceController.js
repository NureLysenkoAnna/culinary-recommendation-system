const preferenceService = require('../services/preferenceService');

// GET /api/preferences
exports.getAllPreferences = async (req, res) => {
  const preferences = await preferenceService.getAllPreferences();
  res.json(preferences);
};

// GET /api/preferences/user/:userId
exports.getPreferenceByUser = async (req, res) => {
  const preference = await preferenceService.getPreferenceByUser(req.params.userId);
  if (!preference) return res.status(404).json({ message: 'Налаштувань не знайдено' });
  res.json(preference);
};

// POST /api/preferences
exports.createPreference = async (req, res) => {
  try {
    const user = req.user?.id;

    const { diet, allergies, dislikedIngredients } = req.body;

    const existing = await preferenceService.findExistingPreference(user);
    if (existing) {
      return res.status(400).json({ message: 'Налаштування вже існують' });
    }

    const preference = await preferenceService.createPreference({
      user,
      diet,
      allergies,
      dislikedIngredients
    });

    res.status(201).json(preference);
  } catch (err) {
    res.status(500).json({ message: 'Помилка створення вподобань', error: err.message });
  }
};


// PUT /api/preferences/:id
exports.updatePreference = async (req, res) => {
  const preference = await preferenceService.updatePreference(req.params.id, req.body);
  if (!preference) return res.status(404).json({ message: 'Налаштувань не знайдено' });

  res.json(preference);
};

// DELETE /api/preferences/:id
exports.deletePreference = async (req, res) => {
  const preference = await preferenceService.deletePreference(req.params.id);
  if (!preference) return res.status(404).json({ message: 'Налаштувань не знайдено' });

  res.json({ message: 'Налаштування видалено' });
};