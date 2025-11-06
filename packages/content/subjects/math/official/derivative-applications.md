---
id: derivative-applications
name: Applications of Derivatives
description: Using derivatives to analyze functions and solve optimization and related rates problems
grade: 11
ages:
  - 16
  - 17
  - 18
focus: Critical points, first derivative test, second derivative test, curve sketching, optimization problems, related rates problems, mean value theorem
difficulty: hard
learning_objectives:
  - Find critical points and classify as maxima, minima, or saddle points
  - Determine intervals of increase and decrease
  - Find inflection points and analyze concavity
  - Solve optimization problems
  - Apply derivatives to related rates problems
prerequisites:
  - derivatives
  - limits-continuity
  - quadratic-functions
example_tasks:
  - Find the local maxima and minima of f(x) = x³ - 3x² + 2
  - Determine the dimensions of a rectangle with perimeter 100m that maximizes area
  - If a balloon's radius increases at 2 cm/s, how fast is the volume changing when r = 5 cm?
real_world_context: Profit maximization, minimizing material costs, optimal dimensions, velocity and acceleration problems
---

# Applications of Derivatives Tasks

Create calculus problems that apply derivatives to real-world optimization, curve analysis, and rate-of-change scenarios. Problems should help students find extrema, analyze function behavior comprehensively (Kurvendiskussion), and solve practical optimization and related rates problems.

**Vary the problem structure:**
- **Finding critical points**: Solve $f'(x) = 0$ to find critical points of polynomial and rational functions
- **First derivative test**: Use sign changes of $f'(x)$ to classify critical points as local maxima or minima
- **Second derivative test**: Evaluate $f''(c)$ at critical point $c$: if $f''(c) > 0$ then local minimum, if $f''(c) < 0$ then local maximum
- **Intervals of increase/decrease**: Determine where $f'(x) > 0$ (increasing) and $f'(x) < 0$ (decreasing)
- **Inflection points**: Find where $f''(x) = 0$ or is undefined, and concavity changes
- **Concavity analysis**: Determine where $f''(x) > 0$ (concave up) and $f''(x) < 0$ (concave down)
- **Complete curve sketching**: Perform full Kurvendiskussion: domain, zeros, y-intercept, symmetry, asymptotes, extrema, inflection points, sketch graph
- **Optimization - area/volume**: Maximize or minimize area, volume, or perimeter given constraints (fencing problems, box problems, cylinder problems)
- **Optimization - cost/profit**: Maximize profit or minimize cost given economic functions
- **Related rates**: Given rate of change of one variable, find rate of change of related variable using chain rule (e.g., balloon inflation, ladder sliding, shadow length)
- **Mean value theorem**: Apply MVT: if $f$ is continuous on $[a,b]$ and differentiable on $(a,b)$, then $\exists c$ where $f'(c) = \frac{f(b)-f(a)}{b-a}$

**Vary the content/context:**
- **Pure function analysis**: Polynomial, rational, exponential, and trigonometric functions
- **Geometry optimization**: Rectangles, triangles, circles, boxes, cylinders, cones with constraint conditions
- **Economics**: Profit functions $P(x) = R(x) - C(x)$, marginal cost, marginal revenue, maximizing profit
- **Physics**: Position-velocity-acceleration relationships, projectile motion optimization, energy minimization
- **Related rates - geometry**: Expanding circles, inflating spheres, ladder sliding down wall, cone filling with water
- **Related rates - motion**: Two vehicles approaching intersection, aircraft altitude change, shadow length change
- **Agriculture/construction**: Fencing enclosures, building materials minimization, crop yield optimization
- **Manufacturing**: Packaging design for minimum material, production rate optimization

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 17): Simple polynomial extrema (quadratic, cubic), basic optimization with one variable, straightforward critical point classification, clear geometric problems
- **For middle ages** ({{age}} 17-18): Complete curve sketching with all elements, optimization problems requiring constraint equations, inflection points and concavity, basic related rates
- **For older ages** ({{age}} >= 18): Complex optimization with multiple constraints, implicit differentiation in related rates, mean value theorem applications, abstract optimization problems, global vs. local extrema on closed intervals

**Use appropriate formats:**

**LaTeX for formulas:**
- Critical point condition: $f'(c) = 0$ or $f'(c)$ undefined
- Extrema tests:

**First Derivative Test:**
- If $f'$ changes from $+$ to $-$ at $c$: local maximum
- If $f'$ changes from $-$ to $+$ at $c$: local minimum

**Second Derivative Test:**
$$f''(c) > 0 \implies \text{local minimum}, \quad f''(c) < 0 \implies \text{local maximum}$$

**Concavity:**
$$f''(x) > 0 \implies \text{concave up}, \quad f''(x) < 0 \implies \text{concave down}$$

**Optimization setup:**
Given constraint $g(x,y) = 0$, maximize/minimize $f(x,y)$:
1. Solve constraint for one variable
2. Substitute into objective function
3. Find $f'(x) = 0$
4. Verify maximum/minimum using second derivative

**Tables for sign analysis:**

| Interval | $f'(x)$ | $f(x)$ behavior |
|----------|---------|-----------------|
| $x < 2$  | $+$     | increasing      |
| $x > 2$  | $-$     | decreasing      |

**SVG diagrams for curve sketching:**

Use SVG to show:
- Complete function graph with labeled extrema and inflection points
- Sign chart for $f'(x)$ showing intervals of increase/decrease
- Sign chart for $f''(x)$ showing concavity
- Geometric optimization diagrams (rectangles, boxes, cylinders with dimensions labeled)
- Related rates diagrams (ladder against wall, expanding circle, filling tank)
- Tangent lines at inflection points

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Finding extrema of simple polynomials (cubic with integer roots), basic interval analysis, simple geometric optimization (rectangle area with given perimeter)
- **Medium**: Complete curve sketching for rational functions, concavity and inflection points, optimization requiring constraint equation setup, basic related rates (expanding circle)
- **Hard**: Abstract optimization with complex constraints, multi-step related rates requiring implicit differentiation, mean value theorem proofs and applications, global extrema on closed intervals using endpoint analysis

**Include variety in numerical values:**
- Different polynomial coefficients generating varied critical points
- Various constraint values: perimeters of 80m, 120m, 200m
- Different rates in related rates: 2 cm/s, 0.5 m/s, 3 mm/min
- Multiple dimensions in optimization problems
- Various cost and revenue function coefficients
- Different geometric measurements: radius, height, base, altitude
- Ensure each problem has unique optimal solution
