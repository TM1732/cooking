import React from 'react';

const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose, 
  className = '',
  showIcon = true,
  closable = true 
}) => {
  
  const getAlertStyles = (type) => {
    const styles = {
      error: {
        container: 'bg-red-500/20 border-red-500/50 text-red-100',
        icon: '⚠️',
        iconColor: 'text-red-400',
        titleColor: 'text-red-200',
        textColor: 'text-red-100',
        closeColor: 'text-red-300 hover:text-red-100'
      },
      success: {
        container: 'bg-green-500/20 border-green-500/50 text-green-100',
        icon: '✅',
        iconColor: 'text-green-400',
        titleColor: 'text-green-200',
        textColor: 'text-green-100',
        closeColor: 'text-green-300 hover:text-green-100'
      },
      warning: {
        container: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-100',
        icon: '⚠️',
        iconColor: 'text-yellow-400',
        titleColor: 'text-yellow-200',
        textColor: 'text-yellow-100',
        closeColor: 'text-yellow-300 hover:text-yellow-100'
      },
      info: {
        container: 'bg-blue-500/20 border-blue-500/50 text-blue-100',
        icon: 'ℹ️',
        iconColor: 'text-blue-400',
        titleColor: 'text-blue-200',
        textColor: 'text-blue-100',
        closeColor: 'text-blue-300 hover:text-blue-100'
      }
    };
    return styles[type] || styles.info;
  };

  const styles = getAlertStyles(type);

  return (
    <div className={`rounded-lg border p-4 shadow-lg ${styles.container} ${className}`}>
      <div className="flex items-start space-x-3">
        
        {/* Icône */}
        {showIcon && (
          <span className={`text-xl flex-shrink-0 ${styles.iconColor}`}>
            {styles.icon}
          </span>
        )}
        
        {/* Contenu */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`font-medium mb-1 ${styles.titleColor}`}>
              {title}
            </h4>
          )}
          <div className={`text-sm leading-relaxed ${styles.textColor}`}>
            {typeof message === 'string' ? (
              <p>{message}</p>
            ) : (
              message
            )}
          </div>
        </div>
        
        {/* Bouton fermer */}
        {closable && onClose && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 text-lg transition-colors duration-200 ${styles.closeColor}`}
            aria-label="Fermer"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;