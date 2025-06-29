import React from 'react';

const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div 
      className={`card ${hover ? 'hover:transform hover:scale-105' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
