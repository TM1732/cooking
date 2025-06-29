import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import recipeService from '../services/recipeService';
import statsService from '../services/statsService';

const DashboardPage = () => {
  const { user, isChef } = useAuth();
  const [data, setData] = useState({
    recentRecipes: [],
    stats: { totalRecipes: 0, myRecipes: 0, totalComments: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ recipes: 0, users: 0 });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const result = await recipeService.getAllRecipes();
      const recipes = Array.isArray(result.recipes) ? result.recipes : [];
      const myRecipes = recipes.filter(r => r.author?.id === user?.id);
      // Charger les statistiques globales
      const stats = await statsService.getPublicStats();

      setData({
        recentRecipes: recipes.slice(0, 5),
        stats: {
          totalRecipes: result.totalItems ?? recipes.length,
          myRecipes: myRecipes.length,
          totalComments: stats.comments
        }
      });
    } catch (error) {
      setData({
        recentRecipes: [],
        stats: { totalRecipes: 0, myRecipes: 0, totalComments: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* En-tête de bienvenue */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          👋 Bienvenue, {user?.username} !
        </h1>
        <p className="text-white/80 text-lg mb-4">
          Voici votre tableau de bord personnel
        </p>
        <div className="inline-flex items-center">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            user?.role === 'ADMIN' 
              ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
              : user?.role === 'CHEF' 
              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
          }`}>
            {user?.role === 'ADMIN' ? '👑 Administrateur' :
              user?.role === 'CHEF' ? '👨‍🍳 Chef' : '👤 Utilisateur'}
          </span>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center hover:scale-105 transition-transform duration-200">
          <div className="text-4xl mb-3">📖</div>
          <div className="text-3xl font-bold text-white">{data.stats.totalRecipes}</div>
          <div className="text-white/80 font-medium">Recettes totales</div>
        </Card>

        {isChef && (
          <Card className="text-center hover:scale-105 transition-transform duration-200">
            <div className="text-4xl mb-3">✍️</div>
            <div className="text-3xl font-bold text-white">{data.stats.myRecipes}</div>
            <div className="text-white/80 font-medium">Mes recettes</div>
          </Card>
        )}

        <Card className="text-center hover:scale-105 transition-transform duration-200">
          <div className="text-4xl mb-3">💬</div>
          <div className="text-3xl font-bold text-white">{data.stats.totalComments}</div>
          <div className="text-white/80 font-medium">Commentaires</div>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <h2 className="text-2xl font-bold text-white mb-6">🚀 Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <Link 
            to="/recipes" 
            className="flex items-center space-x-3 p-4 bg-gray-700/30 hover:bg-gray-600/40 rounded-lg transition-all duration-200 group no-underline"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">📖</span>
            <span className="text-white font-medium">Parcourir les recettes</span>
          </Link>

          {isChef && (
            <Link 
              to="/recipes/create" 
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 border border-orange-500/30 rounded-lg transition-all duration-200 group no-underline"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">✨</span>
              <span className="text-orange-200 font-medium">Créer une nouvelle recette</span>
            </Link>
          )}

          <Link 
            to="/recipes?search=" 
            className="flex items-center space-x-3 p-4 bg-gray-700/30 hover:bg-gray-600/40 rounded-lg transition-all duration-200 group no-underline"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🔍</span>
            <span className="text-white font-medium">Rechercher une recette</span>
          </Link>

          {user?.role === 'ADMIN' && (
            <>
              <Link 
                to="/admin" 
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 border border-yellow-500/30 rounded-lg transition-all duration-200 group no-underline"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">⚙️</span>
                <span className="text-yellow-200 font-medium">Panel d'administration</span>
              </Link>

              <Link 
                to="/admin/users" 
                className="flex items-center space-x-3 p-4 bg-gray-700/30 hover:bg-gray-600/40 rounded-lg transition-all duration-200 group no-underline"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">👥</span>
                <span className="text-white font-medium">Gérer les utilisateurs</span>
              </Link>
            </>
          )}
        </div>
      </Card>

      {/* Recettes récentes */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">📚 Recettes récentes</h2>
          <Link 
            to="/recipes" 
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 no-underline"
          >
            Voir toutes
          </Link>
        </div>

        {data.recentRecipes.length > 0 ? (
          <div className="space-y-4">
            {data.recentRecipes.map((recipe) => (
              <div 
                key={recipe.id} 
                className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-200"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{recipe.title}</h3>
                  <p className="text-white/70 text-sm">
                    Par {recipe.author?.username} • {recipe.category || 'Sans catégorie'}
                  </p>
                </div>
                <Link
                  to={`/recipes/${recipe.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm no-underline ml-4"
                >
                  Voir
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-white/80 text-lg mb-4">Aucune recette pour le moment</p>
            {isChef && (
              <Link 
                to="/recipes/create" 
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 inline-flex items-center space-x-2 no-underline"
              >
                <span>✨</span>
                <span>Créer la première recette</span>
              </Link>
            )}
          </div>
        )}
      </Card>

      {/* Conseils selon le rôle */}
      <Card>
        <h2 className="text-2xl font-bold text-white mb-6">💡 Conseils</h2>
        <div className="space-y-4">
          {user?.role === 'ADMIN' && (
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-4 bg-red-500/10 rounded-lg border-l-4 border-red-500">
                <span className="text-xl">👑</span>
                <p className="text-red-200">En tant qu'administrateur, vous pouvez gérer tous les utilisateurs et recettes.</p>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-yellow-500/10 rounded-lg border-l-4 border-yellow-500">
                <span className="text-xl">⚙️</span>
                <p className="text-yellow-200">Accédez au panel d'administration pour superviser l'application.</p>
              </div>
            </div>
          )}

          {user?.role === 'CHEF' && (
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-4 bg-yellow-500/10 rounded-lg border-l-4 border-yellow-500">
                <span className="text-xl">👨‍🍳</span>
                <p className="text-yellow-200">En tant que chef, vous pouvez créer et modifier des recettes.</p>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-orange-500/10 rounded-lg border-l-4 border-orange-500">
                <span className="text-xl">✨</span>
                <p className="text-orange-200">Partagez vos créations culinaires avec la communauté !</p>
              </div>
            </div>
          )}

          {user?.role === 'USER' && (
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-4 bg-blue-500/10 rounded-lg border-l-4 border-blue-500">
                <span className="text-xl">👤</span>
                <p className="text-blue-200">Explorez toutes les recettes disponibles sur la plateforme.</p>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-purple-500/10 rounded-lg border-l-4 border-purple-500">
                <span className="text-xl">💬</span>
                <p className="text-purple-200">N'hésitez pas à commenter et noter les recettes qui vous plaisent !</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;