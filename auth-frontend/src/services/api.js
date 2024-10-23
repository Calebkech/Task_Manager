// src/services/api.js
import axios from 'axios';
import { useNavigation } from '../contexts/NavigationContext'; // Import useNavigation

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: function (status) {
    return status >= 200 && status < 300; // Resolve only if status code is 2xx
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { navigate } = useNavigation(); // Get navigate from context
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); // Clear token
      navigate('/login'); // Redirect to login
    }
    return Promise.reject(error);
  }
);

export const getTasks = () => api.get('/tasks');
export const createTask = (taskData) => api.post('/tasks/new-task', taskData);
export const updateTask = (taskId, taskData) =>
  api.put(`/tasks/${taskId}`, taskData);
export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);

export const getSubtasks = (taskId) => api.get(`/tasks/${taskId}/subtasks`);
export const createSubtask = (taskId, subtaskData) =>
  api.post(`/tasks/${taskId}/subtasks`, subtaskData);
export const updateSubtask = (taskId, subtaskId, subtaskData) =>
  api.put(`/tasks/${taskId}/subtasks/${subtaskId}`, subtaskData);
export const deleteSubtask = (taskId, subtaskId) =>
  api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);

export default api;
