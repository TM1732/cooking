import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeForm from '../components/forms/RecipeForm';
import Card from '../components/common/Card';
import recipeService from '../services/recipeService';

const CreateRecipePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    console.log('handleSubmit appelé avec:', formData); // Debug
    
    try {
      setLoading(true);
      setError('');
      
      // Envoie la recette au backend
      const newRecipe = await recipeService.createRecipe(formData);
      
      // Redirige vers la page de la nouvelle recette créée
      if (newRecipe?.id) {
        navigate(`/recipes/${newRecipe.id}`);
      } else {
        navigate('/recipes');
      }
    } catch (err) {
      console.error('Erreur création recette:', err); // Debug
      setError(
        err.response?.data?.message ||
        err.message ||
        'Erreur lors de la création de la recette'
      );
    } finally {
      setLoading(false); // S'assurer que loading est toujours remis à false
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="space-y-8">
      
      {/* Header de la page */}
      <div className="text-center">
        <div className="text-5xl mb-4">✨</div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Créer une nouvelle recette
        </h1>
        <p className="text-white/80 text-lg">
          Partagez votre création culinaire avec la communauté
        </p>
      </div>

      {/* Boutons de navigation */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleCancel}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          disabled={loading}
        >
          <span>←</span>
          <span>Retour au dashboard</span>
        </button>
        
        <button
          onClick={() => navigate('/recipes')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          disabled={loading}
        >
          <span>📚</span>
          <span>Voir toutes les recettes</span>
        </button>
      </div>

      {/* Formulaire dans une Card */}
      <Card>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2 flex items-center space-x-2">
            <span>📝</span>
            <span>Détails de votre recette</span>
          </h2>
          <p className="text-white/70 text-sm">
            Remplissez les informations ci-dessous pour créer votre nouvelle recette. 
            Les champs marqués d'un astérisque (*) sont obligatoires.
          </p>
        </div>

        <RecipeForm
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          submitLabel="Créer la recette"
        />
      </Card>

      {/* Messages d'encouragement et conseils */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Conseils pour bien commencer */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-green-400 text-xl">🌟</span>
            <div className="text-green-200">
              <h4 className="font-medium mb-2">Premiers pas :</h4>
              <ul className="text-sm space-y-1 list-disc list-inside ml-4">
                <li>Commencez par une recette que vous maîtrisez bien</li>
                <li>Soyez précis dans les quantités et les temps</li>
                <li>N'hésitez pas à partager vos astuces personnelles</li>
                <li>Ajoutez des mots-clés pour faciliter la recherche</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Partage et communauté */}
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-purple-400 text-xl">👥</span>
            <div className="text-purple-200">
              <h4 className="font-medium mb-2">Partage et communauté :</h4>
              <ul className="text-sm space-y-1 list-disc list-inside ml-4">
                <li>Votre recette sera visible par tous les utilisateurs</li>
                <li>Les autres pourront commenter et donner leur avis</li>
                <li>Vous pourrez modifier votre recette à tout moment</li>
                <li>Répondez aux commentaires pour créer du lien</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Message inspirant */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-6">
          <div className="text-2xl mb-3">👨‍🍳</div>
          <h3 className="text-white font-semibold mb-2">Prêt à inspirer la communauté ?</h3>
          <p className="text-white/70 text-sm max-w-md mx-auto">
            Chaque grande recette commence par un premier partage. 
            Votre création pourrait devenir le plat préféré de quelqu'un d'autre !
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipePage;