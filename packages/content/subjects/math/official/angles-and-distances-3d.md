---
id: angles-and-distances-3d
name: Angles and Distances in 3D
description: Vectors and analytical geometry
grade: 12
ages:
  - 17
  - 18
focus: Vectors and analytical geometry
difficulty: hard
learning_objectives:
  - Calculate all types of angles in 3D (vector-vector, line-line, line-plane, plane-plane)
  - Calculate all types of distances in 3D (point-point, point-line, point-plane, line-line, line-plane, plane-plane)
  - Apply distance and angle formulas to complex geometric problems
  - Solve optimization problems involving distances and angles
prerequisites:
  - vectors-basics
  - scalar-product
  - cross-product
  - lines-in-space
  - planes-in-space
example_tasks:
  - Calculate shortest distance between skew lines
  - Find angle between line and plane
  - Determine closest point on plane to given point
real_world_context: Distance and angle calculations are essential in navigation, robotics, collision detection, architectural design, crystallography, and computer-aided design (CAD) systems.
---

# Angles and Distances in 3D

Create comprehensive problems for calculating various angles and distances in three-dimensional space, synthesizing concepts from vectors, lines, and planes.

## Problem Variations - ANGLES

### 1. Angle Between Two Vectors
Calculate the angle between vectors:
$$\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix}, \quad \vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}$$

**Formula:**
$$\cos(\varphi) = \frac{\vec{a} \cdot \vec{b}}{|\vec{a}| \cdot |\vec{b}|}$$

**Steps:**
1. Calculate $\vec{a} \cdot \vec{b}$
2. Calculate $|\vec{a}|$ and $|\vec{b}|$
3. Calculate $\cos(\varphi)$
4. Find $\varphi = \arccos\left(\frac{\vec{a} \cdot \vec{b}}{|\vec{a}| \cdot |\vec{b}|}\right)$

Give answer in both degrees and radians.

### 2. Angle Between Two Lines
Calculate the angle between lines:
$$g: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + s\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$$
$$h: \vec{r} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix} + t\begin{pmatrix} {{e1}} \\ {{e2}} \\ {{e3}} \end{pmatrix}$$

**Formula (acute angle):**
$$\cos(\varphi) = \frac{|\vec{d} \cdot \vec{e}|}{|\vec{d}| \cdot |\vec{e}|}$$

**Note:** Use absolute value to ensure angle is between 0° and 90°.

a) Calculate the angle
b) Are the lines perpendicular? (Check if $\vec{d} \cdot \vec{e} = 0$)
c) Are the lines parallel? (Check if $\vec{d} = k\vec{e}$)

### 3. Angle Between Line and Plane
Calculate the angle between line and plane:
$$g: \vec{r} = \begin{pmatrix} {{lx}} \\ {{ly}} \\ {{lz}} \end{pmatrix} + t\begin{pmatrix} {{dx}} \\ {{dy}} \\ {{dz}} \end{pmatrix}$$
$$E: {{a}}x + {{b}}y + {{c}}z = {{d}}$$

**Formula:**
$$\sin(\varphi) = \frac{|\vec{d} \cdot \vec{n}|}{|\vec{d}| \cdot |\vec{n}|}$$

where $\vec{d}$ is the line direction and $\vec{n} = \begin{pmatrix} {{a}} \\ {{b}} \\ {{c}} \end{pmatrix}$ is the plane normal.

**Steps:**
1. Calculate $\vec{d} \cdot \vec{n}$
2. Calculate $|\vec{d}|$ and $|\vec{n}|$
3. Calculate $\sin(\varphi)$
4. Find $\varphi = \arcsin\left(\frac{|\vec{d} \cdot \vec{n}|}{|\vec{d}| \cdot |\vec{n}|}\right)$

**Special cases:**
- $\varphi = 0°$: line is parallel to plane
- $\varphi = 90°$: line is perpendicular to plane

### 4. Angle Between Two Planes
Calculate the angle between planes:
$$E_1: {{a1}}x + {{b1}}y + {{c1}}z = {{d1}}$$
$$E_2: {{a2}}x + {{b2}}y + {{c2}}z = {{d2}}$$

**Formula:**
$$\cos(\varphi) = \frac{|\vec{n}_1 \cdot \vec{n}_2|}{|\vec{n}_1| \cdot |\vec{n}_2|}$$

**Steps:**
1. Identify normal vectors: $\vec{n}_1 = \begin{pmatrix} {{a1}} \\ {{b1}} \\ {{c1}} \end{pmatrix}$, $\vec{n}_2 = \begin{pmatrix} {{a2}} \\ {{b2}} \\ {{c2}} \end{pmatrix}$
2. Calculate the angle (use absolute value for acute angle)
3. Check special cases:
   - Parallel: $\vec{n}_1 = k\vec{n}_2$
   - Perpendicular: $\vec{n}_1 \cdot \vec{n}_2 = 0$

### 5. Angle in Triangle (3D)
Given triangle with vertices $A({{x1}}, {{y1}}, {{z1}})$, $B({{x2}}, {{y2}}, {{z2}})$, $C({{x3}}, {{y3}}, {{z3}})$.

Calculate all three interior angles:

**Angle at $A$ (angle $\angle BAC$):**
$$\cos(\alpha) = \frac{\vec{AB} \cdot \vec{AC}}{|\vec{AB}| \cdot |\vec{AC}|}$$

**Angle at $B$ (angle $\angle ABC$):**
$$\cos(\beta) = \frac{\vec{BA} \cdot \vec{BC}}{|\vec{BA}| \cdot |\vec{BC}|}$$

**Angle at $C$ (angle $\angle ACB$):**
$$\cos(\gamma) = \frac{\vec{CA} \cdot \vec{CB}}{|\vec{CA}| \cdot |\vec{CB}|}$$

Verify: $\alpha + \beta + \gamma = 180°$

## Problem Variations - DISTANCES

### 6. Distance Between Two Points
Calculate the distance between points $A({{x1}}, {{y1}}, {{z1}})$ and $B({{x2}}, {{y2}}, {{z2}})$.

**Formula:**
$$d = |\vec{AB}| = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}$$

**Steps:**
1. Calculate $\vec{AB}$
2. Calculate $|\vec{AB}|$

**Application:** This is the most fundamental distance formula in 3D.

### 7. Distance from Point to Line
Calculate the distance from point $P({{px}}, {{py}}, {{pz}})$ to line:
$$g: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + t\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$$

**Formula using cross product:**
$$d = \frac{|\vec{AP} \times \vec{d}|}{|\vec{d}|}$$

where $A$ is any point on the line (use the position vector).

**Steps:**
1. Calculate $\vec{AP} = \vec{OP} - \vec{OA}$
2. Calculate $\vec{AP} \times \vec{d}$
3. Calculate $|\vec{AP} \times \vec{d}|$ and $|\vec{d}|$
4. Divide: $d = \frac{|\vec{AP} \times \vec{d}|}{|\vec{d}|}$

**Alternative method:** Find foot of perpendicular and calculate distance directly.

### 8. Distance from Point to Plane
Calculate the distance from point $P({{px}}, {{py}}, {{pz}})$ to plane:
$$E: {{a}}x + {{b}}y + {{c}}z = {{d}}$$

**Formula:**
$$d = \frac{|ax_P + by_P + cz_P - d|}{\sqrt{a^2 + b^2 + c^2}} = \frac{|ax_P + by_P + cz_P - d|}{|\vec{n}|}$$

**Steps:**
1. Calculate numerator: $|{{a}} \cdot {{px}} + {{b}} \cdot {{py}} + {{c}} \cdot {{pz}} - {{d}}|$
2. Calculate denominator: $|\vec{n}| = \sqrt{{{a}}^2 + {{b}}^2 + {{c}}^2}$
3. Divide to get distance

**Verification:** Find foot of perpendicular and verify distance matches.

### 9. Distance Between Two Parallel Lines
Calculate the distance between parallel lines:
$$g: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + s\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$$
$$h: \vec{r} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix} + t\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$$

**Method:**
Since lines are parallel with direction $\vec{d}$, the distance is the distance from any point on one line to the other line.

1. Choose point $A$ on line $g$ (use position vector)
2. Calculate distance from $A$ to line $h$ using cross product formula

**Alternative:**
$$d = \frac{|\vec{AB} \times \vec{d}|}{|\vec{d}|}$$

where $A$ is on $g$ and $B$ is on $h$.

### 10. Distance Between Two Skew Lines
Calculate the shortest distance between skew lines:
$$g: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + s\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$$
$$h: \vec{r} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix} + t\begin{pmatrix} {{e1}} \\ {{e2}} \\ {{e3}} \end{pmatrix}$$

**First verify the lines are skew:**
1. Direction vectors not parallel: $\vec{d} \neq k\vec{e}$
2. Lines don't intersect (system has no solution)

**Formula:**
$$d = \frac{|\vec{AB} \cdot (\vec{d} \times \vec{e})|}{|\vec{d} \times \vec{e}|}$$

**Steps:**
1. Calculate $\vec{AB}$ (from point on $g$ to point on $h$)
2. Calculate $\vec{d} \times \vec{e}$ (cross product)
3. Calculate scalar triple product: $\vec{AB} \cdot (\vec{d} \times \vec{e})$
4. Calculate distance: $d = \frac{|scalar\ triple\ product|}{|\vec{d} \times \vec{e}|}$

### 11. Distance from Line to Parallel Plane
Calculate the distance between line and parallel plane:
$$g: \vec{r} = \begin{pmatrix} {{lx}} \\ {{ly}} \\ {{lz}} \end{pmatrix} + t\begin{pmatrix} {{dx}} \\ {{dy}} \\ {{dz}} \end{pmatrix}$$
$$E: {{a}}x + {{b}}y + {{c}}z = {{d}}$$

**First verify line is parallel to plane:**
Check if $\vec{d} \cdot \vec{n} = 0$ where $\vec{n} = \begin{pmatrix} {{a}} \\ {{b}} \\ {{c}} \end{pmatrix}$.

**Method:**
Distance is the distance from any point on the line to the plane.

1. Choose point $P$ on line (use position vector)
2. Calculate distance from $P$ to plane $E$

### 12. Distance Between Two Parallel Planes
Calculate the distance between parallel planes:
$$E_1: {{a}}x + {{b}}y + {{c}}z = {{d1}}$$
$$E_2: {{a}}x + {{b}}y + {{c}}z = {{d2}}$$

**Direct formula:**
$$d = \frac{|d_2 - d_1|}{\sqrt{a^2 + b^2 + c^2}}$$

**Verification method:**
1. Find a point $P$ on $E_1$ (set two coordinates to 0, solve for third)
2. Calculate distance from $P$ to $E_2$
3. Verify results match

## Problem Variations - COMBINED PROBLEMS

### 13. Closest Point Problems
Given point $P({{px}}, {{py}}, {{pz}})$:

a) Find closest point $F_g$ on line $g: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + t\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$

**Method:** Foot of perpendicular satisfies $\vec{F_gP} \cdot \vec{d} = 0$

b) Find closest point $F_E$ on plane $E: {{a}}x + {{b}}y + {{c}}z = {{d}}$

**Method:** Point on line through $P$ with direction $\vec{n}$ that intersects plane

c) Compare distances $|PF_g|$ and $|PF_E|$

### 14. Triangle in Space - Complete Analysis
Given triangle $ABC$ with vertices $A({{x1}}, {{y1}}, {{z1}})$, $B({{x2}}, {{y2}}, {{z2}})$, $C({{x3}}, {{y3}}, {{z3}})$.

Calculate:
a) All three side lengths: $|AB|$, $|BC|$, $|CA|$
b) All three interior angles
c) Area of triangle using $A = \frac{1}{2}|\vec{AB} \times \vec{AC}|$
d) Equation of plane containing the triangle
e) Distance from origin to the plane
f) Altitude from vertex $A$ (distance from $A$ to line $BC$)

**Verify:** Check that angles sum to 180° and that area formula matches Heron's formula.

### 15. Pyramid Volume and Surface Area
Given pyramid with apex $S({{sx}}, {{sy}}, {{sz}})$ and rectangular base with vertices $A({{x1}}, {{y1}}, {{z1}})$, $B({{x2}}, {{y2}}, {{z2}})$, $C({{x3}}, {{y3}}, {{z3}})$, $D({{x4}}, {{y4}}, {{z4}})$.

Calculate:
a) Height $h$ (distance from $S$ to base plane)
b) Base area $A_{base}$ using cross product
c) Volume: $V = \frac{1}{3}A_{base} \cdot h$
d) Angles between lateral faces and base
e) Length of all edges

### 16. Optimal Position Problem
A point $P$ moves along line $g: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + t\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$.

Find the position (value of $t$) where:
a) $P$ is closest to point $Q({{qx}}, {{qy}}, {{qz}})$
b) $P$ is closest to plane $E: {{a}}x + {{b}}y + {{c}}z = {{d}}$
c) The angle between $\vec{QP}$ and $\vec{d}$ is 90°

### 17. Shortest Path on Polyhedron
Given cube with vertices at $O(0,0,0)$, $A({{a}},0,0)$, $B({{a}},{{a}},0)$, etc.

An ant walks on the surface from point $P({{px}}, {{py}}, 0)$ on the bottom face to point $Q({{qx}}, {{qy}}, {{a}})$ on the top face.

a) Calculate straight-line distance through space
b) Find shortest path along surface (unfold cube and use straight line)
c) Compare the two distances

### 18. Angle and Distance Relationships
Given skew lines:
$$g: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + s\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$$
$$h: \vec{r} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix} + t\begin{pmatrix} {{e1}} \\ {{e2}} \\ {{e3}} \end{pmatrix}$$

Calculate:
a) Angle between the lines
b) Shortest distance between the lines
c) Find points $P$ on $g$ and $Q$ on $h$ where distance is minimum
d) Verify that $\vec{PQ} \perp \vec{d}$ and $\vec{PQ} \perp \vec{e}$

### 19. Tetrahedron Complete Analysis
Given tetrahedron $ABCD$ with vertices $A({{x1}}, {{y1}}, {{z1}})$, $B({{x2}}, {{y2}}, {{z2}})$, $C({{x3}}, {{y3}}, {{z3}})$, $D({{x4}}, {{y4}}, {{z4}})$.

Calculate:
a) All 6 edge lengths
b) Volume using $V = \frac{1}{6}|\vec{AB} \cdot (\vec{AC} \times \vec{AD})|$
c) Four face areas (triangles $ABC$, $ABD$, $ACD$, $BCD$)
d) Total surface area
e) Angles between opposite edges
f) Distances between opposite edges (if they're skew)

### 20. Reflection and Symmetry
Given point $P({{px}}, {{py}}, {{pz}})$ and plane $E: {{a}}x + {{b}}y + {{c}}z = {{d}}$:

a) Find the reflection $P'$ of $P$ across plane $E$
b) Calculate $|PP'|$ and verify it equals twice the distance from $P$ to $E$
c) Find the angle between $\vec{PP'}$ and the plane $E$ (should be 90°)
d) If line $g$ passes through $P$ at angle $\alpha$ to plane $E$, at what angle does the reflected line $g'$ meet the plane?

**Reflection property:** Angle of incidence equals angle of reflection.

## Task Requirements
- Combine multiple concepts (vectors, lines, planes, products)
- Use all three forms: parametric, vector, and coordinate
- Require both angle and distance calculations in same problem
- Include verification steps
- Mix pure geometry with optimization problems
- Use varied numerical values across generations
- Emphasize geometric visualization
- Show multiple solution methods where applicable
- Include real-world applications (physics, engineering, architecture)
- Require multi-step reasoning
- Connect algebraic formulas to geometric meaning
- Use appropriate units where applicable
- Include special cases (parallel, perpendicular, skew)
- Test understanding of when to use each formula
