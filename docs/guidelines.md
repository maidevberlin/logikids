# Project Guidelines

## Core Principles
1. Privacy First
   - Minimal data collection
   - No third-party tracking
   - Protection of minors' data
   - Secure by design

2. Code Quality
   - Mandatory code reviews
   - Clean code principles
   - Type safety
   - Comprehensive testing

## Development Process
1. Branch Strategy
   - Feature branches for all changes
   - Development branch as integration point
   - Release branches for staged releases
   - Protected main branch for production

2. Code Review Requirements
   - Two-stage review process:
     * First review for dev branch PRs
     * Intensive review for main branch PRs
   - Security review focus
   - Performance impact consideration
   - Privacy compliance check

3. Testing Requirements
   - Unit tests for core functionality
   - Integration tests for AI interactions

4. Quality Gates
   - Linting compliance
   - Type checking
   - Test coverage
   - Security scanning

5. Test Coverage Requirements
   - 100% test coverage required for:
     * Core business logic
     * Data management
     * Security-related code
     * API endpoints
   - Exemptions allowed for:
     * UI components (visual aspects)
     * Third-party integrations
     * Development utilities
