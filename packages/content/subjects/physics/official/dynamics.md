---
id: dynamics
name: Dynamics
description: 'Study of forces and their effects on motion - Newton''s laws, force analysis, and applications'
grade: 8
ages:
  - 13
  - 15
focus: 'Newton''s laws, force equilibrium, force addition and resolution, friction, inclined plane, tension forces, weight force vs. mass, Hooke''s law, traffic safety applications'
difficulty: medium
learning_objectives:
  - Apply Newton's three laws of motion
  - Analyze force equilibrium and force addition
  - Understand relationship between force, mass, and acceleration
  - Apply force concepts to everyday situations
prerequisites:
  - kinematics
example_tasks:
  - "A 1200 kg car accelerates at 2.5 m/s^2. What net force acts on the car?"
  - Two forces of 30 N and 40 N act on an object at right angles. Calculate the resultant force.
  - A 5 kg box rests on a table. Draw a free body diagram showing all forces.
real_world_context: 'Vehicle safety, construction, sports equipment design, ergonomics, machinery operation'
---

# Dynamik Tasks

Create physics problems that explore the relationship between forces and motion using Newton's laws. Problems should help students understand how forces cause acceleration, analyze force equilibrium situations, and apply force concepts to real-world scenarios.

**Vary the problem structure:**
- **Newton's Second Law calculations** using $F = m \cdot a$: Calculate force, mass, or acceleration in scenarios involving vehicles, moving objects, or applied forces
- **Force equilibrium problems** using $\sum F = 0$: Analyze objects at rest or moving at constant velocity, where all forces balance (hanging objects, objects on surfaces, tension scenarios)
- **Vector addition of forces**: Calculate resultant force when multiple forces act on an object at different angles using vector addition, Pythagorean theorem for perpendicular forces
- **Friction force analysis** using $F_R = \mu \cdot F_N$: Calculate friction forces for objects sliding or rolling on surfaces, compare static and kinetic friction, analyze braking distances
- **Inclined plane problems**: Analyze forces on objects on slopes, resolve weight into parallel and perpendicular components, calculate sliding conditions
- **Spring force applications** using Hooke's law $F = D \cdot s$: Calculate spring force or extension for springs in everyday objects, trampolines, or vehicle suspension
- **Free body diagrams**: Present scenarios and ask students to identify and draw all forces acting on an object (weight, normal force, friction, applied force, tension)
- **Newton's Third Law scenarios**: Identify action-reaction force pairs in various situations (rocket propulsion, walking, swimming, collisions)

**Vary the content/context:**
- **Traffic and vehicles**: Car acceleration and braking, motorcycle cornering, bicycle friction, emergency stops, safety distances, truck loading limits
- **Sports**: Ball throwing forces, friction in ice skating, gymnastic equipment forces, climbing rope tension, ski slope forces
- **Everyday activities**: Pushing shopping carts, pulling suitcases, lifting boxes, opening doors, sitting on chairs
- **Construction**: Crane lifting, ramp loading, scaffolding stability, pulley systems, material transport
- **Tools and equipment**: Hammer strikes, wrench forces, spring scales, door closers, suspension systems
- **Nature**: Friction in animal locomotion, wind forces on trees, friction in avalanches

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 14): Simple one-dimensional force problems, basic $F = ma$ calculations with whole numbers, conceptual understanding of forces, simple free body diagrams with 2-3 forces
- **For middle ages** ({{age}} 14-15): Two-dimensional force problems with perpendicular forces, vector addition using Pythagorean theorem, friction calculations, more complex free body diagrams
- **For older ages** ({{age}} >= 15): Forces at arbitrary angles requiring trigonometric resolution, combined friction and incline problems, complex equilibrium with multiple forces, quantitative Hooke's law applications

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for Newton's laws: $F = m \cdot a$, $F_R = \mu \cdot F_N$, $F = D \cdot s$
- Block for force equilibrium:

$$\sum F_x = 0$$

$$\sum F_y = 0$$

$$F_{res} = \sqrt{F_1^2 + F_2^2}$$

**Tables for force analysis:**

| Force Type | Magnitude (N) | Direction |
|------------|---------------|-----------|
| Weight     | 50            | downward  |
| Normal     | 50            | upward    |
| Applied    | 20            | right     |
| Friction   | 15            | left      |

**SVG diagrams for force visualization:**

Use SVG to show:
- Free body diagrams with force vectors (arrows) and labels
- Inclined planes with weight components (parallel and perpendicular)
- Multiple forces acting at different angles
- Vector addition diagrams (parallelogram or triangle method)
- Spring compression/extension with force indicators

Example SVG for free body diagram:
```svg
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Object (box) -->
  <rect x="175" y="175" width="50" height="50" fill="#3b82f6" stroke="black" stroke-width="2"/>
  <!-- Force vectors with arrows -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="red"/>
    </marker>
  </defs>
  <!-- Weight (down) -->
  <line x1="200" y1="225" x2="200" y2="300" stroke="red" stroke-width="3" marker-end="url(#arrowhead)"/>
  <text x="210" y="270" fill="red" font-size="14">F_G = 100N</text>
  <!-- Normal force (up) -->
  <line x1="200" y1="175" x2="200" y2="100" stroke="green" stroke-width="3" marker-end="url(#arrowhead)"/>
  <text x="210" y="130" fill="green" font-size="14">F_N = 100N</text>
  <!-- Applied force (right) -->
  <line x1="225" y1="200" x2="300" y2="200" stroke="blue" stroke-width="3" marker-end="url(#arrowhead)"/>
  <text x="250" y="190" fill="blue" font-size="14">F = 50N</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Single force calculation using $F = ma$, one-dimensional problems, all values given, simple contexts, conceptual force identification
- **Medium**: Two forces to combine, one vector addition problem, friction calculations, simple incline problems without trigonometry, equilibrium of 3-4 forces
- **Hard**: Multiple forces at various angles, trigonometric resolution of forces, combined friction and incline, complex equilibrium, spring systems, multi-step reasoning

**Include variety in numerical values:**
- Different masses: 0.5 kg, 15 kg, 1200 kg, 75 kg
- Vary forces: 8 N, 150 N, 2500 N, 45 N
- Various accelerations: 1.5 m/s², 0.8 m/s², 9.81 m/s², 3.2 m/s²
- Friction coefficients: μ = 0.1, 0.3, 0.5, 0.8
- Spring constants: D = 50 N/m, 200 N/m, 1000 N/m
- Angles for inclines: 15°, 30°, 45°
- Ensure diverse numerical results to promote understanding over memorization
