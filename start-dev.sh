#!/bin/bash

echo "🚀 Démarrage de Cooking Website..."

cleanup() {
    echo "🛑 Arrêt des services..."
    pkill -f "spring-boot:run" 2>/dev/null
    pkill -f "react-scripts" 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Backend
echo "📦 Démarrage backend..."
cd backend && ./mvnw spring-boot:run > ../backend.log 2>&1 &
cd ..

# Attendre le backend
echo "⏳ Attente backend (15s)..."
sleep 15

# Frontend
echo "🎨 Démarrage frontend..."
cd frontend && npm start > ../frontend.log 2>&1 &
cd ..

echo ""
echo "✅ Application démarrée !"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8080"
echo "🗄️ H2 Console: http://localhost:8080/h2-console"
echo ""
echo "👥 Comptes de test :"
echo "   Admin: admin/admin"
echo "   Chef: chef/chef"
echo "   User: user/user"
echo ""
echo "🛑 Pour arrêter: Ctrl+C"

wait
