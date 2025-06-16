const Recipe = require('../models/Recipe');
const Preference = require('../models/Preference');

exports.getRecommendedRecipes = async (userId) => {
  const preference = await Preference.findOne({ user: userId });
  if (!preference) return [];

  const { diet, allergies, dislikedIngredients } = preference;

  const query = {};

  if (diet && diet !== 'none') {
    switch (diet) {
      case 'vegetarian':
        query.ingredients = { $nin: ['м’ясо', 'риба', 'ковбаса', 'бекон'] };
        break;
      case 'vegan':
        query.ingredients = { $nin: ['м’ясо', 'риба', 'яйця', 'молоко', 'сир', 'мед'] };
        break;
      case 'gluten-free':
        query.ingredients = { $nin: ['пшениця', 'борошно', 'макарони', 'хліб'] };
        break;
      case 'keto':
        query.ingredients = { $nin: ['цукор', 'рис', 'картопля', 'хліб', 'макарони'] };
        break;
      case 'low-carb':
        query.ingredients = { $nin: ['рис', 'картопля', 'цукор'] };
        break;
      case 'mediterranean':
        // Не виключаємо нічого, але можна надати перевагу оливковій олії, овочам, рибі
        break;
      default:
        break;
    }
  }

  if (allergies && allergies.length > 0) {
    query.ingredients = query.ingredients || {};
    query.ingredients.$nin = [...(query.ingredients.$nin || []), ...allergies];
  }

  if (dislikedIngredients && dislikedIngredients.length > 0) {
    query.ingredients = query.ingredients || {};
    query.ingredients.$nin = [...(query.ingredients.$nin || []), ...dislikedIngredients];
  }

  return await Recipe.find(query).limit(10);
};

exports.getRandomRecommendedRecipe = async (userId) => {
  const recommended = await exports.getRecommendedRecipes(userId);
  if (!recommended || recommended.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * recommended.length);
  return recommended[randomIndex];
};

