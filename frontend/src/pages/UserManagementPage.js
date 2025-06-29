import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import userService from '../services/userService';

const UserManagementPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [updatingUser, setUpdatingUser] = useState(null);
  
  // États pour les modals et fonctionnalités
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // État pour le formulaire de création/édition
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    if (isAuthenticated && user?.role?.toLowerCase() === 'admin') {
      loadUsers();
    }
  }, [isAuthenticated, user]);

  // Filtrage des utilisateurs
  useEffect(() => {
    let filtered = users;
    
    if (searchQuery) {
      filtered = filtered.filter(u => 
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role.toLowerCase() === roleFilter);
    }
    
    setFilteredUsers(filtered);
  }, [users, searchQuery, roleFilter]);

  if (!isAuthenticated || user?.role?.toLowerCase() !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userService.getAllUsers();
      setUsers(userData);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError('Erreur lors du chargement des utilisateurs. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setUpdatingUser('creating');
      setError(null);
      await userService.createUser(formData);
      setSuccess(`L'utilisateur "${formData.username}" a été créé avec succès`);
      setFormData({ username: '', email: '', password: '', role: 'user' });
      setShowCreateModal(false);
      loadUsers();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(`Erreur lors de la création de l'utilisateur : ${err.message || 'Erreur inconnue'}`);
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      setUpdatingUser(selectedUser.id);
      setError(null);
      await userService.updateUser(selectedUser.id, formData);
      setSuccess(`L'utilisateur "${formData.username}" a été modifié avec succès`);
      setShowEditModal(false);
      loadUsers();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(`Erreur lors de la modification : ${err.message || 'Erreur inconnue'}`);
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${username}" ? Cette action est irréversible.`)) {
      return;
    }
    
    try {
      setUpdatingUser(userId);
      setError(null);
      await userService.deleteUser(userId);
      setSuccess(`L'utilisateur "${username}" a été supprimé avec succès`);
      loadUsers();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(`Erreur lors de la suppression : ${err.message || 'Erreur inconnue'}`);
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      setUpdatingUser(userId);
      setError(null);
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await userService.updateUserStatus(userId, newStatus);
      
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: newStatus } : u
      ));
      
      const statusText = newStatus === 'active' ? 'activé' : 'suspendu';
      setSuccess(`Utilisateur ${statusText} avec succès`);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(`Erreur lors de la modification du statut : ${err.message || 'Erreur inconnue'}`);
    } finally {
      setUpdatingUser(null);
    }
  };

  const toggleChefRole = async (userId, currentRole) => {
    try {
      setUpdatingUser(userId);
      setError(null);
      
      const newRole = currentRole === 'chef' ? 'user' : 'chef';
      await userService.updateUserRole(userId, newRole);
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      const roleText = newRole === 'chef' ? 'promu Chef' : 'rétrogradé Utilisateur';
      setSuccess(`Rôle mis à jour : utilisateur ${roleText}`);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(`Erreur lors de la mise à jour du rôle : ${err.message || 'Erreur inconnue'}`);
    } finally {
      setUpdatingUser(null);
    }
  };

  // Modals handlers
  const openCreateModal = () => {
    setFormData({ username: '', email: '', password: '', role: 'user' });
    setShowCreateModal(true);
    setError(null);
    setSuccess(null);
  };

  const openEditModal = (userToEdit) => {
    setSelectedUser(userToEdit);
    setFormData({
      username: userToEdit.username,
      email: userToEdit.email,
      password: '', // Ne pas pré-remplir le mot de passe
      role: userToEdit.role
    });
    setShowEditModal(true);
    setError(null);
    setSuccess(null);
  };

  const openDetailsModal = (userToView) => {
    setSelectedUser(userToView);
    setShowDetailsModal(true);
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'text-red-400';
      case 'chef': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return '👑 Admin';
      case 'chef': return '👨‍🍳 Chef';
      default: return '👤 Utilisateur';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-green-400' : 'text-red-400';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner size="large" />
        <p className="text-white mt-4">Chargement des utilisateurs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">👥</div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Gestion des utilisateurs
        </h1>
        <p className="text-white/80">
          Administration complète des comptes utilisateurs
        </p>
      </div>

      {/* Alertes */}
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}
      {success && (
        <Alert 
          type="success" 
          message={success} 
          onClose={() => setSuccess(null)}
          className="mb-4"
        />
      )}

      {/* Barre d'outils */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Recherche */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            
            {/* Filtre par rôle */}
            <select
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Administrateurs</option>
              <option value="chef">Chefs</option>
              <option value="user">Utilisateurs</option>
            </select>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={loadUsers}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              disabled={loading}
            >
              <span>🔄</span>
              <span>Actualiser</span>
            </button>
            
            <button
              onClick={openCreateModal}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <span>➕</span>
              <span>Nouvel utilisateur</span>
            </button>
          </div>
        </div>
        
        {/* Statistiques */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span className="text-white/70">Total: <strong className="text-white">{users.length}</strong></span>
          <span className="text-white/70">Résultats: <strong className="text-white">{filteredUsers.length}</strong></span>
          <span className="text-red-300">Admins: <strong>{users.filter(u => u.role === 'admin').length}</strong></span>
          <span className="text-yellow-300">Chefs: <strong>{users.filter(u => u.role === 'chef').length}</strong></span>
          <span className="text-blue-300">Users: <strong>{users.filter(u => u.role === 'user').length}</strong></span>
        </div>
      </Card>

      {/* Liste des utilisateurs */}
      <Card>
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery || roleFilter !== 'all' ? 'Aucun résultat' : 'Aucun utilisateur trouvé'}
            </h3>
            <p className="text-white/80">
              {searchQuery || roleFilter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Créez le premier utilisateur pour commencer'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((userItem) => (
              <div 
                key={userItem.id}
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {userItem.username?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      
                      {/* Infos utilisateur */}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-white font-medium">{userItem.username}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            userItem.status === 'active' 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {userItem.status === 'active' ? '🟢 Actif' : '🔴 Suspendu'}
                          </span>
                        </div>
                        <p className="text-white/60 text-sm">{userItem.email}</p>
                        <p className="text-white/50 text-xs">
                          Inscrit le {new Date(userItem.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions et rôle */}
                  <div className="flex items-center space-x-4">
                    {/* Badge rôle */}
                    <div className="text-center">
                      <span className={`font-medium ${getRoleColor(userItem.role)}`}>
                        {getRoleBadge(userItem.role)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {/* Voir détails */}
                      <button
                        onClick={() => openDetailsModal(userItem)}
                        className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 p-2 rounded-lg transition-colors duration-200"
                        title="Voir les détails"
                      >
                        👁️
                      </button>

                      {/* Éditer (sauf pour les autres admins) */}
                      {!(userItem.role === 'admin' && userItem.id !== user.id) && (
                        <button
                          onClick={() => openEditModal(userItem)}
                          className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 p-2 rounded-lg transition-colors duration-200"
                          title="Modifier"
                        >
                          ✏️
                        </button>
                      )}

                      {/* Toggle Chef (sauf admins) */}
                      {userItem.role !== 'admin' && (
                        <button
                          onClick={() => toggleChefRole(userItem.id, userItem.role)}
                          disabled={updatingUser === userItem.id}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            userItem.role === 'chef'
                              ? 'bg-red-600/20 hover:bg-red-600/30 text-red-300'
                              : 'bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300'
                          }`}
                          title={userItem.role === 'chef' ? 'Retirer Chef' : 'Promouvoir Chef'}
                        >
                          {updatingUser === userItem.id ? '⏳' : 
                           userItem.role === 'chef' ? '👨‍🍳→👤' : '👤→👨‍🍳'}
                        </button>
                      )}

                      {/* Toggle Statut (sauf pour soi-même) */}
                      {userItem.id !== user.id && (
                        <button
                          onClick={() => handleToggleUserStatus(userItem.id, userItem.status)}
                          disabled={updatingUser === userItem.id}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            userItem.status === 'active'
                              ? 'bg-red-600/20 hover:bg-red-600/30 text-red-300'
                              : 'bg-green-600/20 hover:bg-green-600/30 text-green-300'
                          }`}
                          title={userItem.status === 'active' ? 'Suspendre' : 'Activer'}
                        >
                          {updatingUser === userItem.id ? '⏳' : 
                           userItem.status === 'active' ? '🚫' : '✅'}
                        </button>
                      )}

                      {/* Supprimer (sauf pour soi-même et autres admins) */}
                      {userItem.id !== user.id && !(userItem.role === 'admin' && userItem.id !== user.id) && (
                        <button
                          onClick={() => handleDeleteUser(userItem.id, userItem.username)}
                          disabled={updatingUser === userItem.id}
                          className="bg-red-600/20 hover:bg-red-600/30 text-red-300 p-2 rounded-lg transition-colors duration-200"
                          title="Supprimer"
                        >
                          {updatingUser === userItem.id ? '⏳' : '🗑️'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal Création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Créer un nouvel utilisateur</h3>
            
            {/* Alertes dans le modal */}
            {error && (
              <Alert 
                type="error" 
                message={error} 
                onClose={() => setError(null)}
                className="mb-4"
              />
            )}
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Nom d'utilisateur *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Mot de passe *</label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Rôle</label>
                <select
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="user">👤 Utilisateur</option>
                  <option value="chef">👨‍🍳 Chef</option>
                  <option value="admin">👑 Administrateur</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setError(null);
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={updatingUser === 'creating'}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors disabled:opacity-50"
                >
                  {updatingUser === 'creating' ? '⏳ Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Édition */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Modifier {selectedUser.username}</h3>
            
            {/* Alertes dans le modal */}
            {error && (
              <Alert 
                type="error" 
                message={error} 
                onClose={() => setError(null)}
                className="mb-4"
              />
            )}
            
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Nom d'utilisateur *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Nouveau mot de passe (optionnel)</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Laisser vide pour ne pas changer"
                />
              </div>
              {/* Ne permettre de changer le rôle que si on n'édite pas un autre admin */}
              {!(selectedUser.role === 'admin' && selectedUser.id !== user.id) && (
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Rôle</label>
                  <select
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="user">👤 Utilisateur</option>
                    <option value="chef">👨‍🍳 Chef</option>
                    <option value="admin">👑 Administrateur</option>
                  </select>
                </div>
              )}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setError(null);
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={updatingUser === selectedUser.id}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors disabled:opacity-50"
                >
                  {updatingUser === selectedUser.id ? '⏳ Modification...' : 'Modifier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Détails */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Détails de l'utilisateur</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {selectedUser.username?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">{selectedUser.username}</h4>
                  <p className="text-white/60">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <span className="text-white/60 text-sm">Rôle</span>
                  <p className={`font-medium ${getRoleColor(selectedUser.role)}`}>
                    {getRoleBadge(selectedUser.role)}
                  </p>
                </div>
                <div>
                  <span className="text-white/60 text-sm">Statut</span>
                  <p className={`font-medium ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status === 'active' ? '🟢 Actif' : '🔴 Suspendu'}
                  </p>
                </div>
                <div>
                  <span className="text-white/60 text-sm">Date d'inscription</span>
                  <p className="text-white font-medium">
                    {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <span className="text-white/60 text-sm">ID</span>
                  <p className="text-white font-medium font-mono text-xs">
                    {selectedUser.id}
                  </p>
                </div>
              </div>
              
              {/* Statistiques utilisateur (à implémenter selon vos besoins) */}
              <div className="border-t border-gray-600 pt-4">
                <h5 className="text-white font-medium mb-2">Statistiques</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Recettes créées</span>
                    <p className="text-white font-medium">{selectedUser.recipesCount || 0}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Commentaires</span>
                    <p className="text-white font-medium">{selectedUser.commentsCount || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informations sur les rôles */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">
          📋 Guide d'administration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-medium mb-3">🎯 Actions disponibles</h4>
            <div className="space-y-2 text-sm text-white/80">
              <p>👁️ <strong>Voir</strong> - Consulter les détails complets</p>
              <p>✏️ <strong>Modifier</strong> - Changer nom, email, mot de passe, rôle</p>
              <p>👨‍🍳 <strong>Chef</strong> - Promouvoir/rétrograder le rôle Chef</p>
              <p>🚫 <strong>Suspendre</strong> - Désactiver temporairement le compte</p>
              <p>🗑️ <strong>Supprimer</strong> - Suppression définitive</p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">⚠️ Restrictions</h4>
            <div className="space-y-2 text-sm text-white/80">
              <p>• Impossible de modifier/supprimer d'autres admins</p>
              <p>• Impossible de se suspendre/supprimer soi-même</p>
              <p>• Les suppressions sont définitives</p>
              <p>• Les suspensions bloquent l'accès immédiatement</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserManagementPage;