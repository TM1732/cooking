import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RecipesPage from './pages/RecipesPage';
import RegisterPage from './pages/RegisterPage';
import UserManagementPage from './pages/UserManagementPage';
import CreateRecipePage from './pages/CreateRecipePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import EditRecipePage from './pages/EditRecipePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Composant de protection des routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Composant de redirection pour les utilisateurs connectés
const RedirectIfAuthenticated = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// Composant de protection des routes admin
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role?.toLowerCase() !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍳</div>
          <LoadingSpinner size="large" />
          <p className="text-white mt-4">Chargement de l'application...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="App">
      <Routes>
        {/* Routes d'authentification sans layout */}
        <Route path="/login" element={
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
        } />

        <Route path="/register" element={
          <RedirectIfAuthenticated>
            <RegisterPage />
          </RedirectIfAuthenticated>
        } />

        {/* Routes avec layout */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              {/* Page d'accueil */}
              <Route path="/" element={<HomePage />} />

              {/* Pages publiques */}
              <Route path="/recipes" element={<RecipesPage />} />

              {/* Page détail d'une recette */}
              <Route path="/recipes/:id" element={<RecipeDetailPage />} />

              {/* Page édition recette */}
              <Route path="/recipes/:id/edit" element={
                <ProtectedRoute>
                  <EditRecipePage />
                </ProtectedRoute>
              } />

              {/* Page création recette */}
              <Route path="/recipes/create" element={
                <ProtectedRoute>
                  <CreateRecipePage />
                </ProtectedRoute>
              } />

              {/* Routes protégées */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />

              {/* Routes admin */}
              <Route path="/admin/users" element={
                <AdminRoute>
                  <UserManagementPage />
                </AdminRoute>
              } />

              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              } />

              {/* Route par défaut */}
              <Route path="*" element={
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h1 className="text-3xl font-bold text-white mb-4">
                    Page non trouvée
                  </h1>
                  <p className="text-white opacity-80 mb-6">
                    La page que vous recherchez n'existe pas.
                  </p>
                  <div className="space-x-4">
                    <a href="/" className="btn btn-primary">
                      🏠 Accueil
                    </a>
                    <a href="/recipes" className="btn btn-secondary">
                      📖 Voir les recettes
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </Layout>
        } />
      </Routes>
    </div>
  );
}
export default App;