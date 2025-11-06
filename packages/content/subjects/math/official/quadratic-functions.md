---
id: quadratic-functions
name: Quadratic Functions
description: Analyzing and graphing quadratic functions including parabolas, vertex form, and applications
grade: 9
ages:
  - 14
  - 16
focus: Parabola properties, standard form, vertex form, factored form, transformations of parabolas, optimization with quadratic functions
difficulty: medium
learning_objectives:
  - Recognize and graph parabolas
  - Convert between standard, vertex, and factored forms
  - Determine vertex, axis of symmetry, and zeros
  - Understand the effect of parameters on parabola shape and position
  - Apply quadratic functions to optimization problems
prerequisites:
  - linear-functions
  - quadratic-equations
example_tasks:
  - Graph the function f(x) = x² - 4x + 3 and identify its vertex
  - Convert f(x) = 2(x - 3)² + 1 to standard form
  - A ball is thrown upward with height h(t) = -5t² + 20t + 2. When does it reach maximum height?
real_world_context: Projectile motion, bridge arch design, profit maximization, area optimization, braking distance
---

# Quadratic Functions Tasks

Create mathematics problems that explore quadratic functions and parabolas. Problems should help students understand the relationship between algebraic forms and graphical features, analyze parabola properties, and apply quadratic functions to optimization and real-world modeling.

**Vary the problem structure:**
- **Graphing from standard form**: Given $f(x) = ax^2 + bx + c$, find vertex using $x_v = -\frac{b}{2a}$, determine opening direction from sign of $a$, plot parabola
- **Vertex form analysis**: Given $f(x) = a(x - h)^2 + k$, identify vertex $(h, k)$ directly, understand how $a$ affects width and opening
- **Converting forms**: Transform between standard form, vertex form $f(x) = a(x - h)^2 + k$, and factored form $f(x) = a(x - x_1)(x - x_2)$
- **Finding zeros/x-intercepts**: Solve $f(x) = 0$ using factoring, quadratic formula, or reading from factored form
- **Axis of symmetry**: Determine the vertical line $x = h$ that divides parabola symmetrically
- **Y-intercept identification**: Evaluate $f(0)$ to find where parabola crosses y-axis
- **Parameter effects**: Analyze how changing $a$, $h$, or $k$ transforms the basic parabola $y = x^2$
- **Optimization problems**: Find maximum or minimum values in real contexts (maximum height, minimum cost, maximum area)
- **Completing the square**: Convert standard form to vertex form by completing the square

**Vary the content/context:**
- **Projectile motion**: Ball trajectories, thrown objects, fountains, fireworks with height functions $h(t) = -5t^2 + v_0t + h_0$
- **Area optimization**: Maximum rectangular area with fixed perimeter, fenced regions, garden design
- **Profit functions**: Revenue minus cost, finding maximum profit for businesses
- **Bridge and arch design**: Parabolic arch shapes, cable suspension curves
- **Braking distance**: Quadratic relationship between speed and stopping distance
- **Physics**: Free fall, vertical motion under gravity, parabolic reflectors

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 15): Simple parabolas with $a = 1$ or $a = -1$, vertex form given directly, integer zeros, graphing on provided grids, recognizing parabola shapes
- **For middle ages** ({{age}} 15-16): Converting between forms, $a$ values different from ±1, completing the square, word problems with clear setup, finding vertex from standard form
- **For older ages** ({{age}} >= 16): Complex optimization problems, transformations with multiple parameters, challenging form conversions, applied problems requiring equation setup from description, discriminant analysis

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline: $f(x) = ax^2 + bx + c$, vertex $x_v = -\frac{b}{2a}$, zeros $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
- Block for form conversions and calculations:

$$f(x) = x^2 - 6x + 8$$

$$f(x) = (x - 3)^2 - 1$$

$$f(x) = (x - 2)(x - 4)$$

**Tables for parabola points:**

| x   | f(x) |
|-----|------|
| -1  | 6    |
| 0   | 3    |
| 1   | 2    |
| 2   | 3    |
| 3   | 6    |

**SVG diagrams for parabola graphs:**

Use SVG to show:
- Coordinate systems with parabolic curves
- Vertex clearly marked as highest or lowest point
- Axis of symmetry shown as dashed vertical line
- Zeros/x-intercepts marked where parabola crosses x-axis
- Y-intercept marked
- Opening direction (upward or downward)
- Comparison of parabolas with different parameters

Example SVG for parabola with marked features:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Coordinate system -->
  <line x1="50" y1="250" x2="350" y2="250" stroke="black" stroke-width="2"/>
  <line x1="50" y1="250" x2="50" y2="50" stroke="black" stroke-width="2"/>
  <!-- Grid lines (optional) -->
  <line x1="200" y1="250" x2="200" y2="50" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="5,5"/>
  <!-- Parabola -->
  <path d="M 80 240 Q 200 80 320 240" fill="none" stroke="#3b82f6" stroke-width="3"/>
  <!-- Vertex -->
  <circle cx="200" cy="80" r="5" fill="#ef4444"/>
  <text x="210" y="75" font-size="12" fill="#ef4444">Vertex</text>
  <!-- Axis of symmetry -->
  <line x1="200" y1="250" x2="200" y2="70" stroke="#ef4444" stroke-width="1" stroke-dasharray="5,5"/>
  <!-- Labels -->
  <text x="180" y="280" font-size="14">x</text>
  <text x="20" y="150" font-size="14">y</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Vertex form given directly, simple integer parameters, graphing with vertex and a few points, recognizing parabola features from equations
- **Medium**: Standard form requiring vertex calculation, converting between two forms, solving for zeros, basic optimization with guided setup
- **Hard**: Converting between all three forms, completing the square, complex optimization requiring full problem setup, parameter analysis, discriminant interpretation

**Include variety in numerical values:**
- Different $a$ values: $a = 1$, $a = 2$, $a = -1$, $a = 0.5$, $a = -3$
- Various vertex coordinates: $(2, -3)$, $(-1, 5)$, $(0, 4)$, $(3, -1)$
- Different zeros: $x_1 = 1, x_2 = 5$; $x_1 = -2, x_2 = 3$; $x_1 = 0, x_2 = 4$
- Real-world parameters: initial heights 0-5 meters, initial velocities 10-30 m/s, areas 20-200 square units
- Ensure different numerical answers each time to prevent memorization
