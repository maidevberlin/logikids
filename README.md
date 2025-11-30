# Logikids - AI-Powered Educational Platform

An innovative educational platform designed to help children aged 8-16 develop logical thinking and problem-solving skills through interactive, AI-powered tasks. The platform focuses on various subjects including logic, mathematics, and music, delivering personalized learning experiences.

## 🌟 Features

- **Multi-Subject Learning**
  - Logic puzzles and pattern recognition
  - Mathematical reasoning
  - Music theory and rhythm
  - Dynamic task generation based on subject and concept

- **AI-Powered Learning Experience**
  - Intelligent task generation system
  - Personalized learning paths
  - Real-time feedback and hints
  - Adaptive difficulty levels

- **Modern Architecture**
  - Microservices-based design
  - Containerized development and deployment
  - Scalable and maintainable codebase
  - Privacy-first approach

## 🚀 Tech Stack

### Frontend

- React with TypeScript
- TailwindCSS for styling
- TanStack Query for data fetching
- tRPC for typed client-server communication
- React Router for navigation
- Zod for data validation
- i18next for internationalization (German/English)
- Vite for development and building

### Backend

- Bun runtime with TypeScript
- Express API with tRPC
- PostgreSQL database
- AI integration (Anthropic, OpenAI, Ollama)

## 🛠 Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/maidev/logikids.git
   cd logikids
   ```

2. **Configure AI Settings**

   ```bash
   # Navigate to backend package
   cd packages/backend

   # Copy configuration template
   cp config.yaml.example config.yaml

   # Edit config.yaml with your preferred settings
   # - Choose AI provider (ollama/openai)
   # - Set API keys if using OpenAI
   # - Adjust model parameters
   ```

3. **Setup Ollama (if using Ollama as AI provider)**

   ```bash
   # Install Ollama following instructions at: https://ollama.ai

   # Install required models
   ollama pull llama2
   ollama pull llama2-vision

   # Verify Ollama is running
   curl http://localhost:11434/api/tags
   ```

## 🛠 Development Setup

### Prerequisites

- Docker and Docker Compose
- Ollama (for AI features)

### Development Commands

1. **Start Development Environment**

   ```bash
   # Start all services in development mode (this will build the images if they don't exist)
   docker compose up frontend-dev backend-dev

   # Start only frontend
   docker compose up frontend-dev

   # Start only backend
   docker compose up backend-dev
   ```

   - Frontend will be available at: http://localhost:5153
   - Backend API will be available at: http://localhost:5175

2. **Production Mode**

   ```bash
   # Build and start production services
   docker compose up frontend-prod backend-prod --build

   # Start without rebuilding
   docker compose up frontend-prod backend-prod
   ```

   - Frontend will be available at: http://localhost:5154
   - Backend API will be available at: http://localhost:5176

3. **Docker Commands**

   ```bash
   # View logs
   docker compose logs -f frontend-dev
   docker compose logs -f backend-dev

   # Rebuild specific service
   docker compose build frontend-dev
   docker compose build backend-dev

   # Stop all services
   docker compose down

   # Remove all containers and volumes
   docker compose down -v
   ```

### Testing

```bash
# Run backend tests
docker compose run backend-test

# Run frontend tests
docker compose run frontend-dev npm test
```

### Invite Code Management (Beta Access)

LogiKids is currently in closed beta with invite-only access. Use the `./invite` script to manage codes:

```bash
# List all active invite codes
./invite list

# Create new invite code with optional note
./invite create "For Maria's family"

# Remove specific invite code
./invite remove ABCD-1234

# Delete all invite codes (with confirmation)
./invite clear

# Show help
./invite help
```

**Notes:**

- Codes expire after 7 days if unused
- Codes are automatically deleted after successful use
- Each code can only be used once
- Codes use format: XXXX-XXXX (e.g., AB3D-KL89)

## 📁 Project Structure

```
logikids/
├── packages/
│   ├── frontend/          # React frontend application
│   ├── backend/           # Bun backend service
│   └── content/           # Educational subjects and concepts
├── .claude/docs/          # Internal documentation
└── docker-compose.yml     # Docker services configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)**.

You are free to:

- **Share** — copy and redistribute the material
- **Adapt** — remix, transform, and build upon the material

Under the following terms:

- **Attribution** — You must give appropriate credit
- **NonCommercial** — You may not use the material for commercial purposes

See [LICENSE](LICENSE) for full details.

## 🆘 Support

For questions and support:

1. Open an issue in the repository
