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
  const query = {};

  if (filters.cuisine) {
    query.cuisine = filters.cuisine;
  }

  if (filters.complexity) {
    query.complexity = filters.complexity;
  }

  if (filters.minTime || filters.maxTime) {
    query.cookingTime = {};
    if (filters.minTime) query.cookingTime.$gte = Number(filters.minTime);
    if (filters.maxTime) query.cookingTime.$lte = Number(filters.maxTime);
  }

  if (filters.ingredient) {
    query.ingredients = { $in: [new RegExp(filters.ingredient, 'i')] };
  }

  //  сортування
  const allowedSortFields = ['title', 'cookingTime', 'createdAt', 'complexity', 'cuisine'];
  const sort = {};

  if (filters.sortBy && allowedSortFields.includes(filters.sortBy)) {
    sort[filters.sortBy] = filters.order === 'desc' ? -1 : 1;
  }

  //console.log('QUERY:', query);
  //console.log('SORT:', sort);

  return await Recipe.find(query).sort(sort);
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



