---
id: linear-functions
name: Linear Functions
description: Understanding and working with linear functions including slope, y-intercept, and graphing
grade: 8
ages:
  - 13
  - 15
focus: Slope and y-intercept, slope-intercept form, graphing linear functions, parallel and perpendicular lines, applications and modeling
difficulty: medium
learning_objectives:
  - Understand the slope-intercept form y = mx + b
  - Determine slope and y-intercept from graphs and tables
  - Graph linear functions using slope and intercept
  - Find equations of lines from two points or point and slope
  - Interpret slope and intercept in real contexts
prerequisites:
  - introduction-to-functions
example_tasks:
  - Graph the function f(x) = 2x - 3
  - Find the equation of a line passing through (1, 3) and (4, 9)
  - A taxi charges 5 euros base fee plus 2 euros per kilometer. Write the cost function.
real_world_context: Cost functions, temperature conversion, distance-time graphs, subscription pricing, taxi fares
---

# Linear Functions Tasks

Create mathematics problems that explore linear functions and their properties. Problems should help students understand slope as rate of change, interpret y-intercept as initial value, graph linear relationships, and model real-world situations with linear functions.

**Vary the problem structure:**
- **Graphing from slope-intercept form**: Given $f(x) = mx + b$, plot the function by identifying y-intercept and using slope to find additional points
- **Finding equations from graphs**: Present a graph of a linear function and ask students to determine the equation by identifying slope and y-intercept
- **Slope calculation from two points**: Given coordinates $(x_1, y_1)$ and $(x_2, y_2)$, calculate slope using $m = \frac{y_2 - y_1}{x_2 - x_1}$
- **Finding equations from two points**: Use point-slope form or slope-intercept form to write the equation of a line through two given points
- **Point-slope form problems**: Given a point and slope, write equation using $y - y_1 = m(x - x_1)$ and convert to slope-intercept form
- **Parallel lines**: Find equation of line parallel to given line (same slope) passing through a specific point
- **Perpendicular lines**: Find equation of line perpendicular to given line (negative reciprocal slope) through a point
- **Interpreting slope and intercept**: Given real-world context, explain what slope and y-intercept represent (rate of change and initial value)
- **Finding intersections**: Calculate where two linear functions intersect by solving system of equations

**Vary the content/context:**
- **Cost functions**: Phone plans (monthly fee + per-minute charges), taxi fares (base fee + per-km rate), rental costs (daily rate + mileage)
- **Temperature conversion**: Fahrenheit-Celsius relationships, using $F = \frac{9}{5}C + 32$
- **Distance-time graphs**: Constant speed travel, representing motion with linear functions
- **Subscription services**: Gym memberships, streaming services with base cost and variable charges
- **Water tank problems**: Filling or draining tanks at constant rates
- **Savings plans**: Regular deposits, growth over time with constant additions

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 14): Positive integer slopes, positive y-intercepts, simple fractions like $\frac{1}{2}$ or $\frac{1}{3}$, graphing on provided coordinate systems, direct reading of slope and intercept
- **For middle ages** ({{age}} 14-15): Negative slopes, negative y-intercepts, fractional and decimal slopes, determining equations from graphs, simple word problems requiring function setup
- **For older ages** ({{age}} >= 15): Complex word problems, parallel and perpendicular lines, systems of linear equations, converting between different forms, interpreting parameters in context

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline: $y = mx + b$, slope $m = \frac{\Delta y}{\Delta x}$, point-slope form $y - y_1 = m(x - x_1)$
- Block for equation derivations:

$$m = \frac{y_2 - y_1}{x_2 - x_1} = \frac{6 - 2}{4 - 1} = \frac{4}{3}$$

$$y - 2 = \frac{4}{3}(x - 1)$$

**Tables for function values:**

| x  | f(x) |
|----|------|
| 0  | 5    |
| 2  | 9    |
| 4  | 13   |
| 6  | 17   |

**SVG diagrams for linear function graphs:**

Use SVG to show:
- Coordinate grids with x and y axes clearly marked
- Linear function graphs with proper scale
- Labeled points showing slope triangles (rise over run)
- Y-intercept clearly marked
- Multiple lines for comparison (parallel, perpendicular, or intersecting)
- Shaded slope triangles to visualize rise/run

Example SVG for linear function with slope triangle:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Grid lines -->
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="400" height="300" fill="url(#grid)"/>
  <!-- Axes -->
  <line x1="50" y1="250" x2="350" y2="250" stroke="black" stroke-width="2"/>
  <line x1="50" y1="250" x2="50" y2="50" stroke="black" stroke-width="2"/>
  <!-- Linear function -->
  <line x1="50" y1="220" x2="330" y2="80" stroke="#3b82f6" stroke-width="3"/>
  <!-- Slope triangle -->
  <line x1="130" y1="178" x2="210" y2="178" stroke="#ef4444" stroke-width="2"/>
  <line x1="210" y1="178" x2="210" y2="118" stroke="#ef4444" stroke-width="2"/>
  <!-- Labels -->
  <text x="180" y="280" font-size="14">x</text>
  <text x="20" y="150" font-size="14">y</text>
  <text x="160" y="200" font-size="12" fill="#ef4444">run</text>
  <text x="220" y="150" font-size="12" fill="#ef4444">rise</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Graphing given equations with integer slopes and intercepts, direct reading from tables or graphs, y-intercept is given or obvious
- **Medium**: Calculating slope from two points, writing equations from points, fractional or decimal slopes, simple word problems, parallel lines
- **Hard**: Perpendicular lines, intersection of lines, complex word problems requiring equation setup and interpretation, converting between forms, non-standard contexts

**Include variety in numerical values:**
- Different slopes: $m = 2$, $m = -3$, $m = \frac{1}{2}$, $m = -\frac{3}{4}$, $m = 0.5$, $m = -2.5$
- Various y-intercepts: $b = 3$, $b = -5$, $b = 0$, $b = 7$, $b = -1.5$
- Different point coordinates: (1, 4), (-2, 5), (3, -1), (0, 8), (5, 2)
- Real-world units: euros/km, degrees, meters/second, dollars/hour
- Ensure different numerical answers each time to prevent memorization
