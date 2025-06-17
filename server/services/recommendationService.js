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
        query.ingredients = { $nin: ['м’ясо', 'риба', 'птиця', 'желатин', 'бекон', 'ковбаса'] };
        break;
      case 'vegan':
        query.ingredients = { $nin: ['м’ясо', 'риба', 'птиця', 'яйця', 'молоко', 'сир', 'йогурт', 'мед', 'желатин', 'масло'] };
        break;
      case 'gluten-free':
        query.ingredients = { $nin: ['пшениця', 'ячмінь', 'жито', 'борошно', 'макарони', 'хліб', 'панірувальні сухарі', 'пиво'] };
        break;
      case 'dairy-free':
        query.ingredients = { $nin: ['молоко', 'сир', 'йогурт', 'масло', 'вершки', 'сухе молоко'] };
        break;
      case 'paleo':
        query.ingredients = { $nin: ['зернові', 'бобові', 'цукор', 'молочні продукти', 'перероблені продукти', 'рафіновані масла'] };
        break;
      case 'keto':
        query.ingredients = { $nin: ['цукор', 'рис', 'картопля', 'хліб', 'макарони', 'мед', 'фрукти з високим вмістом цукру'] };
        break;
      case 'low-carb':
        query.ingredients = { $nin: ['рис', 'картопля', 'цукор', 'фрукти', 'солодощі', 'хліб', 'макарони'] };
        break;
      case 'low-fat':
        query.ingredients = { $nin: ['масло', 'жирне м’ясо', 'сир', 'ковбаса', 'майонез', 'вершки'] };
        break;
      case 'halal':
        query.ingredients = { $nin: ['свинина', 'свининий жир', 'алкоголь', 'нехаляльне м’ясо'] };
        break;
      case 'kosher':
        query.ingredients = { $nin: ['свинина', 'молюски', 'м’ясо і молоко разом', 'некашерне м’ясо'] };
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

