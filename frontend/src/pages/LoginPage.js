import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await login(credentials.username, credentials.password);
    
    if (result.success) {
      navigate(from, { replace: true });
    }
    
    setIsSubmitting(false);
  };

  // Fonction pour traduire les messages d'erreur
  const translateError = (errorMessage) => {
    const translations = {
      'User is disabled': 'Votre compte a été suspendu. Contactez un administrateur.',
      'Bad credentials': 'Nom d\'utilisateur ou mot de passe incorrect.',
      'Account is locked': 'Votre compte a été verrouillé. Contactez un administrateur.',
      'Account is expired': 'Votre compte a expiré. Contactez un administrateur.',
      'Credentials have expired': 'Vos identifiants ont expiré. Veuillez les renouveler.',
      'User not found': 'Utilisateur non trouvé.',
      'Invalid username or password': 'Nom d\'utilisateur ou mot de passe incorrect.',
      'Authentication failed': 'Échec de l\'authentification.'
    };

    // Chercher une traduction exacte
    if (translations[errorMessage]) {
      return translations[errorMessage];
    }

    // Chercher une traduction partielle
    for (const [english, french] of Object.entries(translations)) {
      if (errorMessage.toLowerCase().includes(english.toLowerCase())) {
        return french;
      }
    }

    // Message par défaut si pas de traduction trouvée
    return errorMessage || 'Erreur de connexion. Veuillez réessayer.';
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const quickLogin = (username, password) => {
    setCredentials({ username, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header */}
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4">🍳</div>
          <h2 className="text-3xl font-bold text-white">
            Connexion
          </h2>
          <p className="mt-2 text-white/80">
            Accédez à votre compte Cooking Website
          </p>
        </div>

        {/* Formulaire de connexion */}
        <Card className="animate-fade-in-delay">
          {error && (
            <Alert 
              type="error" 
              message={error} 
              className="mb-6"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom d'utilisateur */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-white">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Entrez votre nom d'utilisateur"
                value={credentials.username}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Entrez votre mot de passe"
                value={credentials.password}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <span>🔑</span>
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </form>

          {/* Comptes de démonstration */}
          <div className="mt-8">
            <div className="text-center text-white/80 mb-4 text-sm">
              Ou utilisez un compte de démonstration :
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => quickLogin('admin', 'admin')}
                className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 hover:text-red-200 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                disabled={isSubmitting}
              >
                <span>👑</span>
                <span>Admin (admin/admin)</span>
              </button>
              
              <button
                onClick={() => quickLogin('chef', 'chef')}
                className="w-full bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-300 hover:text-yellow-200 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                disabled={isSubmitting}
              >
                <span>👨‍🍳</span>
                <span>Chef (chef/chef)</span>
              </button>
              
              <button
                onClick={() => quickLogin('user', 'user')}
                className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 hover:text-blue-200 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                disabled={isSubmitting}
              >
                <span>👤</span>
                <span>User (user/user)</span>
              </button>
            </div>
          </div>

          {/* Lien inscription */}
          <div className="text-center mt-6 pt-6 border-t border-gray-600/30">
            <span className="text-white/80">Pas encore de compte ? </span>
            <Link 
              to="/register" 
              className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-200"
            >
              Créer un compte
            </Link>
          </div>
        </Card>

        {/* Retour à l'accueil */}
        <div className="text-center animate-fade-in-delay-2">
          <Link 
            to="/" 
            className="text-white/60 hover:text-white/90 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>←</span>
            <span>Retour à l'accueil</span>
          </Link>
        </div>
      </div>

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
        
        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.2s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 0.6s ease-out 0.4s both;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;