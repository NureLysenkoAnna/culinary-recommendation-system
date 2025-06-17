const Recipe = require('../models/Recipe');

exports.getAllRecipes = async () => {
  return await Recipe.find().populate('createdBy', 'name email');
};

exports.getRecipeById = async (id) => {
  return await Recipe.findById(id).populate('createdBy', 'name');
};

exports.createRecipe = async (data, userId = null) => {
  const recipe = new Recipe({
    ...data,
    createdBy: userId,
  });
  return await recipe.save();
};

exports.updateRecipe = async (id, data) => {
  return await Recipe.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteRecipe = async (id) => {
  return await Recipe.findByIdAndDelete(id);
};

exports.searchRecipes = async (query) => {
  const regex = new RegExp(query, 'i'); // нечутливий до регістру

  return await Recipe.find({
    $or: [
      { title: regex },
      { ingredients: { $in: regex } },
      { cuisine: regex }
    ]
  });
};

exports.filterRecipes = async (filters) => {
  const {
    query,
    cuisine,
    complexity,
    minTime,
    maxTime,
    ingredient,
    sortBy = 'createdAt',
    order = 'desc'
  } = filters;

  const searchConditions = [];

  if (query) {
    const regex = new RegExp(query, 'i');
    searchConditions.push({
      $or: [
        { title: regex },
        
        { cuisine: regex }
      ]
    });
  }

  if (cuisine) searchConditions.push({ cuisine });
  if (complexity) searchConditions.push({ complexity });
  if (ingredient) searchConditions.push({ ingredients: { $in: [ingredient] } });

  if (minTime || maxTime) {
    const timeFilter = {};
    if (minTime) timeFilter.$gte = Number(minTime);
    if (maxTime) timeFilter.$lte = Number(maxTime);
    searchConditions.push({ cookingTime: timeFilter });
  }

  const sortOption = {};
  sortOption[sortBy] = order === 'asc' ? 1 : -1;

  const finalQuery = searchConditions.length ? { $and: searchConditions } : {};

  return await Recipe.find(finalQuery).sort(sortOption);
};

exports.findRecipesByIngredients = async (userIngredients) => {
  const recipes = await Recipe.find({
    ingredients: { $in: userIngredients.map(i => new RegExp(i, 'i')) }
  });

  const ranked = recipes.map(recipe => {
    const lowerUserIngredients = userIngredients.map(i => i.toLowerCase());

    const matched = recipe.ingredients.filter(ing =>
      lowerUserIngredients.includes(ing.toLowerCase())
    );

    const missing = recipe.ingredients.filter(ing =>
      !lowerUserIngredients.includes(ing.toLowerCase())
    );

    return {
      recipe,
      matchCount: matched.length,
      missingIngredients: missing
    };
  });

  ranked.sort((a, b) => b.matchCount - a.matchCount);

  return ranked.map(r => ({
    _id: r.recipe._id,
    title: r.recipe.title,
    image: r.recipe.image,
    ingredients: r.recipe.ingredients,
    instructions: r.recipe.instructions,
    cookingTime: r.recipe.cookingTime,
    complexity: r.recipe.complexity,
    cuisine: r.recipe.cuisine,
    createdBy: r.recipe.createdBy,
    matchCount: r.matchCount,
    missingIngredients: r.missingIngredients
  }));
};
