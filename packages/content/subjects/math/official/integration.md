---
id: integration
name: Antiderivatives and Integration
description: Understanding integration as the reverse of differentiation and calculating definite and indefinite integrals
grade: 12
ages:
  - 17
  - 18
  - 19
focus: Indefinite integrals, definite integrals and Riemann sums, Fundamental Theorem of Calculus, integration rules, substitution method, integration by parts
difficulty: hard
learning_objectives:
  - Find antiderivatives of elementary functions
  - Apply integration rules and techniques
  - Evaluate definite integrals
  - Understand the Fundamental Theorem of Calculus
  - Use substitution and integration by parts
prerequisites:
  - derivatives
  - limits-continuity
  - polynomial-functions
example_tasks:
  - Calculate the indefinite integral ∫(3x² - 2x + 5) dx
  - Evaluate the definite integral ∫₀³ (x² + 1) dx
  - Use substitution to find ∫ 2x(x² + 1)⁵ dx
real_world_context: Area calculations, distance from velocity, accumulated change, consumer surplus
---

# Antiderivatives and Integration Tasks

Create calculus problems that explore integration as the reverse process of differentiation and as a tool for calculating accumulated change. Problems should help students master integration techniques, understand the Fundamental Theorem of Calculus, and apply integration to area and accumulation problems.

**Vary the problem structure:**
- **Basic antiderivatives**: Find $\int x^n \, dx = \frac{x^{n+1}}{n+1} + C$ for polynomials like $\int (4x^3 - 2x + 1) \, dx$
- **Power rule for integration**: Apply reverse power rule to functions with various exponents
- **Constant multiple and sum rules**: Calculate $\int (af(x) + bg(x)) \, dx = a\int f(x)\,dx + b\int g(x)\,dx$
- **Exponential functions**: Integrate $\int e^x \, dx = e^x + C$ and $\int a^x \, dx = \frac{a^x}{\ln(a)} + C$
- **Trigonometric functions**: Use $\int \sin(x)\,dx = -\cos(x) + C$, $\int \cos(x)\,dx = \sin(x) + C$
- **Definite integrals**: Evaluate $\int_a^b f(x)\,dx$ using Fundamental Theorem: $F(b) - F(a)$ where $F$ is antiderivative
- **Riemann sums**: Approximate integrals using left, right, or midpoint Riemann sums with given number of rectangles
- **Substitution method**: Use $u$-substitution for integrals like $\int 2x(x^2+1)^5\,dx$ by setting $u = x^2 + 1$
- **Integration by parts**: Apply $\int u\,dv = uv - \int v\,du$ for products like $\int x e^x\,dx$ or $\int x \cos(x)\,dx$
- **Properties of definite integrals**: Use additivity $\int_a^b + \int_b^c = \int_a^c$, sign reversal $\int_a^b = -\int_b^a$
- **Fundamental Theorem verification**: Given $F'(x) = f(x)$, verify $\int_a^b f(x)\,dx = F(b) - F(a)$

**Vary the content/context:**
- **Polynomial functions**: Powers of $x$, sums of terms with various coefficients
- **Rational functions**: Simple fractions like $\frac{1}{x}$, $\frac{1}{x^2}$, partial fraction forms
- **Exponential functions**: $e^x$, $e^{kx}$ requiring substitution
- **Trigonometric functions**: $\sin(x)$, $\cos(x)$, $\sin(kx)$ requiring substitution
- **Composite functions**: Functions requiring chain rule in reverse (substitution)
- **Products of functions**: Requiring integration by parts
- **Physics contexts**: Velocity function → displacement, acceleration → velocity, force over distance → work
- **Economics contexts**: Marginal cost → total cost, marginal revenue → total revenue

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 18): Basic power rule integrals with polynomials, simple definite integrals with integer limits, basic exponential and trigonometric integrals, understanding antiderivative concept
- **For middle ages** ({{age}} 18): Substitution method with clear $u$ choices, definite integrals requiring antiderivative evaluation, properties of integrals, Riemann sum approximations
- **For older ages** ({{age}} >= 19): Complex substitutions, integration by parts with multiple applications, combining techniques, improper integrals (limits at infinity), applications to area and accumulation

**Use appropriate formats:**

**LaTeX for formulas:**
- Indefinite integral notation: $\int f(x)\,dx$
- Definite integral notation: $\int_a^b f(x)\,dx$
- Integration rules in block form:

**Power Rule:**
$$\int x^n\,dx = \frac{x^{n+1}}{n+1} + C, \quad n \neq -1$$

**Fundamental Theorem of Calculus:**
$$\int_a^b f(x)\,dx = F(b) - F(a) \quad \text{where } F'(x) = f(x)$$

**Standard integrals:**
$$\int e^x\,dx = e^x + C, \quad \int \frac{1}{x}\,dx = \ln|x| + C$$
$$\int \sin(x)\,dx = -\cos(x) + C, \quad \int \cos(x)\,dx = \sin(x) + C$$

**Substitution method:**
For $\int f(g(x))g'(x)\,dx$, let $u = g(x)$, then $du = g'(x)dx$:
$$\int f(g(x))g'(x)\,dx = \int f(u)\,du$$

**Integration by parts:**
$$\int u\,dv = uv - \int v\,du$$

**Tables for Riemann sum approximations:**

| $i$ | $x_i$ | $f(x_i)$ | $\Delta x \cdot f(x_i)$ |
|-----|-------|----------|-------------------------|
| 1   | 0     | 1        | 0.5                     |
| 2   | 0.5   | 1.25     | 0.625                   |

**SVG diagrams for integral visualization:**

Use SVG to show:
- Area under curve representing definite integral
- Riemann sum rectangles (left, right, midpoint) approximating area
- Multiple regions with different signs (above/below x-axis)
- Shaded area between $x = a$ and $x = b$ under $f(x)$
- Visualization of Fundamental Theorem: accumulated area from $a$ to $b$

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Power rule with polynomials, simple definite integrals with small integer limits, basic $\int e^x\,dx$ and $\int \sin(x)\,dx$, constant coefficients
- **Medium**: Substitution method with polynomial inner functions, definite integrals requiring careful antiderivative evaluation, Riemann sum calculations, properties of integrals
- **Hard**: Complex substitutions requiring algebraic manipulation, integration by parts with multiple steps, combining techniques in one problem, improper integrals, theoretical problems involving Fundamental Theorem

**Include variety in numerical values:**
- Different polynomial degrees and coefficients
- Various definite integral limits: [0, 1], [1, 3], [-2, 2], [0, π]
- Multiple substitution possibilities: $u = x^2 + 1$, $u = 3x - 2$, $u = \sin(x)$
- Different numbers of rectangles in Riemann sums: 4, 6, 8 rectangles
- Varied integration by parts choices
- Different constant terms and coefficients
- Ensure each problem has unique antiderivative or definite integral value
