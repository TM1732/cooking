import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import authService from '../services/authService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 3) {
      setError('Le mot de passe doit contenir au moins 3 caractères');
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' }
        });
      }, 2000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de l\'inscription';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Page de succès
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full text-center animate-fade-in">
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Inscription réussie !
          </h2>
          <p className="text-white/80 mb-6 leading-relaxed">
            Votre compte a été créé avec succès.
            Vous allez être redirigé vers la page de connexion...
          </p>
          <div className="flex justify-center">
            <LoadingSpinner size="medium" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">

        {/* Header */}
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-3xl font-bold text-white">
            Créer un compte
          </h2>
          <p className="mt-2 text-white/80">
            Rejoignez la communauté Cooking Website
          </p>
        </div>

        {/* Formulaire d'inscription */}
        <Card className="animate-fade-in-delay">
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4 shadow-lg">
              <div className="flex items-start space-x-3">
                <span className="text-red-400 text-xl flex-shrink-0">⚠️</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-red-200 font-medium mb-2">Erreur d'inscription</h4>
                  <p className="text-red-100 text-sm leading-relaxed">
                    {error}
                  </p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-300 hover:text-red-100 text-lg flex-shrink-0 transition-colors duration-200"
                  aria-label="Fermer"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom d'utilisateur */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-white">
                Nom d'utilisateur *
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Choisissez un nom d'utilisateur"
                value={formData.username}
                onChange={handleChange}
                disabled={isSubmitting}
                minLength={3}
              />
              <p className="text-gray-400 text-xs">
                Au moins 3 caractères, unique
              </p>
            </div>

            {/* Adresse email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Adresse email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Mot de passe *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Choisissez un mot de passe"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                minLength={3}
              />
              <p className="text-gray-400 text-xs">
                Au moins 3 caractères
              </p>
            </div>

            {/* Confirmation mot de passe */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                Confirmer le mot de passe *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Confirmez votre mot de passe"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Création en cours...</span>
                </>
              ) : (
                <>
                  <span>📝</span>
                  <span>Créer mon compte</span>
                </>
              )}
            </button>
          </form>

          {/* Lien vers connexion */}
          <div className="text-center mt-6 pt-6 border-t border-gray-600/30">
            <span className="text-white/80">Déjà un compte ? </span>
            <Link
              to="/login"
              className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-200"
            >
              Se connecter
            </Link>
          </div>
        </Card>

        {/* Comptes de démonstration */}
        <Card className="text-center animate-fade-in-delay-2">
          <h3 className="text-white font-semibold mb-4 flex items-center justify-center space-x-2">
            <span>💡</span>
            <span>Comptes de démonstration disponibles</span>
          </h3>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/30">
              <div className="flex items-center space-x-2">
                <span>👑</span>
                <span className="text-red-300 font-medium">Admin</span>
              </div>
              <span className="text-red-200 text-sm">admin / admin</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              <div className="flex items-center space-x-2">
                <span>👨‍🍳</span>
                <span className="text-yellow-300 font-medium">Chef</span>
              </div>
              <span className="text-yellow-200 text-sm">chef / chef</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <div className="flex items-center space-x-2">
                <span>👤</span>
                <span className="text-blue-300 font-medium">User</span>
              </div>
              <span className="text-blue-200 text-sm">user / user</span>
            </div>
          </div>
          <Link
            to="/login"
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 w-full inline-block no-underline"
          >
            Utiliser un compte de démonstration
          </Link>
        </Card>

        {/* Retour à l'accueil */}
        <div className="text-center animate-fade-in-delay-3">
          <Link
            to="/"
            className="text-white/60 hover:text-white/90 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>←</span>
            <span>Retour à l'accueil</span>
          </Link>
        </div>
      </div>

      <style jsx="true">{`
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

        .animate-fade-in-delay-3 {
          animation: fade-in 0.6s ease-out 0.6s both;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
