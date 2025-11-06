---
id: quadratic-equations
name: Quadratic Equations
description: Solving quadratic equations using multiple methods including factoring, completing the square, and formulas
grade: 9
ages:
  - 14
  - 16
focus: Factoring quadratic expressions, completing the square, p-q formula, abc formula, discriminant and number of solutions, Vieta's formulas
difficulty: medium
learning_objectives:
  - Solve quadratic equations by factoring
  - Solve quadratic equations by completing the square
  - Apply the quadratic formula (p-q formula and abc formula)
  - Determine the number of solutions using the discriminant
  - Apply quadratic equations to real-world problems
prerequisites: []
example_tasks:
  - Solve x² + 5x + 6 = 0 by factoring
  - Solve x² + 6x - 7 = 0 using the p-q formula
  - Determine how many solutions 2x² + 3x + 5 = 0 has
real_world_context: Projectile motion, area optimization, break-even analysis, circuit design, physics applications
---

# Quadratic Equations Tasks

Create mathematics problems that explore solving quadratic equations using various methods. Problems should help students understand different solution strategies (factoring, completing the square, formulas), interpret the discriminant, and apply quadratic equations to real-world contexts involving parabolic relationships.

**Vary the problem structure:**
- **Factoring method**: Present equations like $x^2 + 5x + 6 = 0$ or $x^2 - x - 12 = 0$ that factor nicely into $(x+p)(x+q) = 0$
- **Special factoring with binomial formulas**: Give $x^2 - 16 = 0$ or $x^2 + 6x + 9 = 0$ requiring recognition of difference of squares or perfect square trinomials
- **p-q formula**: Present equations in the form $x^2 + px + q = 0$ and ask students to apply $x = -\frac{p}{2} \pm \sqrt{(\frac{p}{2})^2 - q}$
- **abc formula**: Give equations in the form $ax^2 + bx + c = 0$ (with $a \neq 1$) requiring $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
- **Completing the square**: Ask students to solve by transforming to $(x+d)^2 = e$ form, especially when formulas aren't optimal
- **Discriminant analysis**: Provide equations and ask students to determine the number of solutions without solving completely
- **Word problems**: Translate contexts into quadratic equations (area, projectile motion, optimization) and solve
- **Solution verification**: Give an equation and proposed solutions, ask students to check by substitution
- **Creating quadratic equations**: Given roots (e.g., $x_1 = 2, x_2 = -3$), ask students to write the equation

**Vary the content/context:**
- **Geometric area problems**: "A rectangle has length 3 more than width, area 40 cm². Find dimensions"
- **Projectile motion**: "A ball thrown upward follows $h(t) = -5t^2 + 20t + 2$. When does it hit the ground?"
- **Number problems**: "Two consecutive integers have a product of 72. Find them"
- **Break-even analysis**: "Revenue $R = 100x - x^2$, cost $C = 20x + 300$. Find break-even quantity"
- **Optimization**: "Maximize area of rectangle with perimeter 40 m"
- **Right triangle problems**: Using Pythagorean theorem leading to quadratic equations
- **Physics applications**: Free fall, kinetic energy, electrical circuits
- **Abstract equations**: Pure algebraic problems without context to develop symbolic reasoning

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 15): Factorable equations with small integer coefficients, p-q formula with simple numbers, positive discriminants ensuring real solutions, clear contexts
- **For middle ages** ({{age}} 15-16): Mix of solution methods, equations with $a \neq 1$, negative discriminants (no real solutions), completing the square, more complex word problems
- **For older ages** ({{age}} >= 16): Strategic method choice, complex coefficients, fractional or decimal coefficients, abstract analysis, multiple-step word problems, Vieta's formulas

**Use appropriate formats:**

**LaTeX for equations and formulas:**
- Display the standard forms and formulas:

**Standard form:** $ax^2 + bx + c = 0$

**p-q formula** (when $a=1$):
$$x = -\frac{p}{2} \pm \sqrt{\left(\frac{p}{2}\right)^2 - q}$$

**abc formula** (general case):
$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

**Discriminant:**
$$D = b^2 - 4ac$$
- If $D > 0$: two distinct real solutions
- If $D = 0$: one repeated real solution
- If $D < 0$: no real solutions

- Inline for specific equations: Solve $x^2 + 7x + 12 = 0$ or $2x^2 - 5x - 3 = 0$

**Tables for discriminant analysis:**

| Equation              | a  | b  | c  | Discriminant | Number of Solutions |
|----------------------|----|----|----|--------------|--------------------|
| $x^2 + 5x + 6 = 0$   | 1  | 5  | 6  | 1            | 2 real             |
| $x^2 + 4x + 4 = 0$   | 1  | 4  | 4  | 0            | 1 real (repeated)  |
| $x^2 + 2x + 5 = 0$   | 1  | 2  | 5  | -16          | 0 real             |

**SVG for parabola visualization:**

Show parabola with x-intercepts (solutions) marked:

```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Axes -->
  <line x1="50" y1="250" x2="350" y2="250" stroke="black" stroke-width="2"/>
  <line x1="200" y1="280" x2="200" y2="20" stroke="black" stroke-width="2"/>
  <!-- Parabola -->
  <path d="M 50,150 Q 200,20 350,150" fill="none" stroke="#3b82f6" stroke-width="3"/>
  <!-- Solutions (x-intercepts) -->
  <circle cx="120" cy="250" r="5" fill="#ef4444"/>
  <circle cx="280" cy="250" r="5" fill="#ef4444"/>
  <!-- Labels -->
  <text x="110" y="270" font-size="14">x₁</text>
  <text x="270" y="270" font-size="14">x₂</text>
  <text x="360" y="255" font-size="14">x</text>
  <text x="195" y="15" font-size="14">y</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Factorable equations with small integer coefficients, clear factorization patterns, p-q formula with integer or simple radical solutions, simple word problems with direct translation
- **Medium**: Mix of factorable and non-factorable, abc formula with $a \neq 1$, discriminant analysis, completing the square, moderate complexity word problems, negative coefficients
- **Hard**: Strategic method selection required, large coefficients, fractional/decimal coefficients, zero or negative discriminants, multi-step word problems, abstract analysis, Vieta's formulas application

**Include variety in numerical values:**
- Different coefficients: a = 1, 2, 3, -1, 0.5 | b = 2, 5, 7, -3, -6 | c = 3, 6, 12, -8, -15
- Various discriminants: perfect squares (9, 16, 25), non-perfect squares (5, 13, 20), zero, negative values
- Different solution types: two positive, two negative, one positive one negative, one repeated, no real solutions
- Integer solutions: -3, -1, 0, 2, 4, 5, 8
- Fractional solutions: ½, ⅓, ⅔, 1½, 2½
- Irrational solutions: $1 \pm \sqrt{2}$, $-2 \pm \sqrt{5}$
- Geometric values: lengths 3, 5, 8, 12 cm | areas 24, 36, 48, 60 cm²
- Physics values: times 2, 3, 4, 5 seconds | heights 10, 20, 30, 45 meters
- Ensure variety to prevent pattern memorization and promote conceptual understanding
