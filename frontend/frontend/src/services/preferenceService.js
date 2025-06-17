import api from '../api/api';

export const getUserPreference = async (userId) => {
  const res = await api.get(`/preferences/user/${userId}`);
  return res.data;
};

export const createPreference = async (data) => {
  const res = await api.post('/preferences', data);
  return res.data;
};

export const updatePreference = async (id, data) => {
  const res = await api.put(`/preferences/${id}`, data);
  return res.data;
};
