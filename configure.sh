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

# Get AI provider
while true; do
    echo -e "\n📊 Choose your AI provider:"
    echo "1) OpenAI (Recommended for best results)"
    echo "2) Ollama (Open source, runs locally)"
    read -p "Enter your choice (1 or 2): " choice
    
    case $choice in
        1)
            PROVIDER="openai"
            break
            ;;
        2)
            PROVIDER="ollama"
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
        echo "1) gpt-4o (Recommended - Best overall performance, latest features)"
        echo "2) gpt-4o-mini (Fast and affordable, great for most tasks)"
        echo "3) gpt-4-turbo (Previous generation, still very capable)"
        echo "4) gpt-3.5-turbo (Legacy model, not recommended for new projects)"
        read -p "Enter your choice (1-4): " choice
        
        case $choice in
            1)
                MODEL="gpt-4o"
                break
                ;;
            2)
                MODEL="gpt-4o-mini"
                break
                ;;
            3)
                MODEL="gpt-4-turbo"
                break
                ;;
            4)
                MODEL="gpt-3.5-turbo"
                break
                ;;
            *)
                echo "❌ Invalid choice. Please enter a number between 1 and 4."
                ;;
        esac
    done
else
    echo -e "\n🐳 Ollama Configuration"
    echo "----------------------"
    
    # Get Ollama model
    while true; do
        echo -e "\n🤖 Choose Ollama Model:"
        echo -e "\n💪 High Performance Models (Requires powerful hardware):"
        echo "1) mixtral-8x7b (Recommended - Best overall performance and reasoning)"
        echo "2) llama3-70b (Excellent for educational content, needs >50GB RAM)"
        echo "3) qwen2.5-72b (Great for complex reasoning, needs >50GB RAM)"
        
        echo -e "\n💻 Standard Models (Recommended for most users):"
        echo "4) llama3-8b (Good balance of performance and resource usage)"
        echo "5) qwen2.5-7b (Efficient for educational tasks)"
        echo "6) gemma2-7b (Reliable for structured content)"
        echo "7) phi4-14b (Specialized in mathematical reasoning)"
        
        read -p "Enter your choice (1-7): " choice
        
        case $choice in
            1)
                MODEL="mixtral:8x7b"
                break
                ;;
            2)
                MODEL="llama3:70b"
                break
                ;;
            3)
                MODEL="qwen2.5:72b"
                break
                ;;
            4)
                MODEL="llama3:8b"
                break
                ;;
            5)
                MODEL="qwen2.5:7b"
                break
                ;;
            6)
                MODEL="gemma2:7b"
                break
                ;;
            7)
                MODEL="phi4:14b"
                break
                ;;
            *)
                echo "❌ Invalid choice. Please enter a number between 1 and 7."
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
    # Available models:
    # - gpt-4o: Best overall performance, latest features
    # - gpt-4o-mini: Fast and affordable, great for most tasks
    # - gpt-4-turbo: Previous generation, still very capable
    # - gpt-3.5-turbo: Legacy model, not recommended for new projects
EOL
else
    cat > "$CONFIG_FILE" << EOL
server:
  port: 3000

ai:
  provider: ollama
  ollama:
    host: http://host.docker.internal:11434
    model: ${MODEL}
    # High Performance Models (Requires powerful hardware):
    # - mixtral-8x7b: Best overall performance and reasoning capabilities
    # - llama3-70b: Excellent for educational content (needs >50GB RAM)
    # - qwen2.5-72b: Great for complex reasoning (needs >50GB RAM)
    #
    # Standard Models (Recommended for most users):
    # - llama3-8b: Good balance of performance and resource usage
    # - qwen2.5-7b: Efficient for educational tasks
    # - gemma2-7b: Reliable for structured content
    # - phi4-14b: Specialized in mathematical reasoning
EOL
fi

echo -e "\n✅ Configuration complete! File has been created at: $CONFIG_FILE"
echo "Please verify the contents of the file:"
echo "----------------------------------------"
cat "$CONFIG_FILE"
echo "----------------------------------------"
echo "If the configuration looks correct, you can copy it to packages/backend/config.yaml" 