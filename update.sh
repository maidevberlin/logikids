#!/bin/bash

# Exit on error
set -e

echo "Updating Logikids..."

# Pull latest changes (for migrations, translations, etc.)
echo "Pulling latest code..."
git pull

# Run restart script (pulls images and restarts)
echo "Restarting application..."
./restart.sh
