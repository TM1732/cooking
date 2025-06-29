#!/bin/bash

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${BLUE}📦 $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

echo "🚀 Démarrage de Cooking Website..."

# Fonction de nettoyage
cleanup() {
    echo ""
    print_warning "Arrêt des services..."
    
    # Arrêter Spring Boot
    pkill -f "spring-boot:run" 2>/dev/null && echo "🛑 Backend arrêté"
    
    # Arrêter React
    pkill -f "react-scripts" 2>/dev/null && echo "🛑 Frontend arrêté"
    
    # Nettoyer les logs
    rm -f backend.log frontend.log 2>/dev/null
    
    echo "👋 Au revoir !"
    exit 0
}

# Piéger les signaux d'interruption
trap cleanup SIGINT SIGTERM

# Vérifications préliminaires
check_prerequisites() {
    local errors=0
    
    # Vérifier la structure du projet
    if [ ! -d "backend" ]; then
        print_error "Dossier 'backend' manquant"
        ((errors++))
    fi
    
    if [ ! -d "frontend" ]; then
        print_error "Dossier 'frontend' manquant"
        ((errors++))
    fi
    
    # Vérifier les fichiers essentiels
    if [ ! -f "backend/pom.xml" ]; then
        print_error "backend/pom.xml manquant"
        ((errors++))
    fi
    
    if [ ! -f "frontend/package.json" ]; then
        print_error "frontend/package.json manquant"
        ((errors++))
    fi
    
    # Vérifier Maven wrapper ou Maven
    if [ ! -f "backend/mvnw" ] && ! command -v mvn &> /dev/null; then
        print_error "Ni mvnw ni Maven installé"
        ((errors++))
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        print_error "npm non installé"
        ((errors++))
    fi
    
    if [ $errors -gt 0 ]; then
        echo ""
        print_error "Erreurs détectées. Solutions :"
        echo "  1. Exécutez ce script depuis le dossier cooking-website/"
        echo "  2. Ou relancez l'installation complète"
        echo "  3. Vérifiez que Java et Node.js sont installés"
        exit 1
    fi
    
    print_success "Vérifications OK"
}

# Démarrer le backend
start_backend() {
    print_info "Démarrage du backend..."
    
    cd backend || {
        print_error "Impossible d'accéder au dossier backend"
        exit 1
    }
    
    # Choisir Maven wrapper ou Maven installé
    if [ -f "./mvnw" ] && [ -x "./mvnw" ]; then
        print_info "Utilisation du Maven wrapper..."
        ./mvnw spring-boot:run > ../backend.log 2>&1 &
    elif command -v mvn &> /dev/null; then
        print_info "Utilisation de Maven installé..."
        mvn spring-boot:run > ../backend.log 2>&1 &
    else
        print_error "Aucun Maven disponible"
        exit 1
    fi
    
    BACKEND_PID=$!
    cd .. || exit 1
    
    print_success "Backend démarré (PID: $BACKEND_PID)"
}

# Attendre que le backend soit prêt
wait_for_backend() {
    print_info "Attente du démarrage du backend..."
    
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s -k https://localhost:8443/actuator/health &>/dev/null || \
           curl -s -k https://localhost:8443 &>/dev/null; then
            print_success "Backend prêt !"
            return 0
        fi
        
        # Vérifier si le processus backend est encore en vie
        if ! kill -0 $BACKEND_PID 2>/dev/null; then
            print_error "Le backend a planté ! Vérifiez backend.log"
            tail -10 backend.log 2>/dev/null || echo "Impossible de lire backend.log"
            exit 1
        fi
        
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    print_warning "Backend prend plus de temps que prévu, mais on continue..."
}

# Démarrer le frontend
start_frontend() {
    print_info "Démarrage du frontend..."
    
    cd frontend || {
        print_error "Impossible d'accéder au dossier frontend"
        exit 1
    }
    
    # Vérifier que les dépendances sont installées
    if [ ! -d "node_modules" ]; then
        print_warning "node_modules manquant, installation..."
        npm install
    fi
    
    # Démarrer React
    npm start > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd .. || exit 1
    
    print_success "Frontend démarré (PID: $FRONTEND_PID)"
}

# Attendre que le frontend soit prêt
wait_for_frontend() {
    print_info "Attente du démarrage du frontend..."
    
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s http://localhost:3000 &>/dev/null; then
            print_success "Frontend prêt !"
            return 0
        fi
        
        # Vérifier si le processus frontend est encore en vie
        if ! kill -0 $FRONTEND_PID 2>/dev/null; then
            print_error "Le frontend a planté ! Vérifiez frontend.log"
            tail -10 frontend.log 2>/dev/null || echo "Impossible de lire frontend.log"
            exit 1
        fi
        
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    print_warning "Frontend prend plus de temps que prévu..."
}

# Afficher les informations de fin
show_info() {
    echo ""
    print_success "🎉 Application démarrée avec succès !"
    echo ""
    echo "🌐 URLs accessibles :"
    echo "   🎨 Frontend:     http://localhost:3000"
    echo "   🔧 Backend API:  http://localhost:8080/api"
    echo "   🗄️ H2 Console:   http://localhost:8080/h2-console"
    echo ""
    echo "🗄️ Configuration H2 Console :"
    echo "   JDBC URL: jdbc:h2:mem:testdb"
    echo "   Username: sa"
    echo "   Password: (vide)"
    echo ""
    echo "👥 Comptes de test :"
    echo "   👑 Admin:  admin/admin  (Gestion complète)"
    echo "   👨‍🍳 Chef:   chef/chef    (CRUD recettes)"
    echo "   👤 User:   user/user    (Lecture + commentaires)"
    echo ""
    echo "📋 Commandes utiles :"
    echo "   🔍 Logs backend:  tail -f backend.log"
    echo "   🔍 Logs frontend: tail -f frontend.log"
    echo "   🛑 Arrêter:       Ctrl+C"
    echo ""
    echo "⏳ Services en cours d'exécution..."
    echo "   Backend PID: $BACKEND_PID"
    echo "   Frontend PID: $FRONTEND_PID"
    echo ""
    
    # Ouvrir automatiquement le navigateur (optionnel)
    if command -v open &> /dev/null; then
        print_info "Ouverture automatique du navigateur..."
        sleep 3
        open http://localhost:3000 &
    elif command -v xdg-open &> /dev/null; then
        print_info "Ouverture automatique du navigateur..."
        sleep 3
        xdg-open http://localhost:3000 &
    fi
}

# =================== EXECUTION PRINCIPALE ===================

main() {
    # Vérifications préliminaires
    check_prerequisites
    
    # Démarrage du backend
    start_backend
    
    # Attendre que le backend soit prêt
    wait_for_backend
    
    # Démarrage du frontend
    start_frontend
    
    # Attendre que le frontend soit prêt
    wait_for_frontend
    
    # Afficher les informations
    show_info
    
    # Attendre les processus (permet de les garder en vie)
    wait $BACKEND_PID $FRONTEND_PID
}

# Lancer l'application
main "$@"