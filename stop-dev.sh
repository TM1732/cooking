#!/bin/bash
echo "🛑 Arrêt des services..."
pkill -f "spring-boot:run" 2>/dev/null
pkill -f "react-scripts" 2>/dev/null
rm -f *.log 2>/dev/null
echo "✅ Services arrêtés"
