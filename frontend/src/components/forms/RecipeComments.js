import React, { useEffect, useState } from 'react';
import commentService from '../../services/commentService';
import { useAuth } from '../../contexts/AuthContext';

// Fonction d'affichage "il y a 2 min"
function timeAgo(dateString) {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return `il y a ${seconds} sec`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days} j`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `il y a ${weeks} sem`;
  const months = Math.floor(days / 30);
  if (months < 12) return `il y a ${months} mois`;
  const years = Math.floor(days / 365);
  return `il y a ${years} an${years > 1 ? 's' : ''}`;
}

const RecipeComments = ({ recipeId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [addError, setAddError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { loadComments(); }, [recipeId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const list = await commentService.getByRecipe(recipeId);
      setComments(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch {
      setComments([]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await commentService.add(recipeId, content.trim());
      setContent('');
      await loadComments();
      setAddError(null);
    } catch {
      setAddError("Erreur lors de l'ajout du commentaire");
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Supprimer ce commentaire ?')) return;
    setDeleting(commentId);
    try {
      await commentService.remove(commentId);
      await loadComments();
    } catch {
      alert('Suppression impossible');
    }
    setDeleting(null);
  };

  return (
    <section className="my-10">
      
      {/* Header avec titre et badge */}
      <div className="flex items-center space-x-4 mb-8">
        <h3 className="text-2xl text-white font-bold flex items-center space-x-3">
          <span>💬</span>
          <span>Commentaires</span>
        </h3>
        <span 
          className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30"
          aria-label={`${comments.length} commentaires`}
        >
          {comments.length}
        </span>
      </div>

      {/* Formulaire d'ajout de commentaire */}
      {isAuthenticated ? (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-start space-x-3">
              {/* Avatar utilisateur connecté */}
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              
              {/* Zone de texte */}
              <div className="flex-1">
                <textarea
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={3}
                  value={content}
                  placeholder="Ajouter un commentaire..."
                  onChange={e => setContent(e.target.value)}
                />
                
                {/* Bouton publier */}
                <div className="flex justify-end mt-3">
                  <button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    disabled={!content.trim()}
                  >
                    <span>📝</span>
                    <span>Publier</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Message d'erreur */}
            {addError && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>{addError}</span>
                </div>
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className="bg-gray-700/30 rounded-lg p-4 mb-8 border border-gray-600/30">
          <div className="text-white/70 text-center flex items-center justify-center space-x-2">
            <span>🔒</span>
            <span className="italic">Connectez-vous pour écrire un commentaire.</span>
          </div>
        </div>
      )}

      {/* Liste des commentaires */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-white/70 flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Chargement des commentaires...</span>
          </div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">💭</div>
          <p className="text-white/50 text-lg">Aucun commentaire pour cette recette.</p>
          <p className="text-white/40 text-sm mt-2">Soyez le premier à donner votre avis !</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div 
              key={comment.id} 
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-200"
            >
              <div className="flex items-start space-x-3">
                
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">
                    {(comment.username ? comment.username.charAt(0).toUpperCase() : "U")}
                  </span>
                </div>
                
                {/* Contenu du commentaire */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-white font-medium">
                      {comment.username || "Utilisateur"}
                    </span>
                    <span className="text-white/50 text-sm">
                      • {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-white/90 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
                
                {/* Bouton supprimer */}
                {(user?.role?.toUpperCase() === 'ADMIN' || String(user?.id) === String(comment.userId)) && (
                  <button
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-lg transition-all duration-200 flex-shrink-0"
                    onClick={() => handleDelete(comment.id)}
                    disabled={deleting === comment.id}
                    title="Supprimer le commentaire"
                  >
                    {deleting === comment.id ? (
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecipeComments;