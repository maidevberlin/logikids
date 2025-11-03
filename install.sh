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

    # Install Docker Engine and Docker Compose plugin
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
else
    echo "✅ Docker already installed"
fi

# Remove old standalone docker-compose and install plugin if needed
if command -v docker-compose &> /dev/null && [ -f /usr/local/bin/docker-compose ]; then
    echo "🔄 Removing old standalone docker-compose..."
    sudo rm -f /usr/local/bin/docker-compose
fi

# Ensure Docker Compose plugin is installed
if ! docker compose version &> /dev/null; then
    echo "🐋 Installing Docker Compose plugin..."
    sudo apt-get update
    sudo apt-get install -y docker-compose-plugin
else
    echo "✅ Docker Compose plugin already installed"
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

# Generate .env file with secrets if it doesn't exist
if [ ! -f ".env" ]; then
    echo "🔐 Generating secure secrets..."

    # Generate random secure passwords
    POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
    JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)

    cat > .env << EOL
# Database Configuration
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

# JWT Secret for authentication
JWT_SECRET=${JWT_SECRET}

# Generated on $(date)
EOL

    echo "✅ Secrets generated and saved to .env"
else
    echo "✅ Using existing .env file"
fi

# Run the configuration script
echo "🔧 Running configuration setup..."
./configure.sh

# Build the containers
echo "🏗️ Building Docker containers..."
docker compose build frontend-prod backend-prod

# Start the application in production mode
echo "🚀 Starting the application in production mode..."
docker compose up -d postgres frontend-prod backend-prod

echo "✅ Installation complete!"
echo "🌐 Frontend is available at http://localhost:5154"
echo "🔌 Backend is available at http://localhost:5176"
echo "💡 The frontend automatically proxies /api requests to the backend"
echo "Note: Please log out and log back in for docker group changes to take effect."

# Ask if user wants to set up Nginx with SSL
read -p "Would you like to set up Nginx with SSL support? (y/N) " setup_nginx
if [[ $setup_nginx =~ ^[Yy]$ ]]; then
    echo "🔒 Setting up Nginx with SSL..."
    sudo ./setup-nginx.sh
fi 