import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: { total: 0, newToday: 0, active: 0 },
    recipes: { total: 0, newToday: 0, pending: 0 },
    comments: { total: 0, newToday: 0, reported: 0 },
    views: { total: 0, today: 0 }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Simuler un délai de chargement réaliste
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données simulées (à remplacer par vos vrais appels API)
      const mockStats = {
        users: { total: 247, newToday: 8, active: 156 },
        recipes: { total: 1432, newToday: 23, pending: 5 },
        comments: { total: 3891, newToday: 67, reported: 3 },
        views: { total: 45892, today: 892 }
      };

      const mockActivity = [
        { id: 1, type: 'user_register', user: 'chef_marie', time: '2 min', description: 'Nouvelle inscription' },
        { id: 2, type: 'recipe_create', user: 'paul_cooking', time: '15 min', description: 'Recette "Tarte aux pommes" créée' },
        { id: 3, type: 'comment_report', user: 'system', time: '23 min', description: 'Commentaire signalé par lisa_food' },
        { id: 4, type: 'recipe_update', user: 'chef_antoine', time: '1h', description: 'Recette "Coq au vin" modifiée' },
        { id: 5, type: 'user_promote', user: 'admin', time: '2h', description: 'marie_patisse promue Chef' }
      ];

      const mockAlerts = [
        { id: 1, type: 'warning', message: '3 commentaires en attente de modération', action: '/admin/comments' },
        { id: 2, type: 'info', message: '5 nouvelles recettes à approuver', action: '/admin/recipes/pending' },
        { id: 3, type: 'success', message: 'Sauvegarde automatique effectuée avec succès', action: null }
      ];

      setStats(mockStats);
      setRecentActivity(mockActivity);
      setSystemAlerts(mockAlerts);
      
    } catch (error) {
      console.error('Erreur chargement données admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      user_register: '👤',
      recipe_create: '📝',
      comment_report: '⚠️',
      recipe_update: '✏️',
      user_promote: '👑'
    };
    return icons[type] || '📌';
  };

  const getAlertStyle = (type) => {
    const styles = {
      warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200',
      error: 'bg-red-500/20 border-red-500/50 text-red-200',
      info: 'bg-blue-500/20 border-blue-500/50 text-blue-200',
      success: 'bg-green-500/20 border-green-500/50 text-green-200'
    };
    return styles[type] || styles.info;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="text-white mt-4">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="text-center">
        <div className="text-5xl mb-4">⚙️</div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Dashboard d'Administration
        </h1>
        <p className="text-white/80 text-lg">
          Vue d'ensemble et gestion de la plateforme
        </p>
      </div>

      {/* Alertes système */}
      {systemAlerts.length > 0 && (
        <div className="space-y-3">
          {systemAlerts.map(alert => (
            <div key={alert.id} className={`rounded-lg p-4 border ${getAlertStyle(alert.type)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    {alert.type === 'warning' ? '⚠️' : 
                     alert.type === 'error' ? '🚨' : 
                     alert.type === 'success' ? '✅' : 'ℹ️'}
                  </span>
                  <span>{alert.message}</span>
                </div>
                {alert.action && (
                  <Link 
                    to={alert.action}
                    className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition-colors duration-200"
                  >
                    Voir →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Utilisateurs */}
        <Card className="text-center hover:scale-105 transition-transform duration-200">
          <div className="text-4xl mb-3">👥</div>
          <div className="text-3xl font-bold text-white">{stats.users.total}</div>
          <div className="text-white/80 font-medium mb-3">Utilisateurs</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-green-300">
              <span>Nouveaux aujourd'hui</span>
              <span className="font-medium">+{stats.users.newToday}</span>
            </div>
            <div className="flex justify-between text-blue-300">
              <span>Actifs (30j)</span>
              <span className="font-medium">{stats.users.active}</span>
            </div>
          </div>
        </Card>

        {/* Recettes */}
        <Card className="text-center hover:scale-105 transition-transform duration-200">
          <div className="text-4xl mb-3">📖</div>
          <div className="text-3xl font-bold text-white">{stats.recipes.total}</div>
          <div className="text-white/80 font-medium mb-3">Recettes</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-green-300">
              <span>Nouvelles aujourd'hui</span>
              <span className="font-medium">+{stats.recipes.newToday}</span>
            </div>
            <div className="flex justify-between text-yellow-300">
              <span>En attente</span>
              <span className="font-medium">{stats.recipes.pending}</span>
            </div>
          </div>
        </Card>

        {/* Commentaires */}
        <Card className="text-center hover:scale-105 transition-transform duration-200">
          <div className="text-4xl mb-3">💬</div>
          <div className="text-3xl font-bold text-white">{stats.comments.total}</div>
          <div className="text-white/80 font-medium mb-3">Commentaires</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-green-300">
              <span>Nouveaux aujourd'hui</span>
              <span className="font-medium">+{stats.comments.newToday}</span>
            </div>
            <div className="flex justify-between text-red-300">
              <span>Signalés</span>
              <span className="font-medium">{stats.comments.reported}</span>
            </div>
          </div>
        </Card>

        {/* Vues */}
        <Card className="text-center hover:scale-105 transition-transform duration-200">
          <div className="text-4xl mb-3">👁️</div>
          <div className="text-3xl font-bold text-white">{stats.views.total.toLocaleString()}</div>
          <div className="text-white/80 font-medium mb-3">Vues totales</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-green-300">
              <span>Aujourd'hui</span>
              <span className="font-medium">+{stats.views.today}</span>
            </div>
            <div className="flex justify-between text-purple-300">
              <span>Moyenne/jour</span>
              <span className="font-medium">{Math.round(stats.views.total / 30)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <span>🚀</span>
          <span>Actions rapides</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Link 
            to="/admin/users" 
            className="flex items-center space-x-3 p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-all duration-200 group no-underline"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">👥</span>
            <div>
              <div className="text-blue-200 font-medium">Gérer les utilisateurs</div>
              <div className="text-blue-300/70 text-sm">Rôles, permissions</div>
            </div>
          </Link>

          <Link 
            to="/admin/recipes" 
            className="flex items-center space-x-3 p-4 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg transition-all duration-200 group no-underline"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">📖</span>
            <div>
              <div className="text-green-200 font-medium">Modérer les recettes</div>
              <div className="text-green-300/70 text-sm">Approuver, rejeter</div>
            </div>
          </Link>

          <Link 
            to="/admin/comments" 
            className="flex items-center space-x-3 p-4 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 rounded-lg transition-all duration-200 group no-underline"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">💬</span>
            <div>
              <div className="text-yellow-200 font-medium">Modérer commentaires</div>
              <div className="text-yellow-300/70 text-sm">Signalements</div>
            </div>
          </Link>

          <Link 
            to="/admin/analytics" 
            className="flex items-center space-x-3 p-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg transition-all duration-200 group no-underline"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">📊</span>
            <div>
              <div className="text-purple-200 font-medium">Analytics</div>
              <div className="text-purple-300/70 text-sm">Rapports détaillés</div>
            </div>
          </Link>
        </div>
      </Card>

      {/* Layout en 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Activité récente */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>📈</span>
              <span>Activité récente</span>
            </h3>
            <Link 
              to="/admin/activity" 
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
            >
              Voir tout →
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                <span className="text-xl">{getActivityIcon(activity.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{activity.description}</p>
                  <p className="text-white/60 text-xs">Par {activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Graphique simplifié des inscriptions */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <span>📊</span>
            <span>Inscriptions cette semaine</span>
          </h3>
          
          <div className="space-y-3">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => {
              const value = [12, 8, 15, 23, 19, 11, 7][index];
              const percentage = (value / 23) * 100;
              return (
                <div key={day} className="flex items-center space-x-3">
                  <span className="text-white/80 w-8 text-sm">{day}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-white font-medium w-8 text-sm">{value}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Footer avec informations système */}
      <Card>
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-6 text-sm text-white/70">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Système opérationnel</span>
            </div>
            <div>Dernière sauvegarde: Il y a 2h</div>
            <div>Version: 1.2.3</div>
          </div>
          <button 
            onClick={loadAdminData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <span>🔄</span>
            <span>Actualiser</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;