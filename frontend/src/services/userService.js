// src/services/userService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8181/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Intercepteur pour ajouter le token JWT automatiquement à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Gère les erreurs Axios et extrait un message pertinent
 * @param {any} error
 * @returns {never}
 */
function handleError(error) {
  // Affiche l'erreur détaillée pour debug
  console.error('UserService error:', error);
  if (error.response && error.response.data && error.response.data.message) {
    throw new Error(error.response.data.message);
  }
  throw error;
}

const userService = {
  /**
   * Récupérer tous les utilisateurs (admin)
   * @returns {Promise<Array>}
   */
  async getAllUsers() {
    try {
      const { data } = await apiClient.get('/users');
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Créer un nouvel utilisateur (admin)
   * @param {Object} userData - {username, email, password, role}
   * @returns {Promise<any>}
   */
  async createUser(userData) {
    try {
      const { data } = await apiClient.post('/users', userData);
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Récupérer un utilisateur par ID
   * @param {number|string} userId
   * @returns {Promise<any>}
   */
  async getUserById(userId) {
    try {
      const { data } = await apiClient.get(`/users/${userId}`);
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Mettre à jour les informations d'un utilisateur (admin)
   * @param {number|string} userId
   * @param {Object} userData - {username?, email?, password?, role?}
   * @returns {Promise<any>}
   */
  async updateUser(userId, userData) {
    try {
      const { data } = await apiClient.put(`/users/${userId}`, userData);
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Mettre à jour le rôle d'un utilisateur (admin)
   * @param {number|string} userId
   * @param {string} newRole
   * @returns {Promise<any>}
   */
  async updateUserRole(userId, newRole) {
    try {
      const { data } = await apiClient.patch(`/users/${userId}/role`, { role: newRole });
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Mettre à jour le statut d'un utilisateur (admin)
   * @param {number|string} userId
   * @param {string} status - 'active' ou 'suspended'
   * @returns {Promise<any>}
   */
  async updateUserStatus(userId, status) {
    try {
      const { data } = await apiClient.patch(`/users/${userId}/status`, { status });
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Supprimer un utilisateur (admin)
   * @param {number|string} userId
   * @returns {Promise<any>}
   */
  async deleteUser(userId) {
    try {
      const { data } = await apiClient.delete(`/users/${userId}`);
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Obtenir les statistiques utilisateurs (admin)
   * @returns {Promise<any>}
   */
  async getUserStats() {
    try {
      const { data } = await apiClient.get('/users/stats');
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Rechercher des utilisateurs par critères (admin)
   * @param {Object} criteria - {search?, role?, status?, page?, size?}
   * @returns {Promise<any>}
   */
  async searchUsers(criteria = {}) {
    try {
      const params = new URLSearchParams();
      
      if (criteria.search) params.append('search', criteria.search);
      if (criteria.role) params.append('role', criteria.role);
      if (criteria.status) params.append('status', criteria.status);
      if (criteria.page !== undefined) params.append('page', criteria.page);
      if (criteria.size !== undefined) params.append('size', criteria.size);
      
      const { data } = await apiClient.get(`/users/search?${params.toString()}`);
      return data;
    } catch (error) {
      handleError(error);
    }
  }
};

export default userService;