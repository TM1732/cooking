#!/bin/bash
echo "🧪 Tests complets..."
cd backend && ./mvnw test -q
BACKEND_RESULT=$?
cd ../frontend && npm test -- --coverage --watchAll=false
FRONTEND_RESULT=$?
cd ..
if [ $BACKEND_RESULT -eq 0 ] && [ $FRONTEND_RESULT -eq 0 ]; then
    echo "✅ Tous les tests passent !"
else
    echo "❌ Certains tests ont échoué"
fi
