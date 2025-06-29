import React, { useState, useEffect } from 'react';

// Composant Toast individuel
const Toast = ({ id, type, title, message, duration = 5000, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      handleRemove();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(id);
    }, 300);
  };

  const getToastStyles = (type) => {
    const styles = {
      error: {
        container: 'bg-red-500/90 border-red-400',
        icon: '⚠️',
        iconColor: 'text-red-100',
        titleColor: 'text-white',
        textColor: 'text-red-100'
      },
      success: {
        container: 'bg-green-500/90 border-green-400',
        icon: '✅',
        iconColor: 'text-green-100',
        titleColor: 'text-white',
        textColor: 'text-green-100'
      },
      warning: {
        container: 'bg-yellow-500/90 border-yellow-400',
        icon: '⚠️',
        iconColor: 'text-yellow-100',
        titleColor: 'text-white',
        textColor: 'text-yellow-100'
      },
      info: {
        container: 'bg-blue-500/90 border-blue-400',
        icon: 'ℹ️',
        iconColor: 'text-blue-100',
        titleColor: 'text-white',
        textColor: 'text-blue-100'
      }
    };
    return styles[type] || styles.info;
  };

  const styles = getToastStyles(type);

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isRemoving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        bg-white shadow-lg rounded-lg border-l-4 p-4 mb-3 max-w-sm
        ${styles.container}
      `}
    >
      <div className="flex items-start space-x-3">
        <span className={`text-lg flex-shrink-0 ${styles.iconColor}`}>
          {styles.icon}
        </span>
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`font-medium mb-1 ${styles.titleColor}`}>
              {title}
            </h4>
          )}
          <p className={`text-sm ${styles.textColor}`}>
            {message}
          </p>
        </div>
        
        <button
          onClick={handleRemove}
          className="text-white/70 hover:text-white text-lg flex-shrink-0 transition-colors duration-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Container pour les toasts
export const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

// Hook pour gérer les toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message, title = null, duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, type, title, message, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showError = (message, title = "Erreur") => addToast('error', message, title);
  const showSuccess = (message, title = "Succès") => addToast('success', message, title);
  const showWarning = (message, title = "Attention") => addToast('warning', message, title);
  const showInfo = (message, title = "Information") => addToast('info', message, title);

  return {
    toasts,
    addToast,
    removeToast,
    showError,
    showSuccess,
    showWarning,
    showInfo
  };
};

export default Toast;