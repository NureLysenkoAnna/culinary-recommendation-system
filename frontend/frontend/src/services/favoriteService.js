import api from '../api/api';

export const toggleFavorite = async (recipeId) => {
  const res = await api.post(`/favorites/toggle/${recipeId}`);
  return res.data; // { isFavorite: true/false, message: ... }
};

export const getUserFavorites = async () => {
  const res = await api.get('/favorites/user'); // без ID
  return res.data;
};

