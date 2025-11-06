---
id: inequalities
name: Inequalities
description: Solving and interpreting linear inequalities with understanding of solution sets
grade: 8
ages:
  - 13
  - 14
  - 15
  - 16
focus: Linear inequalities, solution sets and interval notation, graphical representation on number line, inequality rules, compound inequalities
difficulty: medium
learning_objectives:
  - Solve linear inequalities using equivalent transformations
  - Understand and apply the rule for multiplying/dividing by negative numbers
  - Represent solution sets on number lines and using interval notation
  - Interpret inequalities in real-world contexts
  - Solve compound inequalities and understand intersections of solution sets
prerequisites: []
example_tasks:
  - Solve the inequality 2x + 5 > 13 and represent the solution on a number line
  - A taxi charges €3 base fare plus €2 per km. For what distances is the total cost less than €15?
  - Solve and graph -3x + 7 ≤ 19
real_world_context: Budget constraints, speed limits, weight restrictions, temperature ranges, capacity limits, optimization with constraints
---

# Inequalities Tasks

Create mathematics problems that explore linear inequalities and their solution sets. Problems should help students understand inequality notation, solve inequalities using transformations (especially with negative multipliers), represent solutions graphically, and interpret inequalities in practical contexts involving ranges and constraints.

**Vary the problem structure:**
- **Simple linear inequalities**: Present $2x + 5 > 13$ or $3x - 7 \leq 8$ and ask students to solve using equivalent transformations
- **Inequalities requiring sign reversal**: Give inequalities like $-2x + 5 < 9$ or $-3x \geq 12$ where dividing by negative numbers reverses the inequality sign
- **Compound inequalities**: Present problems like $-3 < 2x + 1 < 9$ asking for values satisfying both conditions simultaneously
- **Number line representation**: Ask students to graph solution sets on number lines with open/closed circles and arrows
- **Interval notation**: Request solutions in interval notation, e.g., $x \in (-\infty, 4]$ or $x \in [2, 7)$
- **Word problems with constraints**: Translate real-world situations into inequalities, e.g., "Budget allows spending at most €50. If shirts cost €12 each, how many can you buy?"
- **Checking solutions**: Provide an inequality and several values, ask which satisfy the inequality
- **Creating inequalities**: Give a number line graph or interval and ask students to write the corresponding inequality
- **Multi-step inequalities**: Combine brackets and fractions with inequalities

**Vary the content/context:**
- **Budget and money**: "You have €50. Items cost €x each. How many can you afford?" (where answer is $x \leq \text{budget}/\text{price}$)
- **Speed and distance**: "Speed limit is 80 km/h. For how long can you drive to stay under 200 km?" ($v \cdot t < 200$)
- **Weight restrictions**: "Elevator capacity 500 kg. Average person 75 kg. How many people maximum?"
- **Temperature ranges**: "Safe storage temperature between 2°C and 8°C. Express as inequality"
- **Test scores**: "Need average above 70 from 5 tests. Have 65, 72, 68, 75. What minimum on last test?"
- **Production constraints**: "Factory can produce at most 200 units per day. Cost per unit €x, budget €5000. Find constraints"
- **Age restrictions**: "Must be at least 16 years old to participate"
- **Abstract inequalities**: Pure algebraic problems without context to develop symbolic manipulation

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 14): Simple one or two-step inequalities, positive coefficients primarily, clear contexts with familiar situations, solution on number line
- **For middle ages** ({{age}} 14-15): Include negative coefficients requiring sign reversal, compound inequalities, interval notation, two-step word problems, brackets
- **For older ages** ({{age}} >= 16): Complex multi-step inequalities, combined with fractions, abstract reasoning about solution sets, optimization with multiple constraints

**Use appropriate formats:**

**LaTeX for inequalities:**
- Inline for simple cases: Solve $2x + 5 > 13$ or $-3x \leq 9$
- Block for complex inequalities:

$$-2(3x - 5) + 7 < 4x + 13$$

$$-3 \leq \frac{2x + 1}{3} < 5$$

**Important rule highlighted:**
$$\text{When multiplying or dividing by a negative number, reverse the inequality sign!}$$

Example: $-2x < 6 \implies x > -3$

**Number line representations:**

Describe or show number lines with solution sets marked:

```
Open circle (○) for < or >
Closed circle (●) for ≤ or ≥
Arrow showing direction of solution set
```

**SVG for number line visualization:**

```svg
<svg viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Number line -->
  <line x1="50" y1="50" x2="350" y2="50" stroke="black" stroke-width="2"/>
  <!-- Tick marks -->
  <line x1="50" y1="45" x2="50" y2="55" stroke="black" stroke-width="2"/>
  <line x1="150" y1="45" x2="150" y2="55" stroke="black" stroke-width="2"/>
  <line x1="250" y1="45" x2="250" y2="55" stroke="black" stroke-width="2"/>
  <line x1="350" y1="45" x2="350" y2="55" stroke="black" stroke-width="2"/>
  <!-- Solution region (x > 2) -->
  <line x1="150" y1="50" x2="350" y2="50" stroke="#3b82f6" stroke-width="4"/>
  <circle cx="150" cy="50" r="5" fill="white" stroke="#3b82f6" stroke-width="2"/>
  <polygon points="340,50 350,45 350,55" fill="#3b82f6"/>
  <!-- Labels -->
  <text x="45" y="75" font-size="14">0</text>
  <text x="145" y="75" font-size="14">2</text>
  <text x="245" y="75" font-size="14">4</text>
  <text x="345" y="75" font-size="14">6</text>
</svg>
```

**Interval notation table:**

| Inequality      | Number Line             | Interval Notation |
|-----------------|------------------------|-------------------|
| $x > 3$         | Open circle at 3, →    | $(3, \infty)$    |
| $x \leq 5$      | Closed circle at 5, ← | $(-\infty, 5]$   |
| $2 < x \leq 7$  | Open at 2, closed at 7 | $(2, 7]$         |

**Adjust difficulty with {{difficulty}}:**
- **Easy**: One or two-step inequalities, positive coefficients only, no sign reversal needed, simple contexts with direct translation, whole number boundary values
- **Medium**: Negative coefficients requiring sign reversal, compound inequalities, interval notation, two-step word problems, brackets, may require one algebraic transformation
- **Hard**: Multi-step with brackets and fractions, multiple transformations, abstract contexts, optimization problems, combined systems of inequalities, strategic reasoning about solution sets

**Include variety in numerical values:**
- Different coefficients: 2, 3, 5, -2, -3, 0.5
- Various constants: 5, 10, 13, 18, -4, -7
- Boundary values: -5, -2, 0, 3, 7, 10, 15
- Money amounts: €10, €25, €50, €100, €200
- Quantities: 5 items, 12 people, 20 kg, 100 km
- Temperature ranges: -5°C to 30°C
- Age ranges: 12-18, 16-25, 18+
- Speed limits: 30, 50, 80, 100, 120 km/h
- Ensure different boundary values and contexts to develop understanding of inequality concepts rather than specific solutions
