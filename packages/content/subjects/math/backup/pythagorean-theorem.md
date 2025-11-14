---
id: pythagorean-theorem
name: Pythagorean Theorem
description: Understanding and applying the Pythagorean theorem in right triangles
grade: 8
ages:
  - 13
  - 15
focus: Pythagorean theorem a² + b² = c², cathetus theorem, altitude theorem, applications in 2D and 3D, distance formula
difficulty: medium
learning_objectives:
  - State and prove the Pythagorean theorem
  - Calculate unknown sides in right triangles
  - Apply the converse to determine if triangles are right triangles
  - Use the theorem in 2D and 3D contexts
  - Solve real-world problems using the theorem
prerequisites: []
example_tasks:
  - A right triangle has legs of 3 cm and 4 cm. Calculate the length of the hypotenuse
  - A ladder is 5 m long and leans against a wall with its base 3 m from the wall. How high does it reach?
  - Determine if a triangle with sides 7 cm, 24 cm, and 25 cm is a right triangle
real_world_context: Construction measurements, navigation, ladder problems, diagonal distances, surveying
---

# Pythagorean Theorem Tasks

Create mathematics problems that explore the Pythagorean theorem in right triangles. Problems should help students calculate unknown sides, verify right triangles, and apply the theorem to real-world situations in 2D and 3D contexts.

**Vary the problem structure:**
- **Calculate hypotenuse**: Given two legs (catheti) a and b, calculate hypotenuse c using $c = \sqrt{a^2 + b^2}$
- **Calculate leg (cathetus)**: Given hypotenuse c and one leg a, calculate other leg b using $b = \sqrt{c^2 - a^2}$
- **Verify right triangle**: Given three side lengths, check if $a^2 + b^2 = c^2$ to determine if triangle is right-angled
- **Rectangle diagonals**: Calculate diagonal of rectangle with given length and width
- **Square diagonals**: Calculate diagonal of square with given side length using $d = s\sqrt{2}$
- **Ladder problems**: Ladder leaning against wall - given height and distance from wall, find ladder length, or given ladder length and one dimension, find the other
- **Distance in coordinate plane**: Calculate distance between two points $(x_1, y_1)$ and $(x_2, y_2)$ using $d = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$
- **3D space diagonals**: Calculate diagonal of cuboid/box using extension to 3D: $d = \sqrt{l^2 + w^2 + h^2}$
- **Cathetus theorem**: In right triangle with altitude to hypotenuse, calculate cathetus using $a^2 = c \cdot p$ where p is adjacent segment of hypotenuse
- **Altitude theorem**: Calculate altitude h to hypotenuse using $h^2 = p \cdot q$ where p and q are segments of hypotenuse

**Vary the content/context:**
- **Construction**: Ladder safety, roof pitch, ramp design, diagonal bracing, checking square corners
- **Navigation**: Direct distance vs. path distance, shortest route, map distances
- **Sports**: Baseball diamond distances, soccer field diagonals, climbing wall routes
- **Home and garden**: TV screen size (diagonal), picture frame diagonals, garden path shortcuts
- **Technology**: Screen resolutions, GPS distances, drone flight paths
- **Surveying**: Land measurement, property boundaries, indirect distance measurement

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 14): Use Pythagorean triples (3-4-5, 5-12-13, 8-15-17) or simple multiples, clear context with diagram, one-step calculation, whole number or simple decimal answers
- **For middle ages** ({{age}} 14-15): Any right triangle dimensions, require simplifying square roots, two-step problems (calculate one thing, then use it), coordinate plane applications, verify right triangles
- **For older ages** ({{age}} >= 16): 3D applications (space diagonals, pyramids), combined with other geometry (similar triangles, trigonometry), algebraic side lengths, cathetus and altitude theorems, complex multi-step problems

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for theorem: $a^2 + b^2 = c^2$, distance formula $d = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$
- Block for key formulas:

$$c = \sqrt{a^2 + b^2}$$

$$a^2 = c \cdot p \text{ (Cathetus theorem)}$$

$$h^2 = p \cdot q \text{ (Altitude theorem)}$$

**Tables for Pythagorean triples:**

| Leg a | Leg b | Hypotenuse c |
|-------|-------|--------------|
| 3 | 4 | 5 |
| 5 | 12 | 13 |
| 8 | 15 | 17 |

**SVG diagrams for right triangles:**

Use SVG to show:
- Right triangles with labeled sides a, b, c and right angle marker
- Ladder against wall scenarios with measurements
- Rectangles or squares with diagonals
- Coordinate plane with two points and distance
- 3D box/cuboid with space diagonal
- Right triangle with altitude to hypotenuse showing segments p and q

Example SVG for right triangle with ladder:
```svg
<svg viewBox="0 0 400 350" xmlns="http://www.w3.org/2000/svg">
  <!-- Wall -->
  <line x1="100" y1="50" x2="100" y2="300" stroke="#64748b" stroke-width="4"/>
  <!-- Ground -->
  <line x1="50" y1="300" x2="350" y2="300" stroke="#64748b" stroke-width="4"/>
  <!-- Ladder -->
  <line x1="100" y1="100" x2="280" y2="300" stroke="#3b82f6" stroke-width="3"/>
  <!-- Right angle marker -->
  <rect x="100" y="280" width="20" height="20" fill="none" stroke="#ef4444" stroke-width="2"/>
  <!-- Labels -->
  <text x="190" y="220" font-size="18" fill="#3b82f6">c = ?</text>
  <text x="60" y="200" font-size="16">a = 4 m</text>
  <text x="180" y="320" font-size="16">b = 3 m</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Pythagorean triples or simple multiples, one-step calculation (find hypotenuse or leg), whole number answers, clear context with all needed values given
- **Medium**: Non-triple dimensions requiring calculator for square root, two-step problems, coordinate plane applications, verify if triangle is right-angled, rectangle/square diagonals
- **Hard**: 3D space diagonals, cathetus or altitude theorems, algebraic side lengths (e.g., sides are x, 2x, and 5), combined with area or perimeter calculations, multi-step problem-solving

**Include variety in numerical values:**
- Pythagorean triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25 and their multiples (6-8-10, 9-12-15)
- Non-triple legs: 5-7, 6-9, 4-11, 3-8 (require calculator)
- Different contexts: ladders 2-10 m, room dimensions 3-12 m, coordinate points (1,2) to (7,10)
- 3D dimensions: boxes 4×3×2 m, 6×5×3 m, 10×8×5 cm
- Ensure different numerical answers each time
- Use realistic values: construction measurements in meters, room dimensions in meters, screen sizes in inches or cm
