import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeForm from '../components/forms/RecipeForm';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import recipeService from '../services/recipeService';

const EditRecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await recipeService.getRecipeById(id);
        setRecipe(data);
        setError('');
      } catch (err) {
        setError('Impossible de charger cette recette.');
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError('');
      await recipeService.updateRecipe(id, formData);
      navigate(`/recipes/${id}`);
    } catch (err) {
      setError('Erreur lors de la mise à jour de la recette.');
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/recipes/${id}`);
  };

  // État de chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="text-white mt-4">Chargement de la recette...</p>
        </div>
      </div>
    );
  }

  // Recette non trouvée
  if (!recipe) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl text-white font-bold mb-4">Recette non trouvée</h2>
            <p className="text-white/80 mb-6">
              {error || 'La recette que vous tentez de modifier n\'existe pas ou n\'est plus accessible.'}
            </p>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/recipes')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Voir toutes les recettes
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Retour au dashboard
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header de la page */}
      <div className="text-center">
        <div className="text-5xl mb-4">✏️</div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Modifier la recette
        </h1>
        <p className="text-white/80 text-lg">
          Apportez vos modifications à <strong>"{recipe.title}"</strong>
        </p>
      </div>

      {/* Boutons de navigation */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleCancel}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          disabled={submitting}
        >
          <span>←</span>
          <span>Retour à la recette</span>
        </button>
        
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          disabled={submitting}
        >
          <span>🏠</span>
          <span>Dashboard</span>
        </button>
      </div>

      {/* Formulaire dans une Card */}
      <Card>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2 flex items-center space-x-2">
            <span>📝</span>
            <span>Informations de la recette</span>
          </h2>
          <p className="text-white/70 text-sm">
            Modifiez les informations ci-dessous et cliquez sur "Mettre à jour" pour sauvegarder vos changements.
          </p>
        </div>

        <RecipeForm
          initialData={recipe}
          onSubmit={handleSubmit}
          loading={submitting}
          error={error}
          submitLabel="Mettre à jour la recette"
        />
      </Card>

      {/* Message d'information */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-yellow-400 text-xl">💡</span>
          <div className="text-yellow-200">
            <h4 className="font-medium mb-2">À propos de la modification :</h4>
            <ul className="text-sm space-y-1 list-disc list-inside ml-4">
              <li>Vos modifications seront visibles immédiatement après la sauvegarde</li>
              <li>Tous les utilisateurs pourront voir la version mise à jour</li>
              <li>Vous pouvez annuler à tout moment en cliquant sur "Retour à la recette"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRecipePage;