---
id: rational-functions
name: Rational Functions
description: Analyzing rational functions including asymptotes, discontinuities, and behavior
grade: 10
ages:
  - 15
  - 16
  - 17
focus: Rational function definition, vertical and horizontal asymptotes, zeros and poles, removable discontinuities, end behavior, graphing rational functions
difficulty: hard
learning_objectives:
  - Understand rational functions as quotients of polynomials
  - Determine vertical and horizontal asymptotes
  - Find zeros, poles, and removable discontinuities
  - Analyze end behavior
  - Sketch graphs of rational functions
prerequisites:
  - polynomial-functions
  - factoring
example_tasks:
  - Find all asymptotes of f(x) = (2x + 3)/(x - 4)
  - Determine the zeros and poles of f(x) = (x² - 4)/(x² - 1)
  - Sketch the graph of f(x) = 1/(x + 2)
real_world_context: Average cost functions, concentration problems, lens equations in optics, electrical resistance
---

# Rational Functions Tasks

Create mathematics problems that explore rational functions and their unique properties. Problems should help students identify asymptotes, analyze discontinuities, understand end behavior, and sketch graphs showing all key features including asymptotes, zeros, and poles.

**Vary the problem structure:**
- **Identifying rational functions**: Recognize functions of form $f(x) = \frac{p(x)}{q(x)}$ where $p$ and $q$ are polynomials
- **Finding vertical asymptotes**: Determine values where denominator equals zero (poles) by solving $q(x) = 0$, check these are not also zeros of numerator
- **Finding horizontal asymptotes**: Compare degrees of numerator and denominator: if $\deg(p) < \deg(q)$ then $y = 0$; if $\deg(p) = \deg(q)$ then $y = \frac{a_n}{b_n}$; if $\deg(p) > \deg(q)$ then no horizontal asymptote
- **Finding zeros**: Solve $p(x) = 0$ for x-intercepts, verify denominator non-zero at these points
- **Removable discontinuities**: Factor to find common factors in numerator and denominator, these create "holes" not vertical asymptotes
- **Domain determination**: Find all x-values where function is defined (denominator not zero)
- **End behavior analysis**: Determine what happens as $x \to \pm\infty$ using horizontal asymptotes or oblique asymptotes
- **Graphing rational functions**: Sketch showing asymptotes, zeros, behavior near asymptotes, and overall shape
- **Simplifying rational functions**: Factor and cancel common terms, identify resulting holes
- **Oblique asymptotes**: For $\deg(p) = \deg(q) + 1$, perform polynomial division to find oblique asymptote

**Vary the content/context:**
- **Average cost functions**: Total cost divided by quantity, $C(x) = \frac{ax + b}{x}$ showing average cost decreases as production increases
- **Concentration problems**: Mixing solutions, dilution, $C(t) = \frac{A}{V + rt}$ where concentration decreases as volume increases
- **Optics**: Lens equations, focal length relationships, $\frac{1}{f} = \frac{1}{d_o} + \frac{1}{d_i}$
- **Electrical circuits**: Resistance combinations, current-voltage relationships
- **Work rate problems**: Combined rates, time to complete tasks with varying workers
- **Environmental science**: Pollution concentration over time with decay and dilution

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 16): Simple rational functions like $f(x) = \frac{a}{x - h} + k$, one vertical asymptote, horizontal asymptote at $y = 0$ or constant, no removable discontinuities
- **For middle ages** ({{age}} 16-17): Quadratic numerator or denominator, multiple vertical asymptotes, identifying horizontal asymptotes by degree comparison, simple removable discontinuities
- **For older ages** ({{age}} >= 17): Complex rational functions with multiple features, oblique asymptotes, multiple removable discontinuities, complete analysis and accurate graphing

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline: $f(x) = \frac{p(x)}{q(x)}$, $f(x) = \frac{ax + b}{cx + d}$
- Block for rational function forms:

$$f(x) = \frac{2x + 3}{x - 4}$$

$$\text{Vertical asymptote: } x = 4$$

$$\text{Horizontal asymptote: } y = 2$$

**Tables for rational function behavior:**

| x    | f(x)   | Note            |
|------|--------|-----------------|
| -10  | 0.21   | approaching y=2 |
| 0    | -0.75  |                 |
| 3    | -9     | near asymptote  |
| 5    | 13     | after asymptote |
| 10   | 3.83   | approaching y=2 |

**SVG diagrams for rational function graphs:**

Use SVG to show:
- Coordinate systems with rational function curves
- Vertical asymptotes as dashed vertical lines
- Horizontal asymptotes as dashed horizontal lines
- Function approaching but never touching asymptotes
- Zeros marked on x-axis
- Removable discontinuities shown as open circles (holes)
- Different behavior on each side of vertical asymptotes

Example SVG for simple rational function with asymptotes:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Coordinate system -->
  <line x1="50" y1="150" x2="350" y2="150" stroke="black" stroke-width="2"/>
  <line x1="200" y1="250" x2="200" y2="50" stroke="black" stroke-width="2"/>
  <!-- Vertical asymptote at x = 3 -->
  <line x1="260" y1="250" x2="260" y2="50" stroke="#ef4444" stroke-width="2" stroke-dasharray="5,5"/>
  <!-- Horizontal asymptote at y = 0 -->
  <line x1="50" y1="150" x2="350" y2="150" stroke="#f59e0b" stroke-width="1" stroke-dasharray="5,5"/>
  <!-- Function branches -->
  <path d="M 60 240 Q 150 180 240 155" fill="none" stroke="#3b82f6" stroke-width="3"/>
  <path d="M 280 145 Q 300 120 340 80" fill="none" stroke="#3b82f6" stroke-width="3"/>
  <!-- Labels -->
  <text x="180" y="280" font-size="14">x</text>
  <text x="210" y="70" font-size="14">y</text>
  <text x="265" y="280" font-size="12" fill="#ef4444">x = 3</text>
</svg>
```

Example SVG showing removable discontinuity (hole):
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Coordinate system -->
  <line x1="50" y1="250" x2="350" y2="250" stroke="black" stroke-width="2"/>
  <line x1="50" y1="250" x2="50" y2="50" stroke="black" stroke-width="2"/>
  <!-- Function line with gap -->
  <line x1="60" y1="220" x2="190" y2="130" stroke="#3b82f6" stroke-width="3"/>
  <line x1="210" y1="120" x2="340" y2="60" stroke="#3b82f6" stroke-width="3"/>
  <!-- Hole (open circle) at discontinuity -->
  <circle cx="200" cy="125" r="5" fill="white" stroke="#3b82f6" stroke-width="2"/>
  <!-- Labels -->
  <text x="180" y="280" font-size="14">x</text>
  <text x="20" y="150" font-size="14">y</text>
  <text x="205" y="120" font-size="12" fill="#3b82f6">hole</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Simple rational functions $f(x) = \frac{a}{x - h} + k$, one vertical and one horizontal asymptote, direct identification of features
- **Medium**: Rational functions with linear or quadratic numerator/denominator, determining asymptotes by degree rules, identifying zeros and poles, simple graphing
- **Hard**: Complex rational functions with multiple asymptotes, removable discontinuities, oblique asymptotes, complete analysis and accurate graphing, real-world modeling

**Include variety in numerical values:**
- Different linear forms: $\frac{x + 1}{x - 2}$, $\frac{2x - 3}{x + 4}$, $\frac{-x + 5}{3x - 1}$
- Various vertical asymptotes: $x = -3, 0, 2, 5$
- Different horizontal asymptotes: $y = 0, 1, 2, -1, \frac{3}{2}$
- Zeros at various locations: $x = -4, -1, 0, 3, 7$
- Removable discontinuities: $f(x) = \frac{x^2 - 4}{x - 2}$ has hole at $x = 2$
- Ensure different numerical answers each time to prevent memorization
