import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import recipeService from '../services/recipeService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';
import RecipeComments from '../components/forms/RecipeComments';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteError, setDeleteError] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Charger la recette
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await recipeService.getRecipeById(id);
        setRecipe(data);
      } catch (error) {
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  // Affichage du loader
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Si la recette n'existe pas
  if (!recipe) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl text-white font-bold mb-4">Recette non trouvée</h2>
            <p className="text-white/80 mb-6">Impossible d'afficher cette recette.</p>
            <button
              onClick={() => navigate('/recipes')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Retour aux recettes
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Fonction suppression
  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) return;
    
    try {
      await recipeService.deleteRecipe(id);
      navigate('/recipes');
    } catch (error) {
      setDeleteError("Erreur lors de la suppression de la recette.");
    }
  };

  // Peut-on modifier/supprimer ?
  const canEditOrDelete =
    isAuthenticated &&
    (user.role === 'ADMIN' ||
      (recipe.author && String(user.id) === String(recipe.author.id)));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Carte principale de la recette */}
      <Card className="relative overflow-hidden">
        {/* Header avec titre et infos */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-4 text-white leading-tight">
            {recipe.title}
          </h1>
          
          <div className="flex items-center flex-wrap gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {recipe.author?.username?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="text-white/90 font-medium">
                Par <strong>{recipe.author?.username || 'Inconnu'}</strong>
              </span>
            </div>
            
            {recipe.category && (
              <span className="px-3 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-200 text-sm rounded-full">
                {recipe.category}
              </span>
            )}
            
            <span className="text-white/60 text-sm">
              Créé le {new Date(recipe.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>

          {/* Boutons d'action */}
          {canEditOrDelete && (
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                onClick={() => navigate(`/recipes/${id}/edit`)}
              >
                <span>✏️</span>
                <span>Modifier</span>
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                onClick={handleDelete}
              >
                <span>🗑️</span>
                <span>Supprimer</span>
              </button>
            </div>
          )}

          {/* Message d'erreur */}
          {deleteError && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4">
              <div className="flex items-center space-x-2">
                <span>⚠️</span>
                <span>{deleteError}</span>
              </div>
            </div>
          )}
        </div>

        {/* Contenu de la recette */}
        <div className="space-y-8">
          
          {/* Ingrédients */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🛒</span>
              <h3 className="text-xl font-semibold text-white">Ingrédients</h3>
            </div>
            <div className="text-white/90 leading-relaxed whitespace-pre-line">
              {recipe.ingredients}
            </div>
          </div>

          {/* Instructions */}
          {recipe.instructions && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">👨‍🍳</span>
                <h3 className="text-xl font-semibold text-white">Instructions</h3>
              </div>
              <div className="text-white/90 leading-relaxed whitespace-pre-line">
                {recipe.instructions}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Boutons de navigation */}
      <div className="flex justify-center space-x-4">
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          onClick={() => navigate('/dashboard')}
        >
          <span>🏠</span>
          <span>Retour au dashboard</span>
        </button>
        
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          onClick={() => navigate('/recipes')}
        >
          <span>📚</span>
          <span>Toutes les recettes</span>
        </button>
      </div>

      {/* Zone commentaires */}
      <div className="mt-12">
        <RecipeComments recipeId={id} />
      </div>
    </div>
  );
};

export default RecipeDetailPage;