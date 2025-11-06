---
id: right-triangle-trigonometry
name: Trigonometry in Right Triangles
description: Using sine, cosine, and tangent ratios to solve right triangle problems
grade: 9
ages:
  - 14
  - 15
  - 16
focus: SOH-CAH-TOA definitions, calculating sides using trig ratios, calculating angles using inverse functions, angle of elevation and depression, applications
difficulty: medium
learning_objectives:
  - Define sine, cosine, and tangent ratios
  - Calculate unknown sides using trigonometric ratios
  - Calculate unknown angles using inverse trigonometric functions
  - Apply trigonometry to real-world problems
  - Understand the relationship between ratios and unit circle
prerequisites: []
example_tasks:
  - In a right triangle with angle 30° and hypotenuse 10 cm, find the opposite side
  - A ladder makes a 65° angle with the ground. If it reaches 5 m up the wall, how long is the ladder?
  - A ramp rises 2 m over a horizontal distance of 12 m. What is the angle of inclination?
real_world_context: Navigation, surveying, architecture, ramp design, height measurement, angle of inclination
---

# Trigonometry in Right Triangles Tasks

Create mathematics problems that explore trigonometric ratios in right triangles. Problems should help students use sine, cosine, and tangent to calculate unknown sides and angles, and apply trigonometry to real-world situations.

**Vary the problem structure:**
- **Calculate opposite side**: Given angle and hypotenuse, use $\sin(\theta) = \frac{\text{opposite}}{\text{hypotenuse}}$ to find opposite side
- **Calculate adjacent side**: Given angle and hypotenuse, use $\cos(\theta) = \frac{\text{adjacent}}{\text{hypotenuse}}$ to find adjacent side
- **Calculate opposite from adjacent**: Given angle and adjacent side, use $\tan(\theta) = \frac{\text{opposite}}{\text{adjacent}}$ to find opposite side
- **Calculate hypotenuse from opposite**: Given angle and opposite side, rearrange $\sin(\theta) = \frac{\text{opposite}}{\text{hypotenuse}}$ to find hypotenuse: $\text{hypotenuse} = \frac{\text{opposite}}{\sin(\theta)}$
- **Calculate hypotenuse from adjacent**: Given angle and adjacent side, use $\cos(\theta) = \frac{\text{adjacent}}{\text{hypotenuse}}$ to find hypotenuse: $\text{hypotenuse} = \frac{\text{adjacent}}{\cos(\theta)}$
- **Calculate adjacent from opposite**: Given angle and opposite side, use $\tan(\theta) = \frac{\text{opposite}}{\text{adjacent}}$ to find adjacent: $\text{adjacent} = \frac{\text{opposite}}{\tan(\theta)}$
- **Calculate angle from sides**: Given two sides, use inverse functions $\theta = \sin^{-1}(\frac{\text{opposite}}{\text{hypotenuse}})$, $\theta = \cos^{-1}(\frac{\text{adjacent}}{\text{hypotenuse}})$, or $\theta = \tan^{-1}(\frac{\text{opposite}}{\text{adjacent}})$
- **Angle of elevation**: Observer looks up at angle - horizontal distance and angle given, find height
- **Angle of depression**: Observer looks down at angle - height and angle given, find horizontal distance
- **Two-step problems**: Calculate one side using trigonometry, then use Pythagorean theorem or another trig ratio for second unknown

**Vary the content/context:**
- **Architecture and construction**: Roof pitch, ramp angles, staircase design, building heights
- **Ladders**: Ladder against wall - angle, height reached, length of ladder relationships
- **Navigation**: Ship navigation, bearing calculations, distance calculations, lighthouse problems
- **Surveying**: Measuring heights of trees, buildings, mountains using angle of elevation
- **Aviation**: Airplane descent angle, altitude calculations, glide slope
- **Engineering**: Slope of roads, bridge design, structural angles
- **Sports**: Ski slope angles, diving board angles, projectile launch angles

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 15): Standard angles (30°, 45°, 60°) and common angles (25°, 35°, 50°), direct one-step calculation using one trig ratio, clear diagram with right angle marked, given angle and one side to find another side
- **For middle ages** ({{age}} 15-16): Any angle requiring calculator, calculate angles using inverse functions, two-step problems (trig + Pythagorean theorem), angle of elevation/depression problems, choose correct trig ratio from context
- **For older ages** ({{age}} >= 17): Multi-step problems requiring multiple trig ratios, 3D applications (angle in a pyramid, angle between line and plane), combine with other geometry concepts, word problems requiring triangle setup from description, optimization problems

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for definitions: $\sin(\theta) = \frac{\text{opp}}{\text{hyp}}$, $\cos(\theta) = \frac{\text{adj}}{\text{hyp}}$, $\tan(\theta) = \frac{\text{opp}}{\text{adj}}$
- Block for key relationships:

$$\sin(\theta) = \frac{\text{opposite}}{\text{hypotenuse}}$$

$$\cos(\theta) = \frac{\text{adjacent}}{\text{hypotenuse}}$$

$$\tan(\theta) = \frac{\text{opposite}}{\text{adjacent}}$$

$$\theta = \tan^{-1}\left(\frac{\text{opposite}}{\text{adjacent}}\right)$$

**Tables for special angles:**

| Angle | sin | cos | tan |
|-------|-----|-----|-----|
| 30° | 0.5 | 0.866 | 0.577 |
| 45° | 0.707 | 0.707 | 1 |
| 60° | 0.866 | 0.5 | 1.732 |

**SVG diagrams for right triangles:**

Use SVG to show:
- Right triangle with labeled sides (opposite, adjacent, hypotenuse) relative to marked angle
- Ladder against wall with angle and dimensions
- Angle of elevation from ground observer to top of object
- Angle of depression from elevated position to ground object
- Ramp with horizontal distance, vertical rise, and angle marked
- SOH-CAH-TOA memory aid diagram

Example SVG for angle of elevation:
```svg
<svg viewBox="0 0 450 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Ground -->
  <line x1="50" y1="250" x2="400" y2="250" stroke="#64748b" stroke-width="2"/>
  <!-- Building -->
  <line x1="350" y1="250" x2="350" y2="100" stroke="#64748b" stroke-width="3"/>
  <!-- Line of sight -->
  <line x1="100" y1="250" x2="350" y2="100" stroke="#3b82f6" stroke-width="2" stroke-dasharray="5,5"/>
  <!-- Angle arc -->
  <path d="M 150 250 Q 160 235 165 228" fill="none" stroke="#ef4444" stroke-width="2"/>
  <!-- Right angle -->
  <rect x="330" y="230" width="20" height="20" fill="none" stroke="#000" stroke-width="1"/>
  <!-- Labels -->
  <text x="110" y="240" font-size="14" fill="#ef4444">θ</text>
  <text x="220" y="275" font-size="14">Distance = d</text>
  <text x="360" y="175" font-size="14">Height = h</text>
  <circle cx="100" cy="250" r="5" fill="#ef4444"/>
  <text x="80" y="270" font-size="12">Observer</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Standard angles (30°, 45°, 60°), one-step calculation with one trig ratio, all needed information clearly labeled in diagram, calculate side when angle and another side given, whole number or simple decimal answers
- **Medium**: Any angle requiring calculator, calculate angles using inverse trig functions, two-step problems, angle of elevation or depression contexts, choose appropriate trig ratio from word problem, decimal answers requiring rounding
- **Hard**: Multi-step problems using multiple trig ratios, 3D applications, combine trigonometry with Pythagorean theorem or other geometry, minimal diagrams requiring student to identify right triangle and label sides, complex word problems, optimization

**Include variety in numerical values:**
- Common angles: 30°, 35°, 40°, 45°, 50°, 55°, 60°, 65°, 70°
- Special angles for easy problems: 30°, 45°, 60°
- Side lengths: 5-25 cm for triangles, 3-15 m for ladders/buildings, 50-200 m for surveying
- Hypotenuse: 10-30 cm for basic problems, 5-20 m for ladder problems
- Heights: 2-12 m for buildings, 15-50 m for trees, 100-500 m for mountains
- Horizontal distances: 10-100 m depending on context
- Ensure different combinations of given information (angle + opposite, angle + adjacent, angle + hypotenuse, two sides for finding angle)
- Use realistic values for contexts: ladder lengths 3-8 m, building heights 5-50 m, ramp slopes 5-15°
- Vary which side or angle is unknown to prevent pattern recognition
