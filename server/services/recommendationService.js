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
        query.ingredients = { $nin: ['м’ясо', 'риба', 'курка', 'желатин', 'бекон',
          'ковбаса', 'свинина', 'креветки', 'тунець', 'кальмар', 'лосось'
        ] };
        break;
      case 'vegan':
        query.ingredients = { $nin: ['яловичина', 'свинина', 'курка', 'індичка', 'риба',
          'птиця', 'яйця', 'молоко', 'сир', 'йогурт', 'мед', 'желатин', 'масло', 'кефір',
          'сметана', 'майонез', 'креветки', 'тунець'
        ] };
        break;
      case 'gluten-free':
        query.ingredients = { $nin: ['пшениця', 'ячмінь', 'жито', 'борошно', 'макарони', 
          'хліб', 'панірувальні сухарі', 'пиво', 'лаваш', 'спельта', 'тритикале'
          ] };
        break;
      case 'dairy-free':
        query.ingredients = { $nin: ['молоко', 'сир', 'йогурт', 'масло', 'вершки', 'сухе молоко',
          'сметана', 'кефір', 'казеїн', 'сироватка', 'творог', 'морозиво', 'плавлений сир'
        ] };
        break;
      case 'paleo':
        query.ingredients = { $nin: ['цукор', 'молоко', 'сир', 'кефір', 'нут', 'рис', 'овес', 
          'гречка', 'перероблені продукти', 'рафіновані масла', 'олія', 'маргарин', 'борошно', 
          'соєвий соус','алкоголь', 'сочевиця', 'квасоля'
        ] };
        break;
      case 'keto':
        query.ingredients = { $nin: ['цукор', 'рис', 'картопля', 'хліб', 'макарони', 'мед', 
          'яблуко', 'банан', 'виноград', 'морква', 'буряк', 'молоко', 'горох'
        ] };
        break;
      case 'low-carb':
        query.ingredients = { $nin: ['рис', 'картопля', 'цукор', 'банан', 'виноград', 'хліб', 
          'макарони', 'кукурудза', 'борошно', 'мед'
        ] };
        break;
      case 'low-fat':
        query.ingredients = { $nin: ['масло', 'свинина', 'баранина', 'сир', 'ковбаса', 'майонез', 
          'вершки', 'бекон', 'майонез'
        ] };
        break;
      case 'halal':
        query.ingredients = { $nin: ['свинина', 'свининий жир', 'алкоголь', 'нехаляльне м’ясо', 
          'сало', 'шинка', 'желатин', 'кров', 'молюски'
        ] };
        break;
      case 'kosher':
        query.ingredients = { $nin: ['свинина', 'молюски', 'бекон', 'шинка', 'устриці', 'краби', 
          'кров', 'желатин', 'сир'
        ] };
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

