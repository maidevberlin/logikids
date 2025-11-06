---
id: derivatives
name: Derivatives and Differentiation
description: Understanding rates of change and calculating derivatives using various rules
grade: 11
ages:
  - 16
  - 17
  - 18
focus: Derivative definition as limit of difference quotient, differentiation rules, product rule, quotient rule, chain rule, derivatives of elementary functions, higher-order derivatives
difficulty: hard
learning_objectives:
  - Understand derivatives as instantaneous rates of change
  - Apply power rule, product rule, quotient rule, and chain rule
  - Calculate derivatives of elementary functions
  - Interpret geometric and physical meaning of derivatives
  - Use derivatives to analyze function behavior
prerequisites:
  - limits-continuity
  - functions-introduction
  - polynomial-functions
example_tasks:
  - Calculate the derivative of f(x) = 3x⁴ - 2x² + 5x - 1
  - Find f'(x) for f(x) = (2x + 1)(x² - 3) using the product rule
  - Determine the derivative of f(x) = (3x² + 2)⁵ using the chain rule
real_world_context: Velocity and acceleration, marginal cost and revenue, rate of change in science, optimization
---

# Derivatives and Differentiation Tasks

Create calculus problems that explore differentiation as the calculation of instantaneous rates of change. Problems should help students master differentiation rules, understand the geometric meaning of derivatives (tangent line slope), and apply derivatives to physical and economic contexts.

**Vary the problem structure:**
- **Definition of derivative**: Calculate $f'(a)$ using the limit definition $\lim_{h \to 0} \frac{f(a+h) - f(a)}{h}$ for simple functions
- **Power rule**: Differentiate polynomials using $(x^n)' = nx^{n-1}$, such as $f(x) = 5x^4 - 3x^2 + 7x - 2$
- **Sum and constant multiple rules**: Apply $(af + bg)' = af' + bg'$ to combinations of functions
- **Product rule**: Calculate derivatives of products using $(uv)' = u'v + uv'$, such as $(x^2 \cdot \sin(x))'$
- **Quotient rule**: Find derivatives of quotients using $\left(\frac{u}{v}\right)' = \frac{u'v - uv'}{v^2}$, such as $\frac{x^2 + 1}{2x - 3}$
- **Chain rule**: Differentiate composite functions using $(f \circ g)' = f'(g(x)) \cdot g'(x)$, such as $(3x^2 + 1)^5$ or $\sin(2x^2)$
- **Exponential functions**: Calculate derivatives using $(e^x)' = e^x$ and $(a^x)' = a^x \ln(a)$
- **Logarithmic functions**: Apply $(\ln(x))' = \frac{1}{x}$ and $(\log_a(x))' = \frac{1}{x \ln(a)}$
- **Trigonometric functions**: Use $(\sin(x))' = \cos(x)$, $(\cos(x))' = -\sin(x)$, $(\tan(x))' = \frac{1}{\cos^2(x)}$
- **Higher-order derivatives**: Calculate $f''(x)$, $f'''(x)$, or $f^{(n)}(x)$ by repeated differentiation
- **Tangent line equations**: Find the equation of the tangent line to $f(x)$ at $x = a$ using point-slope form
- **Rate of change problems**: Given a position function $s(t)$, find velocity $v(t) = s'(t)$ and acceleration $a(t) = s''(t)$

**Vary the content/context:**
- **Polynomial functions**: Powers, sums, and combinations of powers
- **Rational functions**: Quotients of polynomials requiring quotient rule
- **Exponential functions**: $e^x$, $e^{kx}$, exponential growth models
- **Logarithmic functions**: $\ln(x)$, $\ln(f(x))$ requiring chain rule
- **Trigonometric functions**: Sine, cosine, tangent and their compositions
- **Composite functions**: Nested functions requiring multiple chain rule applications
- **Physics contexts**: Position → velocity → acceleration, temperature change rates, radioactive decay rates
- **Economics contexts**: Cost function → marginal cost, revenue function → marginal revenue, profit maximization

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 17): Focus on power rule with polynomials, simple product rule with linear factors, basic exponential and trigonometric derivatives, tangent line problems
- **For middle ages** ({{age}} 17-18): Quotient rule, chain rule with polynomial compositions, combinations of rules, second derivatives, interpreting $f'(x)$ and $f''(x)$ graphically
- **For older ages** ({{age}} >= 18): Complex compositions requiring multiple chain rule applications, implicit differentiation, logarithmic differentiation, higher-order derivatives, rate of change applications

**Use appropriate formats:**

**LaTeX for formulas:**
- Derivative notation: $f'(x)$, $\frac{df}{dx}$, $\frac{d}{dx}[f(x)]$
- Differentiation rules in block form:

**Power Rule:**
$$\frac{d}{dx}[x^n] = nx^{n-1}$$

**Product Rule:**
$$(uv)' = u'v + uv'$$

**Quotient Rule:**
$$\left(\frac{u}{v}\right)' = \frac{u'v - uv'}{v^2}$$

**Chain Rule:**
$$(f \circ g)'(x) = f'(g(x)) \cdot g'(x)$$

**Derivatives of standard functions:**
$$(\sin(x))' = \cos(x), \quad (\cos(x))' = -\sin(x), \quad (e^x)' = e^x, \quad (\ln(x))' = \frac{1}{x}$$

**Tables for derivative values:**

| $x$ | $f(x)$ | $f'(x)$ |
|-----|--------|---------|
| 0   | 1      | 0       |
| 1   | 2      | 4       |
| 2   | 9      | 12      |

**SVG diagrams for tangent lines:**

Use SVG to show:
- Function curve with tangent line at a point
- Secant lines approaching tangent line (illustrating derivative definition)
- Sign of $f'(x)$: positive slope (increasing), negative slope (decreasing)
- Connection between $f(x)$ graph and $f'(x)$ graph
- Velocity and acceleration vectors on position-time graphs

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Power rule with polynomials, simple sum and constant multiple rules, basic exponential and trigonometric derivatives ($e^x$, $\sin(x)$, $\cos(x)$), direct application of single rules
- **Medium**: Product rule, quotient rule, simple chain rule (polynomial inside), combinations of two rules, finding tangent line equations, second derivatives
- **Hard**: Complex chain rule applications (multiple nestings), combinations of product/quotient/chain rules, implicit differentiation, logarithmic differentiation, higher-order derivatives, rate of change word problems

**Include variety in numerical values:**
- Different polynomial degrees: quadratic, cubic, quartic functions
- Various coefficients: 2, 5, -3, 0.5, fractions like 1/2
- Different exponents: positive integers, negative integers, fractional exponents
- Varied composition depths: $(f \circ g)$, $(f \circ g \circ h)$
- Multiple derivative evaluation points: $x = 0$, $x = 1$, $x = -2$, $x = 3$
- Different physical units: meters/second, dollars/item, degrees/hour
- Ensure each problem generates unique derivative expressions
