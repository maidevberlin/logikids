#!/bin/bash

# Exit on error
set -e

echo "🔄 Restarting Logikids..."

# Stop running containers
echo "⏹️ Stopping running containers..."
docker-compose down

# Rebuild and start containers
echo "🏗️ Rebuilding and starting containers..."
docker-compose build frontend-prod backend-prod
docker-compose up -d frontend-prod backend-prod

echo "✅ Restart complete!"
echo "🌐 Frontend is available at http://localhost:5174"
echo "🔌 Backend is available at http://localhost:5176" 