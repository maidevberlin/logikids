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
- React Query for data fetching
- React Router for navigation
- Zod for data validation
- React Testing Library & Jest for testing
- Vite for development and building

### Backend
- Node.js with TypeScript
- Bun runtime for improved performance
- RESTful API design
- AI integration for task generation
- Comprehensive test coverage

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
   cp config.template.yaml config.yaml
   
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

## 📁 Project Structure

```
logikids/
├── packages/
│   ├── frontend/          # React frontend application
│   └── backend/           # Node.js backend service
├── docs/                  # Documentation for AI prompts and other stuff
└── docker-compose.yml     # Docker services configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

...

## 🆘 Support

For questions and support:
1. Open an issue in the repository
