import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import recipeService from '../services/recipeService';

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');

  const categories = ['Entrée', 'Plat principal', 'Dessert', 'Boisson', 'Apéritif'];

  useEffect(() => {
    loadRecipes();
  }, [searchParams]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      let result;
      const search = searchParams.get('search');
      const category = searchParams.get('category');
      
      if (search) {
        result = await recipeService.searchRecipes(search, { category });
      } else if (category) {
        result = await recipeService.getRecipesByCategory(category);
      } else {
        result = await recipeService.getAllRecipes();
      }

      setRecipes(result.recipes ?? []);
    } catch (error) {
      console.error('Erreur chargement recettes:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    
    if (searchQuery.trim()) {
      newParams.set('search', searchQuery.trim());
    } else {
      newParams.delete('search');
    }
    
    setSearchParams(newParams);
  };

  const handleCategoryChange = (category) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (category && category !== categoryFilter) {
      newParams.set('category', category);
    } else {
      newParams.delete('category');
    }
    
    setCategoryFilter(category === categoryFilter ? '' : category);
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setSearchParams({});
  };

  return (
    <div className="space-y-8">
      
      {/* En-tête */}
      <div className="text-center">
        <div className="text-5xl mb-4">📖</div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Toutes les recettes
        </h1>
        <p className="text-white/80 text-lg">
          Découvrez notre collection de recettes délicieuses
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <Card>
        {/* Formulaire de recherche */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher une recette par nom, ingrédient..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                  🔍
                </span>
              </div>
            </div>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <span>🔍</span>
              <span>Rechercher</span>
            </button>
          </div>
        </form>

        {/* Filtres par catégorie */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold flex items-center space-x-2">
            <span>🏷️</span>
            <span>Filtrer par catégorie :</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-0.5 ${
                  categoryFilter === category
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                    : 'bg-gray-700 hover:bg-gray-600 text-white shadow-md hover:shadow-lg'
                }`}
              >
                {category}
              </button>
            ))}
            {(searchQuery || categoryFilter) && (
              <button 
                onClick={clearFilters} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <span>✕</span>
                <span>Effacer les filtres</span>
              </button>
            )}
          </div>
        </div>

        {/* Indicateur de filtrage actif */}
        {(searchQuery || categoryFilter) && (
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="text-blue-200 flex items-center space-x-2">
              <span className="font-medium">🔍 Filtres actifs :</span>
              <div className="flex flex-wrap items-center gap-2">
                {searchQuery && (
                  <span className="bg-blue-600/20 px-3 py-1 rounded-full text-sm border border-blue-500/30">
                    Recherche: "{searchQuery}"
                  </span>
                )}
                {categoryFilter && (
                  <span className="bg-orange-600/20 px-3 py-1 rounded-full text-sm border border-orange-500/30">
                    Catégorie: {categoryFilter}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Résultats */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <LoadingSpinner size="large" />
            <p className="text-white mt-4">Recherche en cours...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Compteur de résultats */}
          <div className="flex items-center justify-between">
            <div className="text-white/80 flex items-center space-x-2">
              <span className="text-lg">📊</span>
              <span>
                <strong className="text-white">{recipes.length}</strong> recette{recipes.length !== 1 ? 's' : ''} trouvée{recipes.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {recipes.length > 0 && (
              <div className="text-white/60 text-sm">
                Triées par date de création
              </div>
            )}
          </div>

          {/* Grille de recettes */}
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <Card key={recipe.id} className="h-full flex flex-col hover:scale-105 transition-all duration-200 group">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-200">
                        {recipe.title}
                      </h3>
                      {recipe.category && (
                        <span className="text-xs bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-200 px-3 py-1 rounded-full flex-shrink-0 ml-2">
                          {recipe.category}
                        </span>
                      )}
                    </div>

                    <p className="text-white/80 text-sm mb-4 leading-relaxed line-clamp-3">
                      {recipe.description || recipe.ingredients?.substring(0, 120) + '...' || 'Description non disponible'}
                    </p>

                    <div className="space-y-2 text-sm text-white/70">
                      <div className="flex items-center space-x-2">
                        <span>👨‍🍳</span>
                        <span>Par <strong className="text-white/90">{recipe.author?.username || 'Anonyme'}</strong></span>
                      </div>
                      
                      {recipe.prepTime && (
                        <div className="flex items-center space-x-2">
                          <span>⏱️</span>
                          <span>{recipe.prepTime} min</span>
                        </div>
                      )}
                      
                      {recipe.difficulty && (
                        <div className="flex items-center space-x-2">
                          <span>📊</span>
                          <span>Difficulté: {recipe.difficulty}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <span>📅</span>
                        <span>Créé le {new Date(recipe.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/20">
                    <Link 
                      to={`/recipes/${recipe.id}`}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full no-underline"
                    >
                      <span>📖</span>
                      <span>Voir la recette</span>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-16">
              <div className="text-8xl mb-6">🍽️</div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Aucune recette trouvée
              </h3>
              <p className="text-white/80 mb-8 max-w-md mx-auto leading-relaxed">
                {searchQuery || categoryFilter 
                  ? 'Aucune recette ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou votre recherche.'
                  : 'Il n\'y a pas encore de recettes disponibles sur la plateforme.'
                }
              </p>
              <div className="space-x-4">
                {(searchQuery || categoryFilter) && (
                  <button 
                    onClick={clearFilters} 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Voir toutes les recettes
                  </button>
                )}
                <Link
                  to="/recipes/create"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-flex items-center space-x-2 no-underline"
                >
                  <span>✨</span>
                  <span>Créer une recette</span>
                </Link>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipesPage;