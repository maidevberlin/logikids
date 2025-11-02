#!/bin/bash

# Exit on error
set -e

echo "🔧 Logikids Configuration Setup"
echo "------------------------------"

# Variables to store configuration
CONFIG_FILE="packages/backend/config.yaml"
PROVIDER=""
API_KEY=""
MODEL=""

# Function to extract existing API key
get_existing_api_key() {
    if [[ -f "$CONFIG_FILE" ]]; then
        local existing_key
        existing_key=$(grep "apiKey:" "$CONFIG_FILE" | cut -d: -f2 | tr -d ' ' || echo "")
        if [[ ! -z "$existing_key" ]]; then
            echo "$existing_key"
            return 0
        fi
    fi
    echo ""
    return 1
}

# Function to validate OpenAI API key
validate_openai_key() {
    local key=$1
    local has_existing=$2

    # If empty input and no existing key
    if [[ -z "$key" && "$has_existing" != "true" ]]; then
        echo "❌ API key cannot be empty"
        return 1
    fi

    # If not empty, validate format
    if [[ ! -z "$key" && ! "$key" =~ ^sk-[A-Za-z0-9_.-]{32,}$ ]]; then
        echo "❌ Invalid API key format. It should start with 'sk-' followed by letters, numbers, underscores, dots, or hyphens"
        return 1
    fi

    return 0
}

# Function to validate Anthropic API key
validate_anthropic_key() {
    local key=$1
    local has_existing=$2

    # If empty input and no existing key
    if [[ -z "$key" && "$has_existing" != "true" ]]; then
        echo "❌ API key cannot be empty"
        return 1
    fi

    # If not empty, validate format
    if [[ ! -z "$key" && ! "$key" =~ ^sk-ant-[A-Za-z0-9_.-]{32,}$ ]]; then
        echo "❌ Invalid API key format. It should start with 'sk-ant-' followed by letters, numbers, underscores, dots, or hyphens"
        return 1
    fi

    return 0
}

# Get AI provider
while true; do
    echo -e "\n📊 Choose your AI provider:"
    echo "1) OpenAI (GPT-5 and GPT-4.1 models)"
    echo "2) Anthropic (Claude 4 models, excellent reasoning)"
    read -p "Enter your choice (1 or 2): " choice

    case $choice in
        1)
            PROVIDER="openai"
            break
            ;;
        2)
            PROVIDER="anthropic"
            break
            ;;
        *)
            echo "❌ Invalid choice. Please enter 1 or 2."
            ;;
    esac
done

# Get configuration based on provider
if [[ "$PROVIDER" == "openai" ]]; then
    echo -e "\n🔑 OpenAI Configuration"
    echo "------------------------"
    
    # Check for existing API key
    EXISTING_KEY=$(get_existing_api_key) || true
    HAS_EXISTING=false
    if [[ ! -z "$EXISTING_KEY" ]]; then
        HAS_EXISTING=true
        echo "Existing API key found. Press Enter to keep the existing key, or enter a new one."
        echo "Current key: ${EXISTING_KEY:0:7}...${EXISTING_KEY: -4}"
    else
        echo "You'll need an OpenAI API key. You can get one at: https://platform.openai.com/api-keys"
    fi
    
    # Get API key
    while true; do
        read -p "Enter your OpenAI API key (or press Enter to keep existing): " API_KEY
        if [[ -z "$API_KEY" && "$HAS_EXISTING" == "true" ]]; then
            API_KEY="$EXISTING_KEY"
            echo "Using existing API key."
            break
        elif validate_openai_key "$API_KEY" "$HAS_EXISTING"; then
            break
        fi
    done
    
    # Get OpenAI model
    while true; do
        echo -e "\n🤖 Choose OpenAI Model:"
        echo "1) gpt-5 (Recommended - Best overall performance, state-of-the-art)"
        echo "2) gpt-4.5 (Research preview, excellent for complex tasks)"
        echo "3) gpt-4.1 (Improved instruction following, great for educational content)"
        echo "4) gpt-4.1-mini (Fast and affordable, good balance)"
        read -p "Enter your choice (1-4): " choice

        case $choice in
            1)
                MODEL="gpt-5"
                break
                ;;
            2)
                MODEL="gpt-4.5"
                break
                ;;
            3)
                MODEL="gpt-4.1"
                break
                ;;
            4)
                MODEL="gpt-4.1-mini"
                break
                ;;
            *)
                echo "❌ Invalid choice. Please enter a number between 1 and 4."
                ;;
        esac
    done
elif [[ "$PROVIDER" == "anthropic" ]]; then
    echo -e "\n🤖 Anthropic Configuration"
    echo "------------------------"

    # Check for existing API key
    EXISTING_KEY=$(get_existing_api_key) || true
    HAS_EXISTING=false
    if [[ ! -z "$EXISTING_KEY" ]]; then
        HAS_EXISTING=true
        echo "Existing API key found. Press Enter to keep the existing key, or enter a new one."
        echo "Current key: ${EXISTING_KEY:0:7}...${EXISTING_KEY: -4}"
    else
        echo "You'll need an Anthropic API key. You can get one at: https://console.anthropic.com/settings/keys"
    fi

    # Get API key
    while true; do
        read -p "Enter your Anthropic API key (or press Enter to keep existing): " API_KEY
        if [[ -z "$API_KEY" && "$HAS_EXISTING" == "true" ]]; then
            API_KEY="$EXISTING_KEY"
            echo "Using existing API key."
            break
        elif validate_anthropic_key "$API_KEY" "$HAS_EXISTING"; then
            break
        fi
    done

    # Get Anthropic model
    while true; do
        echo -e "\n🤖 Choose Anthropic Model:"
        echo "1) claude-sonnet-4.5 (Recommended - Best coding model, frontier performance)"
        echo "2) claude-haiku-4.5 (Fast and affordable, near-frontier quality)"
        echo "3) claude-opus-4.1 (Excellent for agentic tasks and complex reasoning)"
        echo "4) claude-sonnet-4 (Everyday model, well-balanced)"
        read -p "Enter your choice (1-4): " choice

        case $choice in
            1)
                MODEL="claude-sonnet-4.5"
                break
                ;;
            2)
                MODEL="claude-haiku-4.5"
                break
                ;;
            3)
                MODEL="claude-opus-4.1"
                break
                ;;
            4)
                MODEL="claude-sonnet-4"
                break
                ;;
            *)
                echo "❌ Invalid choice. Please enter a number between 1 and 4."
                ;;
        esac
    done
fi

# Write the configuration file
echo -e "\n📝 Writing configuration to $CONFIG_FILE..."

if [[ "$PROVIDER" == "openai" ]]; then
    cat > "$CONFIG_FILE" << EOL
server:
  port: 3000

ai:
  provider: openai
  openai:
    apiKey: ${API_KEY}
    model: ${MODEL}
    # Available models (2025):
    # - gpt-5: Best overall performance, state-of-the-art (Released Aug 2025)
    # - gpt-4.5: Research preview, excellent for complex tasks
    # - gpt-4.1: Improved instruction following, great for educational content
    # - gpt-4.1-mini: Fast and affordable, good balance
EOL
elif [[ "$PROVIDER" == "anthropic" ]]; then
    cat > "$CONFIG_FILE" << EOL
server:
  port: 3000

ai:
  provider: anthropic
  anthropic:
    apiKey: ${API_KEY}
    model: ${MODEL}
    maxTokens: 4096
    temperature: 0.7
    # Available models (2025):
    # - claude-sonnet-4.5: Best coding model, frontier performance (Recommended)
    # - claude-haiku-4.5: Fast and affordable, near-frontier quality
    # - claude-opus-4.1: Excellent for agentic tasks and complex reasoning
    # - claude-sonnet-4: Everyday model, well-balanced
EOL
fi

echo -e "\n✅ Configuration complete! File has been created at: $CONFIG_FILE"
echo "Please verify the contents of the file:"
echo "----------------------------------------"
cat "$CONFIG_FILE"
echo "----------------------------------------"
echo "If the configuration looks correct, you can copy it to packages/backend/config.yaml" 