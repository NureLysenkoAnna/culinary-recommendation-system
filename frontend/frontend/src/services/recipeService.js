import api from '../api/api';

export const getAllRecipes = async () => {
  const res = await api.get('/recipes');
  return res.data;
};

export const getRecipeById = async (id) => {
  const res = await api.get(`/recipes/${id}`);
  return res.data;
};
