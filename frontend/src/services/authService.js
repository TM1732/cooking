import api from './api';

const authService = {
  async login(username, password) {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async refreshToken() {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  }
};

export default authService;
