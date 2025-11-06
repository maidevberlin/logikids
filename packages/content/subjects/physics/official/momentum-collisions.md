---
id: momentum-collisions
name: Momentum and Collisions
description: 'Momentum conservation in collision processes and two-dimensional motion analysis'
grade: 10
ages:
  - 15
  - 16
  - 17
focus: 'Momentum, impulse (F·Δt = m·Δv), collisions in one and two dimensions, momentum conservation, Newton''s third law, rocket principle'
difficulty: hard
learning_objectives:
  - Apply momentum conservation law
  - Analyze elastic and inelastic collisions
  - Understand Newton's third law in collision contexts
  - Distinguish between momentum conservation and force equilibrium
prerequisites:
  - kinematics
  - dynamics
  - mechanical-energy
example_tasks:
  - Two ice hockey pucks collide. One (0.5 kg, 4 m/s) hits another at rest (0.5 kg). Calculate velocities after elastic collision.
  - A 1200 kg car traveling at 15 m/s collides with a stationary 800 kg car. If they stick together, what is their common velocity?
  - Calculate the impulse experienced by a 0.4 kg ball when hit by a bat, changing its velocity from 20 m/s to -25 m/s.
real_world_context: 'Vehicle collision safety, sports ball impacts, rocket propulsion, particle physics, billiards and bowling'
---

# Impuls und Stoßprozesse Tasks

Create physics problems that explore momentum and collision processes. Problems should help students understand momentum conservation, analyze different types of collisions, distinguish between elastic and inelastic collisions, and apply impulse concepts to real-world scenarios.

**Vary the problem structure:**
- **Momentum calculations** using $p = m \cdot v$: Calculate momentum for moving objects, compare momenta of different objects, understand momentum as vector quantity
- **Impulse calculations** using $J = F \cdot \Delta t = \Delta p = m \cdot \Delta v$: Determine impulse during impacts, relate force, time, and velocity change
- **Elastic collision in one dimension**: Two objects collide and bounce apart, conserving both momentum and kinetic energy; calculate final velocities using $m_1v_1 + m_2v_2 = m_1v_1' + m_2v_2'$ and energy conservation
- **Inelastic collision (objects stick together)**: Two objects collide and move together afterward; use $m_1v_1 + m_2v_2 = (m_1 + m_2)v'$ to find common final velocity
- **Collision with stationary object**: One moving object hits another at rest, analyze resulting motion for elastic vs. inelastic cases
- **Explosion/separation problems**: Single object splits into two parts (rocket stages, recoil), use momentum conservation from zero initial momentum
- **Two-dimensional collisions** (for older students): Analyze collisions where objects move at angles, conserve momentum separately in x and y directions
- **Recoil scenarios**: Calculate recoil velocity of gun when bullet is fired, boat when person jumps off, applying Newton's third law and momentum conservation

**Vary the content/context:**
- **Vehicle collisions**: Car crashes (safety analysis), bumper cars, train coupling, crash test scenarios, collision safety features (crumple zones, airbags)
- **Sports**: Billiard ball collisions, bowling pins, ice hockey puck impacts, tennis/baseball bat-ball collisions, soccer ball kicks
- **Space and rockets**: Rocket propulsion (fuel ejection), astronaut maneuvering in space, satellite separation
- **Ice skating**: Skaters pushing off each other, demonstrating momentum conservation on nearly frictionless surface
- **Everyday impacts**: Hammer hitting nail, shopping cart collisions, door closing impacts
- **Scientific experiments**: Newton's cradle, collision demonstrations, particle collision experiments

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 16): One-dimensional collisions only, simple inelastic collisions (sticking together), equal masses for easier calculations, whole number values, focus on conceptual understanding of momentum conservation
- **For middle ages** ({{age}} 16-17): Elastic collisions in one dimension with different masses, impulse calculations, recoil problems, more complex numerical values, distinguish elastic vs. inelastic
- **For older ages** ({{age}} >= 17): Two-dimensional collisions requiring vector component analysis, combined momentum-energy problems, complex multi-object scenarios, relativistic momentum concepts (qualitative)

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for momentum: $p = m \cdot v$, $J = F \cdot \Delta t$, $\sum p_{before} = \sum p_{after}$
- Block for collision equations:

$$m_1 \vec{v}_1 + m_2 \vec{v}_2 = m_1 \vec{v}_1' + m_2 \vec{v}_2'$$

$$J = \Delta p = m(v_2 - v_1)$$

For elastic collisions:
$$\frac{1}{2}m_1v_1^2 + \frac{1}{2}m_2v_2^2 = \frac{1}{2}m_1v_1'^2 + \frac{1}{2}m_2v_2'^2$$

**Tables for collision analysis:**

| Object | Mass (kg) | Initial Velocity (m/s) | Final Velocity (m/s) | Initial p (kg·m/s) | Final p (kg·m/s) |
|--------|-----------|------------------------|----------------------|-------------------|------------------|
| Car 1  | 1200      | 15                     | ?                    | 18000             | ?                |
| Car 2  | 800       | 0                      | ?                    | 0                 | ?                |
| Total  | 2000      | -                      | -                    | 18000             | 18000            |

**SVG diagrams for collision scenarios:**

Use SVG to show:
- Before/after collision diagrams with velocity vectors
- Momentum vector diagrams showing conservation
- Two-dimensional collision with x and y components
- Explosion diagrams showing momentum in opposite directions
- Timeline showing collision sequence

Example SVG for collision:
```svg
<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Before collision -->
  <text x="100" y="30" font-size="16" font-weight="bold">Before:</text>
  <rect x="80" y="50" width="40" height="30" fill="#3b82f6" stroke="black" stroke-width="2"/>
  <text x="85" y="70" font-size="12" fill="white">m₁</text>
  <line x1="120" y1="65" x2="180" y2="65" stroke="red" stroke-width="3" marker-end="url(#arrow)"/>
  <text x="130" y="55" font-size="12">v₁</text>

  <rect x="220" y="50" width="40" height="30" fill="#10b981" stroke="black" stroke-width="2"/>
  <text x="225" y="70" font-size="12" fill="white">m₂</text>
  <text x="270" y="70" font-size="12">v₂=0</text>

  <!-- After collision -->
  <text x="400" y="30" font-size="16" font-weight="bold">After:</text>
  <rect x="360" y="50" width="40" height="30" fill="#3b82f6" stroke="black" stroke-width="2"/>
  <line x1="400" y1="65" x2="450" y2="65" stroke="red" stroke-width="3" marker-end="url(#arrow)"/>
  <text x="410" y="55" font-size="12">v₁'</text>

  <rect x="480" y="50" width="40" height="30" fill="#10b981" stroke="black" stroke-width="2"/>
  <line x1="520" y1="65" x2="570" y2="65" stroke="red" stroke-width="3" marker-end="url(#arrow)"/>
  <text x="530" y="55" font-size="12">v₂'</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Simple inelastic collision (sticking together), one-dimensional, one object initially at rest, equal masses, straightforward momentum conservation
- **Medium**: Elastic collisions in one dimension, unequal masses, both objects moving initially, impulse calculations, recoil problems
- **Hard**: Two-dimensional collisions with vector components, combined momentum and energy conservation for elastic collisions, multi-step collision sequences, angle calculations

**Include variety in numerical values:**
- Different masses: 0.15 kg, 2 kg, 60 kg, 1500 kg, 0.5 kg
- Vary initial velocities: 3 m/s, 18 m/s, -10 m/s (opposite direction), 25 m/s
- Various momentum values: 15 kg·m/s, 450 kg·m/s, 6000 kg·m/s
- Force magnitudes: 500 N, 2500 N, 50 N, 12000 N
- Impact times: 0.01 s, 0.05 s, 0.2 s, 2 s
- Angles for 2D collisions: 30°, 45°, 60°, 90°
- Ensure varied numerical results, including negative velocities (opposite direction)
- Use realistic values for contexts (tennis ball: 0.06 kg, car: 1000-2000 kg, bullet: 0.01 kg)
