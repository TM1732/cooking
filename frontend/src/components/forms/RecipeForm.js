import React, { useState, useEffect } from 'react';

const emptyForm = {
  title: '',
  ingredients: '',
  instructions: '',
  category: '',
  keywords: '',
};

const RecipeForm = ({ 
  initialData = {}, 
  onSubmit, 
  loading = false, 
  error = '', 
  submitLabel = "Enregistrer" 
}) => {
  // Initialiser avec les données combinées dès le début
  const initialFormData = { ...emptyForm, ...initialData };
  const [form, setForm] = useState(initialFormData);
  const [formError, setFormError] = useState('');

  // Seulement se déclencher si initialData change vraiment (pour l'édition)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({ ...emptyForm, ...initialData });
    }
  }, [JSON.stringify(initialData)]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
    setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation simple
    if (!form.title.trim() || !form.ingredients.trim()) {
      setFormError('Le titre et les ingrédients sont requis.');
      return;
    }
    
    // Vérifier que onSubmit est bien une fonction
    if (typeof onSubmit === 'function') {
      onSubmit(form);
    } else {
      console.error('onSubmit n\'est pas une fonction');
      setFormError('Erreur de configuration du formulaire.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Messages d'erreur */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {formError && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <span>⚠️</span>
              <span>{formError}</span>
            </div>
          </div>
        )}

        {/* Titre de la recette */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-white font-medium" htmlFor="title">
            <span>📝</span>
            <span>Titre de la recette *</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Ex: Tarte aux pommes de grand-mère"
            value={form.title || ''}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        {/* Ingrédients */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-white font-medium" htmlFor="ingredients">
            <span>🛒</span>
            <span>Ingrédients *</span>
          </label>
          <textarea
            id="ingredients"
            name="ingredients"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-vertical"
            rows={4}
            placeholder="Listez les ingrédients nécessaires...&#10;Ex:&#10;- 3 pommes&#10;- 200g de farine&#10;- 100g de beurre"
            value={form.ingredients || ''}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <p className="text-gray-400 text-sm">
            💡 Listez chaque ingrédient sur une ligne séparée pour plus de clarté
          </p>
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-white font-medium" htmlFor="instructions">
            <span>👨‍🍳</span>
            <span>Instructions de préparation</span>
          </label>
          <textarea
            id="instructions"
            name="instructions"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-vertical"
            rows={6}
            placeholder="Décrivez étape par étape la préparation de votre recette...&#10;&#10;Ex:&#10;1. Préchauffez le four à 180°C&#10;2. Épluchez et coupez les pommes&#10;3. Mélangez la farine et le beurre..."
            value={form.instructions || ''}
            onChange={handleChange}
            disabled={loading}
          />
          <p className="text-gray-400 text-sm">
            💡 Numérotez vos étapes pour faciliter le suivi de la recette
          </p>
        </div>

        {/* Ligne avec catégorie et mots-clés */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Catégorie */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-white font-medium" htmlFor="category">
              <span>🏷️</span>
              <span>Catégorie</span>
            </label>
            <input
              id="category"
              name="category"
              type="text"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Ex: Dessert, Plat principal, Entrée..."
              value={form.category || ''}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Mots-clés */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-white font-medium" htmlFor="keywords">
              <span>🔖</span>
              <span>Mots-clés</span>
            </label>
            <input
              id="keywords"
              name="keywords"
              type="text"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Ex: rapide, végétarien, sans gluten..."
              value={form.keywords || ''}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        {/* Informations d'aide */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-blue-400 text-xl">💡</span>
            <div className="text-blue-200 space-y-2">
              <h4 className="font-medium">Conseils pour une bonne recette :</h4>
              <ul className="text-sm space-y-1 list-disc list-inside ml-4">
                <li>Soyez précis dans les quantités et les temps de cuisson</li>
                <li>Détaillez les techniques importantes (ex: "fouetter jusqu'à ce que le mélange blanchisse")</li>
                <li>Mentionnez la température du four si nécessaire</li>
                <li>Indiquez le nombre de portions que la recette permet de préparer</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-end pt-6 border-t border-gray-600/30">
          <button
            type="submit"
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>{submitLabel}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;