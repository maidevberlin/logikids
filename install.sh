#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Logikids installation..."

# Update package list and install dependencies
echo "📦 Updating system and installing dependencies..."
sudo apt-get update
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git

# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

    # Add Docker repository
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
        $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Install Docker Engine
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io
fi

# Install Docker Compose if not already installed
if ! command -v docker-compose &> /dev/null; then
    echo "🐋 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Add current user to docker group
sudo usermod -aG docker $USER
echo "👤 Added current user to docker group"

# Clone the repository if not already present
if [ ! -d "logikids" ]; then
    echo "📥 Cloning the repository..."
    git clone https://github.com/maidevberlin/logikids.git
    cd logikids
else
    cd logikids
    echo "📂 Using existing repository..."
    git pull
fi

# Run the configuration script
echo "🔧 Running configuration setup..."
./configure.sh

# Start the application in production mode
echo "🚀 Starting the application in production mode..."
docker-compose up -d frontend-prod backend-prod

echo "✅ Installation complete!"
echo "🌐 Frontend is available at http://localhost:5174"
echo "🔌 Backend is available at http://localhost:5176"
echo "Note: Please log out and log back in for docker group changes to take effect." 