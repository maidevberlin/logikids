---
id: differential-equations-intro
name: Introduction to Differential Equations
description: First-order differential equations, separation of variables, and basic applications
grade: 12
ages:
  - 17
  - 18
difficulty: hard
focus: Solving basic differential equations and understanding their applications in modeling change
learning_objectives:
  - Recognize and classify differential equations
  - Solve first-order differential equations using separation of variables
  - Verify solutions to differential equations
  - Set up differential equations from word problems
  - Apply initial conditions to find particular solutions
  - Understand exponential growth and decay models
---

# Introduction to Differential Equations

When introducing differential equations, emphasize that they describe relationships between functions and their derivatives. Focus on understanding what a solution means (a function that satisfies the equation) and developing intuition about how differential equations model dynamic systems.

## Key Concepts to Cover

### Basic Terminology
- **Differential equation**: An equation involving derivatives of an unknown function
- **Order**: The highest derivative present (focus on first-order: $\frac{dy}{dx} = f(x, y)$)
- **Solution**: A function $y(x)$ that satisfies the equation
- **General solution**: Contains arbitrary constants
- **Particular solution**: Satisfies given initial conditions

### Solution Methods

#### Separation of Variables
For equations of the form $\frac{dy}{dx} = g(x)h(y)$:

1. Rewrite as $\frac{1}{h(y)} dy = g(x) dx$
2. Integrate both sides: $\int \frac{1}{h(y)} dy = \int g(x) dx$
3. Solve for $y$ if possible

#### Direct Integration
For $\frac{dy}{dx} = f(x)$, simply integrate: $y = \int f(x) dx + C$

### Initial Value Problems (IVP)
- Given $\frac{dy}{dx} = f(x, y)$ with $y(x_0) = y_0$
- Find general solution, then use initial condition to find $C$

### Standard Models
- **Exponential growth/decay**: $\frac{dy}{dt} = ky$ gives $y = y_0 e^{kt}$
- **Newton's law of cooling**: $\frac{dT}{dt} = -k(T - T_{\text{env}})$
- **Logistic growth**: $\frac{dP}{dt} = kP(1 - \frac{P}{M})$ (introductory level only)

## Task Generation Guidelines

Create tasks that:

1. **Verification**: Give a differential equation and a function, ask if it's a solution
2. **Direct Integration**: Solve $\frac{dy}{dx} = f(x)$ with or without initial conditions
3. **Separation of Variables**: Solve separable equations like $\frac{dy}{dx} = xy$, $\frac{dy}{dx} = \frac{x}{y}$
4. **Initial Value Problems**: Find particular solutions satisfying given conditions
5. **Modeling**: Set up differential equations from word problems
6. **Applied Problems**: Solve growth/decay, cooling, or mixing problems

## Notation Standards

- Use Leibniz notation: $\frac{dy}{dx}$, $\frac{dy}{dt}$ (prefer over prime notation)
- Clearly indicate independent and dependent variables
- Use subscript 0 for initial values: $y_0 = y(0)$, $y(t_0) = y_0$
- Show integration clearly: $\int \ldots dy = \int \ldots dx$
- Include constant of integration: $+ C$

## Difficulty Scaling

- **Medium-Hard**: Direct integration, simple separable equations
- **Hard**: More complex separable equations, IVPs, exponential models
- **Very Hard**: Implicit solutions, complex algebraic manipulation, multi-step word problems

## Real-World Contexts

- Population biology (growth and decay models)
- Physics (motion with resistance, Newton's law of cooling)
- Chemistry (reaction rates, radioactive decay)
- Economics (compound interest, supply-demand equilibrium)
- Medicine (drug concentration in bloodstream)
- Environmental science (pollution levels, resource depletion)

## Common Misconceptions

- Forgetting the constant of integration
- Incorrectly separating variables (dividing by zero when $h(y) = 0$)
- Confusing $\frac{dy}{dx}$ with $\frac{dx}{dy}$
- Misapplying logarithm rules when solving
- Forgetting absolute value: $\int \frac{1}{y} dy = \ln|y| + C$
- Not checking if a solution is valid in the given domain

## Problem Structure

For word problems, guide students through:
1. Define variables and their units
2. Set up the differential equation from the given rate
3. Solve using appropriate method
4. Apply initial/boundary conditions
5. Interpret the solution in context
6. Answer the specific question asked
