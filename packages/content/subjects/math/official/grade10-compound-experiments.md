---
id: grade10-compound-experiments
name: Compound Random Experiments
description: Tree diagrams, path rules, urn models for compound probability
grade: 10
focus: Multi-stage probability and tree diagrams
difficulty: medium
learning_objectives:
  - Structure compound random experiments with tree diagrams showing all possible outcomes
  - Apply the first path rule to calculate probabilities by multiplying along paths
  - Apply the second path rule to calculate probabilities by summing across paths
  - Model experiments using urn models with replacement and without replacement
  - Distinguish between independent and dependent events in compound experiments
  - Make path rules plausible through examples and verify calculations
problem_types:
  - Two-stage tree diagram
  - Three-stage tree diagram
  - With replacement calculation
  - Without replacement calculation
  - Independent events
  - Dependent events
  - Event combination
  - Urn model setup
  - Path probability verification
  - Real-world scenario modeling
difficulty_guidelines:
  easy:
    - Two-stage experiments with replacement where stages are independent
    - Simple urn models with equal probabilities at each stage
    - Calculate single path probabilities using multiplication
  medium:
    - Three-stage experiments or two-stage without replacement
    - Urn models where probabilities change between stages
    - Calculate event probabilities requiring addition of multiple paths
  hard:
    - Complex scenarios combining multiple events with union or intersection
    - Four or more stages with changing probabilities
    - Design tree diagrams for scenarios requiring careful interpretation
prerequisites:
  - grade9-compound-probability
  - grade8-laplace-probability
real_world_context:
  - Drawing cards from a deck multiple times to analyze winning chances in card games
  - Quality control testing where defective items affect subsequent selection probabilities
  - Sports tournament brackets where match outcomes determine future pairings
  - Genetic inheritance patterns showing probability of trait combinations across generations
  - Weather forecasting where tomorrow's weather depends on today's conditions
  - Password security analyzing probability of guessing multi-character passwords
  - Drug testing protocols with sequential screening stages
  - Lottery games with multiple drawing rounds for different prize levels
  - Airline overbooking models predicting sequential no-show probabilities
  - Manufacturing assembly lines with multiple quality check stations
  - Medical diagnosis using sequential testing with conditional probabilities
  - Gaming tournaments with bracket elimination and seeding effects
anti_patterns:
  - Avoid tree diagrams with more than 4 stages unless explicitly requested
  - Do not use unfamiliar urn colors or abstract symbols without context
  - Avoid scenarios where independence assumption is ambiguous or unclear
  - Do not mix fractions and decimals in the same probability tree
  - Avoid problems requiring conditional probability formula (grade 11 topic)
version: 2
version_notes: Expanded real_world_context from 5 to 12 items for better variety
---
