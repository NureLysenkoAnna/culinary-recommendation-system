import api from '../api/api';

export const getRecommendedRecipes = async () => {
  const res = await api.get('/recommendations');
  return res.data;
};

export const getRandomRecipe = async () => {
  const res = await api.get('/recommendations/random');
  return res.data;
};
