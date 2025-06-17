import api from '../api/api';

export const getAllRecipes = async () => {
  const res = await api.get('/recipes');
  return res.data;
};

export const getRecipeById = async (id) => {
  const res = await api.get(`/recipes/${id}`);
  return res.data;
};

export const searchRecipes = async (query) => {
  const res = await api.get(`/recipes/search?query=${encodeURIComponent(query)}`);
  return res.data;
};

export const filterRecipes = async (filters) => {
  const queryString = new URLSearchParams(filters).toString();
  const res = await api.get(`/recipes/filter?${queryString}`);
  return res.data;
};

export const findRecipesByIngredients = async (ingredients) => {
  const res = await api.post('/recipes/by-ingredients', { ingredients });
  return res.data;
};


