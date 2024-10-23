// src/services/auth.js
import api from './api';

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const requestPasswordReset = (email) =>
  api.post('/auth/reset-password', { email });
export const resetPassword = (token, newPassword) =>
  api.post(`/auth/reset-password/${token}`, { password: newPassword });
export const logout = () => api.post('/auth/logout');
