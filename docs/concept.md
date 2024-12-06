# Project Concept Document

## 1. Project Overview
An educational web application designed to help children aged 8-16 develop mathematical and logical thinking skills. The application provides interactive tasks, intelligent hints, and personalized feedback to support the learning process.

### 1.1 Core Features
- Interactive math and logic tasks
- AI-powered hint system
- Progress tracking

### 1.2 Task Generation System
- Fully AI-powered task generation using Ollama
- Interactive problem-solving with hints
- Two main subject areas:
  1. Mathematics
     - Focus on arithmetic and algebra
  2. Logic
     - Pattern recognition
     - Logical reasoning
     - Text-based tasks

### 1.3 AI-Powered Hints
- Real-time hint generation using ollama and the task context
- Task breakdown for complex problems

### 1.7 Session Management
- Generated memorable identifiers (e.g., "CuriousPenguin", "BrightStar")
- Device fingerprinting as secondary verification
- No personal information required
- Optional account creation
- Server-side storage linked to device ID
- Automatic session continuation for returning users
- Server-side state management

### 1.8 Privacy and Data Protection
- Privacy-First Approach:
  - Minimal data collection principle
  - No third-party services or tracking
  - Anonymous data storage

## 2. Technical Architecture
### 2.1 Technology Stack
- Frontend: React with TypeScript
- Backend: TypeScript API server
- AI Integration: Ollama for task generation and hints
- Build Tool: Vite
- Containerization: Docker
- Database: MongoDB
- Error Tracking: Sentry

### 2.2 System Architecture
- Frontend Layer: Typescript React
- Backend Layer: TypeScript API Server
- AI Layer: Ollama Integration
- Data Layer: 
  - MongoDB for user progress and analytics

### 2.3 Ollama Integration
- Deployment Strategy:
  - Primary: Containerized service in Docker setup
  - Alternative: Host machine installation (if container performance insufficient)
  - Single Ollama instance serving all users

## 3. Development Environment
### 3.1 Local Setup
- Fully containerized development environment using Docker
- No local dependencies required except Docker and Ollama
- Frontend development server with hot reload
- Backend development server with auto-restart

### 3.2 Development Workflow
- Branch Strategy:
  - Feature branches for development
  - Development branch as integration target
  - Release branches for staged releases
  - Protected main branch
  
- Continuous Integration:
  1. Feature Branch Pipeline:
     - Linting and formatting
     - Type checking
     - Unit tests
     - Automated code quality tools
     - Integration tests
     - Development deployment
  
  2. Release Branch Pipeline:
     - Full test suite
     - Performance testing
     - Security scanning
     - Staging deployment
  
  3. Main Branch Pipeline:
     - Production deployment checks
     - Database migration validation
     - Backup verification
     - Production deployment

### 3.3 Configuration Management
- Environment-specific Configuration Files:
  - Development (dev.config.ts)
  - Staging (staging.config.ts)
  - Production (prod.config.ts)
  - No runtime environment variable overrides

- Runtime Behavior:
  - Hot reload support for configuration changes
  - No service restart required

## 4. Application Structure
### 4.1 Frontend Structure
- User Interface Components
- State Management
- Progress Tracking
- Session State Management

### 4.2 Backend Structure
- API Endpoints
- Ollama Integration Service
- Hint Generation Service
- Task Generation Service

## 7. Performance Considerations
- Response Time Targets:
  - API Endpoints: < 200ms
  - Task Generation: < 20s
  - UI Interactions:
    * Standard interactions: < 100ms
    * AI-related interactions (hints/chat): < 2s
  - WebSocket Updates: Real-time

## 8. Deployment Strategy
- Repository Management:
  - Private Bitbucket repositories
  - Private Docker Hub container registry

- Build Pipeline:
  - Bitbucket Pipelines for CI/CD
  - Automated container builds
  - Multi-stage build process
  - Security scanning integration via Docker Hub

- Deployment Process:
  - Bitbucket Pipelines
  - Docker Hub