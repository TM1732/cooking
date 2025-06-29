// /services/commentService.js
import api from './api';

const commentService = {
  // Lister les commentaires d'une recette
  getByRecipe: async (recipeId) => {
    const res = await api.get(`/comments/recipe/${recipeId}`);
    return res.data;
  },
  // Ajouter un commentaire à une recette
  add: async (recipeId, content) => {
    const res = await api.post(`/comments/recipe/${recipeId}`, { content });
    return res.data;
  },
  // Supprimer un commentaire
  remove: async (commentId) => {
    const res = await api.delete(`/comments/${commentId}`);
    return res.data;
  },
  // Compter les commentaires
  count: async () => {
    const res = await api.count();
    return res.data;
  }
};

export default commentService;
