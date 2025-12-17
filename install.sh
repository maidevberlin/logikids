#!/bin/bash
#
# Logikids Installation Script
#
# Usage:
#   Fresh server:  curl -sSL https://raw.githubusercontent.com/maidevberlin/logikids/main/install.sh | bash
#   Local:         ./install.sh
#
# This script:
#   1. Installs Docker (if on Linux)
#   2. Clones/updates the repository
#   3. Generates secure secrets
#   4. Configures AI provider
#   5. Builds and starts the application
#   6. Optionally sets up Nginx with SSL

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                   Logikids Installation                          ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Detect OS
OS="$(uname -s)"
IS_LINUX=false
if [[ "$OS" == "Linux" ]]; then
    IS_LINUX=true
fi

# ═══════════════════════════════════════════════════════════════════════
# STEP 1: Install Docker (Linux only)
# ═══════════════════════════════════════════════════════════════════════

if $IS_LINUX; then
    echo -e "${BLUE}[1/6] Checking Docker installation...${NC}"

    if ! command -v docker &> /dev/null; then
        echo "Installing Docker..."
        sudo apt-get update
        sudo apt-get install -y \
            apt-transport-https \
            ca-certificates \
            curl \
            gnupg \
            lsb-release

        curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

        echo \
            "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
            $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

        sudo apt-get update
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        sudo usermod -aG docker $USER
        echo -e "${GREEN}✓ Docker installed${NC}"
    else
        echo -e "${GREEN}✓ Docker already installed${NC}"
    fi

    # Ensure Docker Compose plugin
    if ! docker compose version &> /dev/null; then
        sudo apt-get install -y docker-compose-plugin
    fi
else
    echo -e "${BLUE}[1/6] Skipping Docker install (not Linux)${NC}"
    echo "Make sure Docker Desktop is running."
fi

# ═══════════════════════════════════════════════════════════════════════
# STEP 2: Clone/Update Repository
# ═══════════════════════════════════════════════════════════════════════

echo ""
echo -e "${BLUE}[2/6] Setting up repository...${NC}"

# Check if we're already in the repo
if [[ -f "docker-compose.yml" && -d "packages/backend" ]]; then
    echo -e "${GREEN}✓ Already in logikids directory${NC}"
    git pull 2>/dev/null || echo "Could not pull updates (not a git repo or no remote)"
elif [[ -d "logikids" ]]; then
    cd logikids
    echo -e "${GREEN}✓ Using existing logikids directory${NC}"
    git pull 2>/dev/null || true
else
    echo "Cloning repository..."
    git clone https://github.com/maidevberlin/logikids.git
    cd logikids
    echo -e "${GREEN}✓ Repository cloned${NC}"
fi

# ═══════════════════════════════════════════════════════════════════════
# STEP 3: Generate Secrets
# ═══════════════════════════════════════════════════════════════════════

echo ""
echo -e "${BLUE}[3/6] Configuring secrets...${NC}"

generate_secret() {
    openssl rand -base64 64 | tr -d "=+/" | cut -c1-64
}

# Load existing .env if present
POSTGRES_PASSWORD=""
JWT_SECRET=""
ANTHROPIC_API_KEY=""
OPENAI_API_KEY=""

if [[ -f ".env" ]]; then
    source .env 2>/dev/null || true
    echo "Found existing .env file"
fi

# Generate missing secrets
if [[ -z "$POSTGRES_PASSWORD" ]]; then
    POSTGRES_PASSWORD=$(generate_secret)
    echo "Generated new POSTGRES_PASSWORD"
fi

if [[ -z "$JWT_SECRET" ]]; then
    JWT_SECRET=$(generate_secret)
    echo "Generated new JWT_SECRET"
fi

echo -e "${GREEN}✓ Secrets configured${NC}"

# ═══════════════════════════════════════════════════════════════════════
# STEP 4: Configure AI Provider
# ═══════════════════════════════════════════════════════════════════════

echo ""
echo -e "${BLUE}[4/6] Configuring AI provider...${NC}"
echo ""

# Check if we need to configure AI
NEED_AI_CONFIG=true
if [[ -n "$ANTHROPIC_API_KEY" || -n "$OPENAI_API_KEY" ]]; then
    echo "Existing API key found."
    read -p "Reconfigure AI provider? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        NEED_AI_CONFIG=false
    fi
fi

PROVIDER="anthropic"
MODEL="claude-sonnet-4-5"

if $NEED_AI_CONFIG; then
    echo "Select AI provider:"
    echo "  1) Anthropic (Claude) - Recommended"
    echo "  2) OpenAI (GPT)"
    echo "  3) Ollama (Local, no API key needed)"
    echo ""
    read -p "Enter choice [1-3]: " -n 1 -r AI_CHOICE
    echo ""
    echo ""

    case $AI_CHOICE in
        1)
            PROVIDER="anthropic"
            echo "Enter your Anthropic API key (https://console.anthropic.com/):"
            read -r NEW_KEY
            if [[ -n "$NEW_KEY" ]]; then
                ANTHROPIC_API_KEY="$NEW_KEY"
            fi

            echo ""
            echo "Select Claude model:"
            echo "  1) claude-sonnet-4-5 (Recommended)"
            echo "  2) claude-haiku-4-5 (Faster, cheaper)"
            echo "  3) claude-3-5-sonnet (Previous gen)"
            read -p "Choice [1-3]: " -n 1 -r
            echo ""
            case $REPLY in
                2) MODEL="claude-haiku-4-5" ;;
                3) MODEL="claude-3-5-sonnet-20241022" ;;
                *) MODEL="claude-sonnet-4-5" ;;
            esac
            ;;
        2)
            PROVIDER="openai"
            echo "Enter your OpenAI API key (https://platform.openai.com/):"
            read -r NEW_KEY
            if [[ -n "$NEW_KEY" ]]; then
                OPENAI_API_KEY="$NEW_KEY"
            fi

            echo ""
            echo "Select GPT model:"
            echo "  1) gpt-4o (Recommended)"
            echo "  2) gpt-4-turbo"
            echo "  3) gpt-3.5-turbo (Cheaper)"
            read -p "Choice [1-3]: " -n 1 -r
            echo ""
            case $REPLY in
                2) MODEL="gpt-4-turbo" ;;
                3) MODEL="gpt-3.5-turbo" ;;
                *) MODEL="gpt-4o" ;;
            esac
            ;;
        3)
            PROVIDER="ollama"
            MODEL="llama3-8b"
            echo -e "${YELLOW}Make sure Ollama is running on http://localhost:11434${NC}"
            ;;
        *)
            echo "Keeping default: Anthropic"
            ;;
    esac

    echo -e "${GREEN}✓ AI provider: $PROVIDER ($MODEL)${NC}"
fi

# ═══════════════════════════════════════════════════════════════════════
# STEP 4b: Configure TTS (Optional)
# ═══════════════════════════════════════════════════════════════════════

echo ""
echo -e "${BLUE}[4b/6] Configuring Text-to-Speech (optional)...${NC}"
echo ""
echo "Text-to-Speech allows tasks to be read aloud to students."
echo "Requires a Google Cloud API key with Text-to-Speech enabled."
echo ""
read -p "Enter Google Cloud TTS API key (or press Enter to skip): " TTS_KEY

if [[ -n "$TTS_KEY" ]]; then
    GOOGLE_CLOUD_TTS_API_KEY="$TTS_KEY"
    echo -e "${GREEN}✓ TTS configured${NC}"
else
    echo "Skipping TTS configuration"
fi

# ═══════════════════════════════════════════════════════════════════════
# STEP 5: Write Configuration
# ═══════════════════════════════════════════════════════════════════════

echo ""
echo -e "${BLUE}[5/6] Writing configuration...${NC}"

# Write .env file with all configuration
cat > .env << EOF
# Logikids Environment Configuration
# Generated: $(date)
# WARNING: Never commit this file!

# ═══════════════════════════════════════════════════════════════════════
# Security Secrets (REQUIRED)
# ═══════════════════════════════════════════════════════════════════════

POSTGRES_PASSWORD=$POSTGRES_PASSWORD
JWT_SECRET=$JWT_SECRET

# ═══════════════════════════════════════════════════════════════════════
# AI Provider Configuration
# ═══════════════════════════════════════════════════════════════════════

AI_PROVIDER=$PROVIDER
EOF

# Add provider-specific configuration
case $PROVIDER in
    ollama)
        cat >> .env << EOF

# Ollama Configuration
OLLAMA_HOST=http://host.docker.internal:11434
OLLAMA_MODEL=$MODEL
EOF
        ;;
    openai)
        cat >> .env << EOF

# OpenAI Configuration
OPENAI_API_KEY=$OPENAI_API_KEY
OPENAI_MODEL=$MODEL
EOF
        ;;
    anthropic)
        cat >> .env << EOF

# Anthropic Configuration
ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY
ANTHROPIC_MODEL=$MODEL
ANTHROPIC_MAX_TOKENS=4096
ANTHROPIC_TEMPERATURE=0.7
EOF
        ;;
esac

# Add TTS configuration if provided
if [[ -n "$GOOGLE_CLOUD_TTS_API_KEY" ]]; then
    cat >> .env << EOF

# Text-to-Speech Configuration
GOOGLE_CLOUD_TTS_API_KEY=$GOOGLE_CLOUD_TTS_API_KEY
TTS_VOICE_DE=de-DE-Standard-A
TTS_VOICE_EN=en-US-Standard-C
EOF
fi

echo -e "${GREEN}✓ Created .env${NC}"

# ═══════════════════════════════════════════════════════════════════════
# STEP 6: Build and Start
# ═══════════════════════════════════════════════════════════════════════

echo ""
echo -e "${BLUE}[6/6] Starting application...${NC}"

echo "Pulling pre-built images from GitHub Container Registry..."
docker compose -f docker-compose.prod.yml pull

echo "Starting services..."
docker compose -f docker-compose.prod.yml up -d

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                   Installation Complete!                         ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Application is running:"
echo "  Frontend: http://localhost:5154"
echo "  Backend:  http://localhost:5176"
echo ""
echo "Next steps:"
echo "  1. Create an invite code: ./invite create \"Your name\""
echo "  2. Open http://localhost:5154 in your browser"
echo ""

# Offer Nginx setup on Linux
if $IS_LINUX; then
    read -p "Set up Nginx with SSL for a domain? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [[ -f "setup-nginx.sh" ]]; then
            sudo ./setup-nginx.sh
        else
            echo -e "${YELLOW}setup-nginx.sh not found. Please set up Nginx manually.${NC}"
        fi
    fi
fi

echo ""
echo "For help: ./invite help"
