import React from 'react';

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`loading ${sizeClasses[size]}`}
        style={{
          width: size === 'small' ? '16px' : size === 'large' ? '48px' : '32px',
          height: size === 'small' ? '16px' : size === 'large' ? '48px' : '32px'
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
