import api from './api';

const recipeService = {
  async getAllRecipes(params = {}) {
    const response = await api.get('/recipes', { params });
    return response.data;
  },

  async getRecipeById(id) {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  async createRecipe(recipeData) {
    const response = await api.post('/recipes', recipeData);
    return response.data;
  },

  async updateRecipe(id, recipeData) {
    const response = await api.put(`/recipes/${id}`, recipeData);
    return response.data;
  },

  async deleteRecipe(id) {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  async searchRecipes(query, filters = {}) {
    const response = await api.get('/recipes/search', {
      params: { q: query, ...filters }
    });
    return response.data;
  },

  async getRecipesByCategory(category) {
    const response = await api.get(`/recipes/category/${category}`);
    return response.data;
  },

  // async addComment(recipeId, comment) {
  //   const response = await api.post(`/recipes/${recipeId}/comments`, comment);
  //   return response.data;
  // },

  async getComments(recipeId) {
    const response = await api.get(`/recipes/${recipeId}/comments`);
    return response.data;
  }
};

export default recipeService;
