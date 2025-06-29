import React from 'react';

const footerItems = [
  { icon: "🎯", label: "Gestion de recettes" },
  { icon: "🔎", label: "Recherche avancée" },
  { icon: "💬", label: "Commentaires" },
  { icon: "👥", label: "Multi-utilisateurs" },
  { icon: "👑", label: "Admin (Gestion totale)" },
  { icon: "👨‍🍳", label: "Chef (CRUD recettes)" },
  { icon: "👤", label: "User (Lecture + commentaires)" },
  { icon: "⚙️", label: "React + Spring Boot" },
  { icon: "🔐", label: "JWT Auth" },
  { icon: "🗄️", label: "H2 Database" },
  { icon: "📱", label: "Responsive Design" },
];

const Footer = () => (
  <footer className="mt-auto bg-gray-900/80 backdrop-blur-md border-t border-gray-700/50 shadow-lg">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Logo et titre */}
      <div className="flex items-center justify-center mb-4">
        <span className="text-2xl mr-2">🍳</span>
        <span className="text-lg font-bold text-white bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          Cooking Website
        </span>
      </div>
      
      {/* Marquee avec les fonctionnalités */}
      <div className="relative overflow-hidden bg-gray-800/30 rounded-lg p-3 mb-4">
        <div className="flex animate-marquee space-x-8 whitespace-nowrap">
          {footerItems.concat(footerItems).map((item, idx) => (
            <div 
              key={idx}
              className="flex items-center space-x-2 bg-gray-700/40 rounded-full px-4 py-2 backdrop-blur-sm border border-gray-600/30"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium text-white/90">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Copyright */}
      <div className="text-center">
        <p className="text-xs text-gray-400">
          © 2025 Cooking Website — Application de démonstration
        </p>
      </div>
    </div>

    <style jsx>{`
      @keyframes marquee {
        0% {
          transform: translateX(0%);
        }
        100% {
          transform: translateX(-50%);
        }
      }
      
      .animate-marquee {
        animation: marquee 30s linear infinite;
      }
      
      .animate-marquee:hover {
        animation-play-state: paused;
      }
    `}</style>
  </footer>
);

export default Footer;