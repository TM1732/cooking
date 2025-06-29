import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import recipeService from '../services/recipeService';
import statsService from '../services/statsService';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ recipes: 0, users: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Charger quelques recettes pour la page d'accueil
      const response = await recipeService.getAllRecipes({ size: 6, page: 0 });
      setFeaturedRecipes(response.recipes || []);
      
      // Charger les statistiques globales
      const stats = await statsService.getPublicStats();
      setStats(stats);
    } catch (error) {
      console.error('Erreur chargement données:', error);
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
    <div className="space-y-16 pb-8">
      
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="animate-fade-in">
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Découvrez, créez et partagez vos recettes préférées dans une
            communauté passionnée de cuisine
          </p>
          
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 no-underline"
              >
                <span>🚀</span>
                <span>Commencer maintenant</span>
              </Link>
              <Link 
                to="/recipes" 
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 no-underline"
              >
                <span>👀</span>
                <span>Voir les recettes</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/dashboard" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 no-underline"
              >
                <span>📊</span>
                <span>Mon Dashboard</span>
              </Link>
              <Link 
                to="/recipes" 
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 no-underline"
              >
                <span>📖</span>
                <span>Parcourir les recettes</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Statistiques */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center hover:scale-105 transition-transform duration-200">
          <div className="text-4xl mb-3">📖</div>
          <div className="text-3xl font-bold text-white">{stats.recipes}</div>
          <div className="text-white/80 font-medium">Recettes</div>
        </Card>
        <Card className="text-center hover:scale-105 transition-transform duration-200">
          <div className="text-4xl mb-3">👥</div>
          <div className="text-3xl font-bold text-white">{stats.users}</div>
          <div className="text-white/80 font-medium">Utilisateurs</div>
        </Card>
        <Card className="text-center hover:scale-105 transition-transform duration-200">
          <div className="text-4xl mb-3">👨‍🍳</div>
          <div className="text-3xl font-bold text-white">∞</div>
          <div className="text-white/80 font-medium">Possibilités</div>
        </Card>
        <Card className="text-center hover:scale-105 transition-transform duration-200">
          <div className="text-4xl mb-3">🌟</div>
          <div className="text-3xl font-bold text-white">100%</div>
          <div className="text-white/80 font-medium">Savoureux</div>
        </Card>
      </section>

      {/* Fonctionnalités */}
      <section className="space-y-8">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          🎯 Fonctionnalités principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: "📝",
              title: "Création de recettes",
              description: "Créez et partagez vos recettes avec notre éditeur intuitif. Ajoutez des ingrédients, étapes et photos."
            },
            {
              icon: "🔍",
              title: "Recherche avancée",
              description: "Trouvez la recette parfaite grâce à notre moteur de recherche intelligent par ingrédients, catégories et temps de préparation."
            },
            {
              icon: "💬",
              title: "Communauté active",
              description: "Échangez avec d'autres passionnés, commentez et notez les recettes de la communauté."
            },
            {
              icon: "🔐",
              title: "Sécurité garantie",
              description: "Authentification JWT sécurisée avec gestion des rôles (Admin, Chef, Utilisateur)."
            },
            {
              icon: "📱",
              title: "Responsive Design",
              description: "Accédez à vos recettes depuis n'importe quel appareil avec notre interface adaptative."
            },
            {
              icon: "⚡",
              title: "Performance optimale",
              description: "Application rapide et moderne construite avec React et Spring Boot pour une expérience fluide."
            }
          ].map((feature, index) => (
            <Card key={index} className="hover:scale-105 transition-all duration-200 group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/80 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Comptes de test */}
      {!isAuthenticated && (
        <section className="space-y-8">
          <h2 className="text-4xl font-bold text-white text-center">
            👥 Comptes de démonstration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "👑",
                role: "Administrateur",
                login: "admin",
                password: "admin",
                description: "Gestion complète des utilisateurs et recettes",
                color: "from-red-500 to-pink-600"
              },
              {
                icon: "👨‍🍳",
                role: "Chef",
                login: "chef",
                password: "chef",
                description: "Création et gestion des recettes",
                color: "from-yellow-500 to-orange-600"
              },
              {
                icon: "👤",
                role: "Utilisateur",
                login: "user",
                password: "user",
                description: "Consultation et commentaires sur les recettes",
                color: "from-blue-500 to-purple-600"
              }
            ].map((account, index) => (
              <Card key={index} className="text-center hover:scale-105 transition-all duration-200">
                <div className="text-5xl mb-4">{account.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {account.role}
                </h3>
                <div className="space-y-2 text-white/90 mb-4">
                  <p><strong>Login :</strong> {account.login}</p>
                  <p><strong>Password :</strong> {account.password}</p>
                  <p className="text-sm mt-3 text-white/70">
                    {account.description}
                  </p>
                </div>
                <Link 
                  to="/login" 
                  className={`bg-gradient-to-r ${account.color} hover:shadow-lg text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 block no-underline`}
                >
                  Se connecter
                </Link>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Recettes en vedette */}
      {featuredRecipes.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold text-white">
              🌟 Recettes en vedette
            </h2>
            <Link 
              to="/recipes" 
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 no-underline"
            >
              Voir toutes les recettes
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe) => (
              <Card key={recipe.id} className="hover:scale-105 transition-all duration-200">
                <h3 className="text-lg font-semibold text-white mb-3">
                  {recipe.title}
                </h3>
                <p className="text-white/80 text-sm mb-4 leading-relaxed">
                  {recipe.description?.substring(0, 100)}...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">
                    Par {recipe.author?.username}
                  </span>
                  <Link
                    to={`/recipes/${recipe.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm no-underline"
                  >
                    Voir la recette
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;