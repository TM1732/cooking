# 🍳 Cooking Website

Application web complète de partage de recettes avec Spring Boot et React.

## 🚀 Démarrage ultra-rapide

```bash
docker compose up
```

## 📍 Accès à l'application

- **Frontend**: http://localhost:3000
- **Backend API**: https://localhost:8443/api  
- **Base de données H2**: https://localhost:8443/h2-console

## 👥 Comptes de démonstration

| Rôle  | Username | Password | Permissions |
|-------|----------|----------|-------------|
| Admin | admin    | admin    | Gestion complète |
| Chef  | chef     | chef     | CRUD recettes |
| User  | user     | user     | Lecture + commentaires |

## 🏗️ Technologies

- **Backend**: Spring Boot, Spring Security, JPA, JWT
- **Frontend**: React, TailwindCSS, Axios
- **Base de données**: H2 (dev), PostgreSQL (prod) (non implémenté)
- **Authentification**: JWT avec rôles

## 📁 Structure

```
cooking-website/
├── backend/          # API Spring Boot
├── frontend/         # SPA React
├── start-dev.sh      # Démarrage rapide
└── README.md         # Documentation
```

## 🎯 Fonctionnalités

✅ Authentification sécurisée (JWT)  
✅ Gestion des rôles (Admin/Chef/User)  
✅ CRUD complet des recettes  
✅ Recherche par mots-clés (non implémenté)  
✅ Système de commentaires  
✅ Email de bienvenue (en dev, dans les logs)  
✅ Interface responsive  
✅ API REST sécurisée  

# Cooking-Website Challenge
