#!/bin/bash

# Exit on error
set -e

echo "🔧 Logikids Configuration Setup"
echo "------------------------------"

# Function to prompt for AI provider choice
prompt_ai_provider() {
    while true; do
        echo -e "\n📊 Choose your AI provider:"
        echo "1) OpenAI (Recommended for best results)"
        echo "2) Ollama (Open source, runs locally)"
        read -p "Enter your choice (1 or 2): " choice
        
        case $choice in
            1)
                echo "provider: openai" > config.yaml
                return
                ;;
            2)
                echo "provider: ollama" > config.yaml
                return
                ;;
            *)
                echo "❌ Invalid choice. Please enter 1 or 2."
                ;;
        esac
    done
}

# Function to validate OpenAI API key
validate_openai_key() {
    local key=$1
    if [[ -z "$key" ]]; then
        echo "❌ API key cannot be empty"
        return 1
    fi
    if [[ ! "$key" =~ ^sk-[A-Za-z0-9]{32,}$ ]]; then
        echo "❌ Invalid API key format. It should start with 'sk-' followed by at least 32 characters"
        return 1
    fi
    return 0
}

# Function to select OpenAI model
select_openai_model() {
    while true; do
        echo -e "\n🤖 Choose OpenAI Model:"
        echo "1) gpt-4o (Recommended - Best overall performance, latest features)"
        echo "2) gpt-4o-mini (Fast and affordable, great for most tasks)"
        echo "3) gpt-4-turbo (Previous generation, still very capable)"
        echo "4) gpt-3.5-turbo (Legacy model, not recommended for new projects)"
        read -p "Enter your choice (1-4): " choice
        
        case $choice in
            1)
                echo "gpt-4o"
                return
                ;;
            2)
                echo "gpt-4o-mini"
                return
                ;;
            3)
                echo "gpt-4-turbo"
                return
                ;;
            4)
                echo "gpt-3.5-turbo"
                return
                ;;
            *)
                echo "❌ Invalid choice. Please enter a number between 1 and 4."
                ;;
        esac
    done
}

# Function to select Ollama model
select_ollama_model() {
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
                echo "mixtral:8x7b"
                return
                ;;
            2)
                echo "llama3:70b"
                return
                ;;
            3)
                echo "qwen2.5:72b"
                return
                ;;
            4)
                echo "llama3:8b"
                return
                ;;
            5)
                echo "qwen2.5:7b"
                return
                ;;
            6)
                echo "gemma2:7b"
                return
                ;;
            7)
                echo "phi4:14b"
                return
                ;;
            *)
                echo "❌ Invalid choice. Please enter a number between 1 and 7."
                ;;
        esac
    done
}

# Function to configure OpenAI
configure_openai() {
    echo -e "\n🔑 OpenAI Configuration"
    echo "------------------------"
    echo "You'll need an OpenAI API key. You can get one at: https://platform.openai.com/api-keys"
    
    while true; do
        read -p "Enter your OpenAI API key: " api_key
        if validate_openai_key "$api_key"; then
            break
        fi
    done

    echo -e "\nSelecting OpenAI model..."
    model=$(select_openai_model)
    
    # Append OpenAI configuration
    cat >> config.yaml << EOL
  openai:
    apiKey: ${api_key}
    # Available models:
    # - gpt-4o: Best overall performance, latest features
    # - gpt-4o-mini: Fast and affordable, great for most tasks
    # - gpt-4-turbo: Previous generation, still very capable
    # - gpt-3.5-turbo: Legacy model, not recommended for new projects
    model: ${model}
EOL
}

# Function to configure Ollama
configure_ollama() {
    echo -e "\n🐳 Ollama Configuration"
    echo "----------------------"
    
    echo -e "\nSelecting Ollama model..."
    model=$(select_ollama_model)
    
    # Append Ollama configuration
    cat >> config.yaml << EOL
  ollama:
    host: http://host.docker.internal:11434
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
    model: ${model}
EOL
}

# Main configuration flow
echo -e "\n📁 Setting up configuration in packages/backend/config.yaml"

# Create backend directory if it doesn't exist
mkdir -p packages/backend

# Change to backend directory
cd packages/backend

# Start with server configuration
cat > config.yaml << EOL
server:
  port: 3000

ai:
EOL

# Prompt for AI provider
prompt_ai_provider

# Configure based on provider
if grep -q "provider: openai" config.yaml; then
    configure_openai
else
    configure_ollama
fi

echo -e "\n✅ Configuration complete! The config file has been created at: packages/backend/config.yaml"
echo "You can edit this file manually at any time to update your configuration." 