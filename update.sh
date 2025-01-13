#!/bin/bash

# Exit on error
set -e

echo "🔄 Updating Logikids..."

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull

# Run restart script
echo "🔄 Restarting application..."
./restart.sh 