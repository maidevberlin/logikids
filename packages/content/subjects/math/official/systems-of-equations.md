---
id: systems-of-equations
name: Linear Systems of Equations
description: Solving systems of two linear equations with two variables using multiple methods
grade: 8
ages:
  - 13
  - 14
  - 15
focus: Substitution method, elimination method, graphical solution method, word problems leading to systems, special cases
difficulty: medium
learning_objectives:
  - Solve systems using substitution method
  - Solve systems using elimination method
  - Solve systems graphically
  - Interpret the meaning of solutions in context
  - Recognize systems with unique, no, or infinite solutions
prerequisites: []
example_tasks:
  - Solve the system x + y = 10, x - y = 2 using elimination
  - Two numbers sum to 20 and differ by 4. Find both numbers
  - Solve by substitution y = 2x and x + y = 9
real_world_context: Mixture problems, cost comparison, break-even analysis, meeting problems, age problems with multiple people
---

# Linear Systems of Equations Tasks

Create mathematics problems that explore solving systems of two linear equations with two variables. Problems should help students understand multiple solution methods (substitution, elimination, graphical), interpret solutions in context, and recognize when systems have unique, no, or infinitely many solutions.

**Vary the problem structure:**
- **Substitution method**: Present systems where one equation is already solved for a variable, e.g., $y = 2x$ and $x + y = 9$, or where one equation can be easily rearranged
- **Elimination by addition/subtraction**: Give systems like $2x + y = 10$ and $x - y = 2$ where adding or subtracting equations eliminates a variable
- **Elimination with multiplication**: Systems requiring multiplication of one or both equations first, e.g., $2x + 3y = 13$ and $x + 2y = 8$
- **Graphical interpretation**: Provide graphs of two lines and ask students to identify the solution as the intersection point
- **Word problems with two unknowns**: Situations naturally leading to systems: "The sum of two numbers is 20, their difference is 4. Find both numbers"
- **Mixture problems**: "Mix 20 liters total of 30% and 60% solutions to get 45% solution. How much of each?"
- **Meeting problems**: "Two cyclists start 50 km apart, travel toward each other at different speeds, when do they meet?"
- **Special cases**: Systems with no solution (parallel lines) like $2x + y = 5$ and $2x + y = 7$, or infinite solutions (same line)

**Vary the content/context:**
- **Number relationships**: Sum and difference problems, ratio problems
- **Money and pricing**: Two types of tickets, comparing payment plans, cost analysis
- **Mixture and concentration**: Mixing solutions, alloys, coffee blends
- **Age problems**: Current and future ages of two people
- **Geometry**: Rectangle perimeter and area problems with two dimensions
- **Motion problems**: Two objects traveling toward or away from each other
- **Break-even analysis**: When do two pricing options cost the same?
- **Abstract systems**: Pure algebraic systems without context to develop symbolic reasoning

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 14): Systems with integer coefficients (mostly 1, 2, 3), one equation already solved or easily rearranged, simple contexts with clear relationships, integer solutions
- **For middle ages** ({{age}} 14-15): Both equations in standard form, require multiplication for elimination, more complex word problems, negative coefficients, solutions may be negative or fractional
- **For older ages** ({{age}} >= 16): Systems with larger coefficients, fractional coefficients, decimal values, multi-step word problems, special cases, abstract reasoning about when methods are most efficient

**Use appropriate formats:**

**LaTeX for systems:**
- Inline notation for simple systems
- Block notation for clear presentation:

$$\begin{cases}
2x + 3y = 13 \\
x - y = 1
\end{cases}$$

$$\begin{cases}
x + 2y = 8 \\
3x - y = 5
\end{cases}$$

**Tables for context problems:**

| Ticket Type | Price  | Number Sold | Revenue |
|-------------|--------|-------------|---------|
| Adult       | €x     | 50          | 50x     |
| Child       | €y     | 30          | 30y     |

Total tickets: 80, Total revenue: €400

**SVG for graphical representation:**

Show coordinate systems with two lines intersecting, or parallel lines for special cases:

```svg
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Grid and axes -->
  <line x1="50" y1="350" x2="350" y2="350" stroke="black" stroke-width="2"/>
  <line x1="50" y1="350" x2="50" y2="50" stroke="black" stroke-width="2"/>
  <!-- Line 1: y = -x + 8 -->
  <line x1="50" y1="110" x2="290" y2="350" stroke="#3b82f6" stroke-width="2"/>
  <!-- Line 2: y = 2x - 1 -->
  <line x1="50" y1="340" x2="170" y2="50" stroke="#ef4444" stroke-width="2"/>
  <!-- Intersection point -->
  <circle cx="110" cy="220" r="5" fill="#10b981"/>
  <!-- Labels -->
  <text x="360" y="355" font-size="14">x</text>
  <text x="40" y="40" font-size="14">y</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: One equation already solved for a variable (y = ...), or coefficients allow direct elimination, integer solutions, simple word problems with clear translation
- **Medium**: Both equations in standard form, require multiplication by small integers for elimination, negative coefficients, word problems requiring interpretation, solutions may be negative or fractional
- **Hard**: Large coefficients requiring multiplication, fractional coefficients, multi-step word problems, special cases (no solution or infinite solutions), strategic method choice required

**Include variety in numerical values:**
- Different coefficients: 1, 2, 3, 5, -1, -2, 0.5
- Various constants: 5, 8, 10, 12, 15, 20, -4
- Different solutions: (2, 3), (5, 1), (-1, 4), (0, 5), (1.5, 2.5)
- Money values: €10, €20, €50, €100
- Quantities: 10 items, 25 liters, 50 people, 100 km
- Ages: 10, 15, 25, 40 years
- Ensure variety in solution pairs and contexts to promote understanding of different solution methods
