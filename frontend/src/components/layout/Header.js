import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo et titre */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-3 text-white hover:text-gray-200 transition-colors duration-200 no-underline"
            >
              <span className="text-3xl">🍳</span>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Cooking Website
              </span>
            </Link>
          </div>

          {/* Boutons de navigation */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Informations utilisateur (optionnel - décommenté si besoin) */}
                {/* 
                <div className="hidden md:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.username?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div className="text-white">
                    <div className="text-sm font-medium">{user?.username}</div>
                    <div className="text-xs text-gray-300">{user?.role}</div>
                  </div>
                </div>
                */}
                
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <span>🔑</span>
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg no-underline"
              >
                <span>🔑</span>
                <span>Connexion</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;