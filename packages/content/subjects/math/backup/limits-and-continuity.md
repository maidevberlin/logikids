---
id: limits-continuity
name: Limits and Continuity
description: Understanding limits of functions and continuity as foundations of calculus
grade: 11
ages:
  - 16
  - 18
focus: Limit definition and notation, left-hand and right-hand limits, limits at infinity, continuity definition, types of discontinuities, L'Hôpital's rule
difficulty: hard
learning_objectives:
  - Understand the concept of limits intuitively and formally
  - Calculate limits of functions at finite and infinite values
  - Determine continuity of functions
  - Identify types of discontinuities
  - Apply limit laws for calculations
prerequisites:
  - functions-introduction
  - polynomial-functions
  - rational-functions
example_tasks:
  - Calculate the limit of (x² - 4)/(x - 2) as x approaches 2
  - Determine whether the function f(x) = |x|/x is continuous at x = 0
  - Find the limit of (1/x) as x approaches infinity
real_world_context: Instantaneous velocity, asymptotic behavior in models, continuity in physical processes
---

# Limits and Continuity Tasks

Create calculus problems that explore the foundational concepts of limits and continuity. Problems should help students understand limits intuitively, calculate limits using algebraic techniques, and analyze function continuity. These concepts form the basis for derivatives and integrals.

**Vary the problem structure:**
- **Direct substitution limits**: Calculate $\lim_{x \to a} f(x)$ where direct substitution works, such as $\lim_{x \to 3} (2x^2 - 5x + 1)$
- **Indeterminate form 0/0**: Evaluate limits requiring factoring or simplification, such as $\lim_{x \to 2} \frac{x^2 - 4}{x - 2}$ or $\lim_{x \to -3} \frac{x^2 + 5x + 6}{x + 3}$
- **Left-hand and right-hand limits**: Calculate $\lim_{x \to a^-} f(x)$ and $\lim_{x \to a^+} f(x)$ for piecewise functions, determine if limit exists
- **Limits at infinity**: Evaluate $\lim_{x \to \infty} f(x)$ for rational functions like $\lim_{x \to \infty} \frac{3x^2 - 2x + 1}{x^2 + 4}$, determine horizontal asymptotes
- **Limits involving infinity**: Calculate $\lim_{x \to a} \frac{1}{(x-a)^n}$, determine vertical asymptotes
- **Continuity analysis**: Given a function, determine if it is continuous at a point using the three conditions: f(a) exists, limit exists, and they are equal
- **Types of discontinuities**: Identify removable, jump, and infinite discontinuities from function definitions or graphs
- **L'Hôpital's rule** (for older students): Apply L'Hôpital's rule to indeterminate forms 0/0 or ∞/∞ by taking derivatives of numerator and denominator

**Vary the content/context:**
- **Polynomial functions**: Limits of polynomials (always exist for finite values)
- **Rational functions**: Limits requiring factoring, simplification, or analyzing degrees
- **Piecewise functions**: Functions defined differently on different intervals, testing continuity at boundaries
- **Absolute value functions**: Analyzing limits like $\lim_{x \to 0} \frac{|x|}{x}$
- **Exponential and logarithmic functions**: Limits involving $e^x$, $\ln(x)$, especially as x approaches 0 or infinity
- **Trigonometric functions**: Special limits like $\lim_{x \to 0} \frac{\sin(x)}{x} = 1$
- **Real-world scenarios**: Instantaneous rate of change (velocity), marginal cost approaching a production level, asymptotic behavior in population models

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 17): Focus on intuitive understanding of limits, direct substitution, simple factoring for 0/0 forms, basic continuity checks with clear examples
- **For middle ages** ({{age}} 17-18): One-sided limits, piecewise function continuity, rational function limits at infinity, identifying all types of discontinuities, limit laws
- **For older ages** ({{age}} >= 18): Complex indeterminate forms, L'Hôpital's rule applications, epsilon-delta definition awareness, composite function limits, proofs of limit laws

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline limit notation: $\lim_{x \to a} f(x)$, $\lim_{x \to \infty} f(x)$
- Block equations for limit calculations:

$$\lim_{x \to 2} \frac{x^2 - 4}{x - 2} = \lim_{x \to 2} \frac{(x-2)(x+2)}{x-2} = \lim_{x \to 2} (x+2) = 4$$

**One-sided limits:**

$$\lim_{x \to a^-} f(x) \quad \text{and} \quad \lim_{x \to a^+} f(x)$$

**Continuity definition:**
A function $f$ is continuous at $x = a$ if:
1. $f(a)$ exists
2. $\lim_{x \to a} f(x)$ exists
3. $\lim_{x \to a} f(x) = f(a)$

**Tables for piecewise function values:**

| $x$ | $f(x)$ |
|-----|--------|
| -1  | 3      |
| 0   | 5      |
| 1   | 2      |

**SVG diagrams for function graphs:**

Use SVG to show:
- Function graphs with discontinuities marked
- Approach behavior as x approaches a value (arrows showing left/right approach)
- Removable discontinuities (holes in graphs)
- Jump discontinuities (function "jumps" at a point)
- Infinite discontinuities (vertical asymptotes)
- Horizontal asymptotes for limits at infinity

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Direct substitution limits, continuous polynomial and exponential functions, simple one-sided limits with clear answers
- **Medium**: Factoring to resolve 0/0 indeterminate forms, continuity analysis of piecewise functions, limits at infinity of rational functions, identifying discontinuity types
- **Hard**: Multiple indeterminate forms, L'Hôpital's rule applications, complex piecewise functions with multiple conditions, epsilon-delta definition problems, proving limit laws

**Include variety in numerical values:**
- Different limit points: $x \to 2$, $x \to -3$, $x \to 0$, $x \to 5$
- Various polynomial degrees: linear, quadratic, cubic functions
- Different rational function forms: proper and improper fractions
- Varied coefficients: avoid always using 1, 2, 3
- Multiple discontinuity locations in same function
- Ensure different functional forms generate unique problems
