#!/bin/bash

# Exit on error
set -e

echo "Restarting Logikids..."

# Stop running containers
echo "Stopping running containers..."
docker compose -f docker-compose.prod.yml down

# Pull latest images
echo "Pulling latest images from ghcr.io..."
docker compose -f docker-compose.prod.yml pull

# Start containers
echo "Starting containers..."
docker compose -f docker-compose.prod.yml up -d

echo "Restart complete!"
echo "PostgreSQL is running on port 5432"
echo "Frontend is available at http://localhost:5154"
echo "Backend is available at http://localhost:5176"
