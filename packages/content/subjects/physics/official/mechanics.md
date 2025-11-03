---
id: mechanics
name: Mechanics
description: 'Study of motion, forces, and energy in everyday situations'
grade: 7
ages:
  - 11
  - 16
focus: 'Motion, forces, energy, and simple machines'
difficulty: medium
learning_objectives:
  - Understand Newton's laws of motion
  - 'Calculate force, mass, and acceleration relationships'
  - Analyze energy transformations in physical systems
  - Apply principles of work and power
  - Understand momentum and collisions
  - Solve problems involving simple machines
prerequisites: []
example_tasks:
  - A 500g ball is thrown with a force of 10N. What is its acceleration?
  - Calculate the work done when lifting a 20kg object 3 meters high
  - How does a lever multiply force to lift heavy objects?
real_world_context: 'Sports physics, vehicle safety, construction equipment, playground equipment'
---

# Mechanics Tasks

Create physics problems that explore motion, forces, energy, and simple machines through real-world scenarios. Problems should help students apply Newton's laws and understand how mechanical principles govern everyday situations.

**Vary the problem structure:**
- **Force and acceleration problems** using Newton's Second Law $F = ma$: Calculate missing quantities (force, mass, or acceleration) in scenarios like pushing objects, throwing balls, or vehicles accelerating
- **Work and energy calculations** using $W = F \cdot d$: Determine work done when lifting objects, pushing carts, or climbing stairs; include potential energy $PE = mgh$ and kinetic energy $KE = \frac{1}{2}mv^2$
- **Momentum and collision scenarios** using $p = mv$: Analyze collisions between objects (balls, vehicles, hockey pucks), calculate momentum before/after collisions
- **Simple machines analysis**: Examine levers, pulleys, inclined planes showing mechanical advantage and how force is multiplied or distance is traded for force
- **Motion and velocity problems** using $v = \frac{d}{t}$ and $a = \frac{\Delta v}{t}$: Calculate speed, distance, time, or acceleration for moving objects
- **Power calculations** using $P = \frac{W}{t}$: Determine power output in scenarios like climbing stairs, lifting weights, or engines doing work
- **Free body diagram analysis**: Present scenarios with multiple forces (gravity, friction, applied force, normal force) and ask students to analyze net force and resulting motion
- **Energy transformation chains**: Trace energy conversions (potential → kinetic, chemical → kinetic → heat) in roller coasters, swings, or bouncing balls

**Vary the content/context:**
- **Sports scenarios**: Soccer ball kicks, basketball throws, skateboard motion, baseball bat collisions, ice skating momentum
- **Everyday activities**: Lifting groceries, pushing shopping carts, climbing stairs, riding bikes, opening doors
- **Playground equipment**: Swings, seesaws, slides, merry-go-rounds demonstrating energy and force principles
- **Vehicles**: Car acceleration, bicycle braking, train momentum, roller coaster energy transformations
- **Tools and machines**: Hammers, wrenches, pulley systems, ramps, wheelbarrows showing mechanical advantage
- **Construction**: Cranes lifting materials, using ramps to move heavy objects, lever systems

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 13): Use simpler scenarios, whole numbers, basic formulas like $F = ma$, focus on conceptual understanding, minimal multi-step calculations
- **For middle ages** ({{age}} 13-14): Include two-step problems, unit conversions (g to kg, cm to m), combine multiple formulas, introduce graphs
- **For older ages** ({{age}} >= 15): Complex multi-step problems, vector components, simultaneous equations, detailed energy analysis, advanced mechanical advantage calculations

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for simple equations: $F = ma$, $W = F \cdot d$, $v = \frac{d}{t}$
- Block for derivations or emphasis:

$$F_{net} = ma$$

$$W = F \cdot d \cdot \cos(\theta)$$

**Tables for organizing data:**

| Object | Mass (kg) | Force (N) | Acceleration (m/s²) |
|--------|-----------|-----------|---------------------|
| Ball   | 0.5       | 10        | ?                   |
| Box    | 20        | 100       | ?                   |

**SVG diagrams for force analysis:**

Use SVG to show:
- Free body diagrams with force vectors
- Simple machines (levers, pulleys) with force and distance labels
- Motion diagrams showing velocity/acceleration vectors
- Energy bar charts showing transformations

Example SVG structure for a force diagram:
```svg
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Object -->
  <rect x="125" y="125" width="50" height="50" fill="#3b82f6"/>
  <!-- Force vectors -->
  <line x1="150" y1="125" x2="150" y2="50" stroke="red" stroke-width="3" marker-end="url(#arrowhead)"/>
  <text x="155" y="85" fill="red">F = 20N</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Single formula, direct calculation, given all values, simple contexts
- **Medium**: Two-step problems, one unit conversion, choose correct formula, analyze results
- **Hard**: Multi-step reasoning, multiple conversions, combine several concepts, interpret complex scenarios

**Include variety in numerical values:**
- Use different masses: 50g, 2kg, 500kg
- Vary forces: 5N, 25N, 150N
- Change distances: 2m, 0.5km, 15cm
- Different time intervals: 3s, 0.2min, 1.5h
- Ensure calculations yield different answers each time

