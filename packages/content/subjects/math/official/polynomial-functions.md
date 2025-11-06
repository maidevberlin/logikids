---
id: polynomial-functions
name: Polynomial Functions
description: Working with higher-degree polynomial functions including behavior analysis
grade: 10
ages:
  - 15
  - 17
focus: Polynomial degree and leading coefficient, zeros and factorization, polynomial division, end behavior, multiplicity of zeros, graphing polynomial functions
difficulty: hard
learning_objectives:
  - Understand polynomial functions of degree n
  - Analyze end behavior based on degree and leading coefficient
  - Find zeros using factoring and polynomial division
  - Determine multiplicity of zeros
  - Sketch graphs of polynomial functions
prerequisites:
  - quadratic-functions
  - factoring
example_tasks:
  - Find all zeros of f(x) = x³ - 6x² + 11x - 6
  - Determine the end behavior of f(x) = -2x⁴ + 5x² - 3
  - "Perform polynomial division: (x³ + 3x² - 4) ÷ (x - 1)"
real_world_context: Volume optimization, engineering curve design, economic modeling, physics applications
---

# Polynomial Functions Tasks

Create mathematics problems that explore polynomial functions of degree 3 and higher. Problems should help students analyze polynomial behavior, find zeros systematically, understand multiplicity, interpret end behavior, and sketch polynomial graphs.

**Vary the problem structure:**
- **Identifying polynomial degree and leading term**: Given $f(x) = 3x^5 - 2x^3 + x - 7$, identify degree 5 and leading coefficient 3
- **End behavior analysis**: Determine behavior as $x \to \pm\infty$ based on degree (even/odd) and leading coefficient (positive/negative)
- **Finding zeros by factoring**: Factor polynomials like $f(x) = x^3 - 3x^2 - 4x + 12 = (x-2)(x+2)(x-3)$ to find zeros
- **Polynomial long division**: Divide polynomial by linear or quadratic factor to find quotient and remainder
- **Synthetic division**: Use synthetic division as shortcut for dividing by $(x - a)$
- **Factor theorem application**: Use the fact that $(x - a)$ is a factor if and only if $f(a) = 0$ to find factors
- **Multiplicity of zeros**: Determine whether zeros have multiplicity 1 (crosses x-axis), 2 (touches), or higher (flatter)
- **Graphing from factored form**: Sketch polynomial given in factored form like $f(x) = (x+2)(x-1)^2(x-3)$
- **Local extrema**: Identify turning points and understand that degree $n$ polynomial has at most $n-1$ turning points
- **Comparing polynomial and lower-degree functions**: Understand why polynomial eventually dominates other terms

**Vary the content/context:**
- **Volume problems**: Boxes with variable dimensions where volume is cubic function
- **Revenue and cost**: Profit functions that are cubic (revenue cubic, costs quadratic or linear)
- **Motion problems**: Position functions with higher-degree polynomials
- **Engineering curves**: Bridge designs, roller coaster paths modeled by polynomials
- **Physics**: Potential energy functions, deflection of beams
- **Pure mathematics**: Analyzing function behavior, finding intersection points

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 16): Cubic functions with integer zeros, factored form given, basic end behavior (odd degree: opposite directions, even degree: same direction)
- **For middle ages** ({{age}} 16-17): Polynomial division, finding zeros with rational root theorem, multiplicity up to 2, graphing from analysis
- **For older ages** ({{age}} >= 17): Higher degree polynomials (degree 4-5), complex factorizations, multiplicity 3+, complete function analysis including all turning points

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline: $f(x) = a_nx^n + a_{n-1}x^{n-1} + \cdots + a_1x + a_0$, degree $n$
- Block for polynomial division and factorization:

$$f(x) = x^3 - 2x^2 - 5x + 6$$

$$f(x) = (x - 1)(x + 2)(x - 3)$$

$$\text{Zeros: } x_1 = 1, x_2 = -2, x_3 = 3$$

**Tables for polynomial values:**

| x   | f(x)  |
|-----|-------|
| -2  | 0     |
| -1  | 8     |
| 0   | 6     |
| 1   | 0     |
| 2   | -4    |
| 3   | 0     |

**SVG diagrams for polynomial function graphs:**

Use SVG to show:
- Coordinate systems with polynomial curves showing characteristic shape
- Zeros marked where function crosses or touches x-axis
- End behavior arrows showing $x \to \pm\infty$ behavior
- Turning points (local maxima and minima) marked
- Different behavior at zeros of different multiplicities
- Comparison of polynomials with different degrees

Example SVG for cubic function:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Coordinate system -->
  <line x1="50" y1="150" x2="350" y2="150" stroke="black" stroke-width="2"/>
  <line x1="200" y1="250" x2="200" y2="50" stroke="black" stroke-width="2"/>
  <!-- Cubic curve -->
  <path d="M 60 80 Q 100 50 140 100 T 200 150 Q 240 170 280 140 Q 320 110 340 220"
        fill="none" stroke="#3b82f6" stroke-width="3"/>
  <!-- Zeros marked -->
  <circle cx="80" cy="150" r="4" fill="#ef4444"/>
  <circle cx="200" cy="150" r="4" fill="#ef4444"/>
  <circle cx="300" cy="150" r="4" fill="#ef4444"/>
  <!-- End behavior arrows -->
  <path d="M 55 85 L 50 80 L 60 78" stroke="#10b981" stroke-width="2" fill="none"/>
  <path d="M 345 215 L 350 220 L 340 222" stroke="#10b981" stroke-width="2" fill="none"/>
  <!-- Labels -->
  <text x="180" y="280" font-size="14">x</text>
  <text x="210" y="70" font-size="14">y</text>
</svg>
```

Example SVG showing multiplicity:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Coordinate system -->
  <line x1="50" y1="150" x2="350" y2="150" stroke="black" stroke-width="2"/>
  <line x1="200" y1="250" x2="200" y2="50" stroke="black" stroke-width="2"/>
  <!-- Quartic with double root -->
  <path d="M 60 220 Q 120 50 200 150 Q 280 50 340 220"
        fill="none" stroke="#3b82f6" stroke-width="3"/>
  <!-- Zero with multiplicity 2 (touches) -->
  <circle cx="200" cy="150" r="4" fill="#f59e0b"/>
  <text x="205" y="145" font-size="12" fill="#f59e0b">mult=2</text>
  <!-- Labels -->
  <text x="180" y="280" font-size="14">x</text>
  <text x="210" y="70" font-size="14">y</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Cubic functions in factored form with integer zeros, direct reading of zeros, basic end behavior determination
- **Medium**: Factoring cubic polynomials, polynomial division by linear factors, multiplicity 1 and 2, sketching from analysis
- **Hard**: Higher degree (4-5), polynomial division by quadratic, finding all zeros including using rational root theorem, complex analysis with all features

**Include variety in numerical values:**
- Different degrees: 3 (cubic), 4 (quartic), 5 (quintic)
- Various leading coefficients: $a = 1, 2, -1, -2, 3$
- Different zero sets: $\{-2, 1, 3\}$, $\{-1, 0, 2, 4\}$, $\{-3, 1, 1, 5\}$ (with multiplicity)
- Multiplicities: 1 (crosses), 2 (touches), 3 (flatter touch)
- Y-intercepts: vary constant term from -10 to 10
- Ensure different numerical answers each time to prevent memorization
