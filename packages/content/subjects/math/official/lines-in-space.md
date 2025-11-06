---
id: lines-in-space
name: Lines in 3D Space
description: Vectors and analytical geometry
grade: 11
ages:
  - 16
  - 17
  - 18
  - 19
focus: Vectors and analytical geometry
difficulty: hard
learning_objectives:
  - Write parametric equations of lines in 3D
  - Determine if lines are parallel, intersecting, or skew
  - Find intersection points of lines
  - Calculate distances from points to lines
  - Determine angles between lines
prerequisites:
  - vectors-basics
  - scalar-product
example_tasks:
  - Write parametric equation for line through two points
  - Determine relationship between two lines (parallel, intersecting, skew)
  - Find distance from point to line
real_world_context: Lines in 3D space model trajectories in physics, light rays in optics, structural elements in engineering, and paths in 3D computer graphics and game development.
---

# Lines in 3D Space

Create diverse problems for understanding lines in three-dimensional space using parametric equations, including line relationships, intersections, distances, and angles.

## Problem Variations

### 1. Parametric Equation from Two Points
Find the parametric equation of the line through points $A({{x1}}, {{y1}}, {{z1}})$ and $B({{x2}}, {{y2}}, {{z2}})$.

**Parametric form:**
$$\vec{r} = \vec{a} + t\vec{d}$$

where $\vec{a}$ is a position vector (point on the line) and $\vec{d}$ is a direction vector.

**Steps:**
1. Choose $\vec{a} = \vec{OA} = \begin{pmatrix} {{x1}} \\ {{y1}} \\ {{z1}} \end{pmatrix}$ (use point $A$)
2. Calculate direction vector: $\vec{d} = \vec{AB} = \begin{pmatrix} {{x2}}-{{x1}} \\ {{y2}}-{{y1}} \\ {{z2}}-{{z1}} \end{pmatrix}$
3. Write equation: $\vec{r} = \begin{pmatrix} {{x1}} \\ {{y1}} \\ {{z1}} \end{pmatrix} + t\begin{pmatrix} ? \\ ? \\ ? \end{pmatrix}$, $t \in \mathbb{R}$

**Component form:**
$$x = {{x1}} + t \cdot ({{x2}}-{{x1}})$$
$$y = {{y1}} + t \cdot ({{y2}}-{{y1}})$$
$$z = {{z1}} + t \cdot ({{z2}}-{{z1}})$$

### 2. Point on a Line
Given line $g: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + t\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$

a) Determine if point $P({{px}}, {{py}}, {{pz}})$ lies on the line
b) If yes, find the parameter value $t$ for point $P$
c) If no, explain why not

**Method:**
Set up equations:
$${{a1}} + t \cdot {{d1}} = {{px}}$$
$${{a2}} + t \cdot {{d2}} = {{py}}$$
$${{a3}} + t \cdot {{d3}} = {{pz}}$$

If a consistent value of $t$ satisfies all three equations, then $P$ is on the line.

### 3. Parallel Lines
Determine if the following lines are parallel:
$$g: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + s\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$$
$$h: \vec{r} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix} + t\begin{pmatrix} {{e1}} \\ {{e2}} \\ {{e3}} \end{pmatrix}$$

**Parallel condition:**
Lines are parallel if their direction vectors are parallel: $\vec{d} = k\vec{e}$ for some scalar $k \neq 0$.

a) Check if direction vectors are parallel
b) If parallel, are the lines identical or distinct?
   - Identical: One point of line $h$ lies on line $g$
   - Distinct: No point of line $h$ lies on line $g$

### 4. Line Intersection
Determine if lines intersect and find the intersection point if it exists:
$$g: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + s\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$$
$$h: \vec{r} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix} + t\begin{pmatrix} {{e1}} \\ {{e2}} \\ {{e3}} \end{pmatrix}$$

**Method:**
Set equations equal:
$$\begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + s\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix} + t\begin{pmatrix} {{e1}} \\ {{e2}} \\ {{e3}} \end{pmatrix}$$

This gives three equations in two unknowns ($s$ and $t$):
1. ${{a1}} + s \cdot {{d1}} = {{b1}} + t \cdot {{e1}}$
2. ${{a2}} + s \cdot {{d2}} = {{b2}} + t \cdot {{e2}}$
3. ${{a3}} + s \cdot {{d3}} = {{b3}} + t \cdot {{e3}}$

**Steps:**
a) Solve first two equations for $s$ and $t$
b) Check if these values satisfy the third equation
c) If yes: lines intersect; find intersection point by substituting $s$ (or $t$) back
d) If no: lines are skew (do not intersect)

### 5. Skew Lines
Show that the following lines are skew (neither parallel nor intersecting):
$$g: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + s\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$$
$$h: \vec{r} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix} + t\begin{pmatrix} {{e1}} \\ {{e2}} \\ {{e3}} \end{pmatrix}$$

**Criteria for skew lines:**
1. Direction vectors are not parallel
2. Lines do not intersect

a) Verify direction vectors are not parallel
b) Set up intersection equations and show they have no solution
c) Therefore, lines are skew

### 6. Distance from Point to Line
Calculate the distance from point $P({{px}}, {{py}}, {{pz}})$ to line:
$$g: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + t\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$$

**Formula using cross product:**
$$d = \frac{|\vec{AP} \times \vec{d}|}{|\vec{d}|}$$

where $A$ is any point on the line (use the position vector).

**Steps:**
1. Find $\vec{AP} = \vec{OP} - \vec{OA}$
2. Calculate $\vec{AP} \times \vec{d}$ (cross product)
3. Calculate $|\vec{AP} \times \vec{d}|$ and $|\vec{d}|$
4. Distance: $d = \frac{|\vec{AP} \times \vec{d}|}{|\vec{d}|}$

**Alternative method:** Find the foot of perpendicular and calculate distance.

### 7. Foot of Perpendicular
Find the point $F$ on line $g: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + t\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$ that is closest to point $P({{px}}, {{py}}, {{pz}})$.

**Method:**
Point $F$ is on the line, so: $F = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + t\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$

The vector $\vec{FP}$ is perpendicular to direction vector $\vec{d}$:
$$\vec{FP} \cdot \vec{d} = 0$$

**Steps:**
1. Express $\vec{FP} = \vec{OP} - \vec{OF}$ in terms of $t$
2. Set $\vec{FP} \cdot \vec{d} = 0$ and solve for $t$
3. Substitute $t$ back to find coordinates of $F$
4. Calculate distance $d = |\vec{FP}|$

### 8. Angle Between Lines
Calculate the angle between lines:
$$g: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + s\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$$
$$h: \vec{r} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix} + t\begin{pmatrix} {{e1}} \\ {{e2}} \\ {{e3}} \end{pmatrix}$$

**Formula:**
$$\cos(\varphi) = \frac{|\vec{d} \cdot \vec{e}|}{|\vec{d}| \cdot |\vec{e}|}$$

**Note:** Use absolute value to get the acute angle (between 0° and 90°).

**Steps:**
1. Calculate $\vec{d} \cdot \vec{e}$
2. Calculate $|\vec{d}|$ and $|\vec{e}|$
3. Calculate $\cos(\varphi)$
4. Find angle $\varphi$

### 9. Symmetric Equation Form
Given line in parametric form:
$$g: \vec{r} = \begin{pmatrix} {{a}} \\ {{b}} \\ {{c}} \end{pmatrix} + t\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$$

Write the line in symmetric form (if possible).

**Symmetric form:**
$$\frac{x - {{a}}}{{{d1}}} = \frac{y - {{b}}}{{{d2}}} = \frac{z - {{c}}}{{{d3}}}$$

**Note:** This form is only valid if all direction components are non-zero.

a) Write the symmetric form
b) Verify by finding a point: set parameter equal to some value (e.g., 0, 1, 2)

### 10. Line Through Point Parallel to Another Line
Find the equation of line $h$ that passes through point $P({{px}}, {{py}}, {{pz}})$ and is parallel to line:
$$g: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + t\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$$

**Strategy:**
Parallel lines have the same (or proportional) direction vectors.

**Equation:**
$$h: \vec{r} = \begin{pmatrix} {{px}} \\ {{py}} \\ {{pz}} \end{pmatrix} + s\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$$

Verify that lines $g$ and $h$ are indeed parallel but distinct.

### 11. Line Through Point Perpendicular to Another Line
Find the equation of line $h$ through point $P({{px}}, {{py}}, {{pz}})$ that is perpendicular to line:
$$g: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + t\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$$

**Challenge:** In 3D, there are infinitely many lines through $P$ perpendicular to $g$. They form a plane!

**Specific solution:** Find the line through $P$ and the foot of perpendicular from $P$ to $g$.

**Steps:**
1. Find foot of perpendicular $F$ on line $g$ from point $P$ (see Problem 7)
2. Direction vector: $\vec{d}_h = \vec{PF}$
3. Write equation: $h: \vec{r} = \vec{OP} + s\vec{PF}$

### 12. Trajectory Problem (Physics)
A particle starts at position $A({{x1}}, {{y1}}, {{z1}})$ at time $t = 0$ and moves with constant velocity $\vec{v} = \begin{pmatrix} {{vx}} \\ {{vy}} \\ {{vz}} \end{pmatrix}$ m/s.

a) Write the position function $\vec{r}(t)$ (parametric equation with $t$ in seconds)
b) Find the position at time $t = {{time}}$ seconds
c) At what time does the particle reach point $B({{x2}}, {{y2}}, {{z2}})$? (Or does it never reach it?)
d) What is the closest distance to point $C({{x3}}, {{y3}}, {{z3}})$?

**Position equation:**
$$\vec{r}(t) = \vec{r}_0 + t\vec{v}$$

### 13. Distance Between Skew Lines
Calculate the shortest distance between skew lines:
$$g: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + s\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$$
$$h: \vec{r} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix} + t\begin{pmatrix} {{e1}} \\ {{e2}} \\ {{e3}} \end{pmatrix}$$

**Formula:**
$$d = \frac{|\vec{AB} \cdot (\vec{d} \times \vec{e})|}{|\vec{d} \times \vec{e}|}$$

where $A$ is a point on $g$, $B$ is a point on $h$.

**Steps:**
1. Calculate $\vec{AB}$ (using position vectors)
2. Calculate $\vec{d} \times \vec{e}$ (cross product)
3. Calculate scalar triple product: $\vec{AB} \cdot (\vec{d} \times \vec{e})$
4. Calculate distance: $d = \frac{|scalar\ triple\ product|}{|\vec{d} \times \vec{e}|}$

### 14. Line of Intersection of Two Planes
Find the line of intersection of planes:
$$E_1: {{a1}}x + {{b1}}y + {{c1}}z = {{d1}}$$
$$E_2: {{a2}}x + {{b2}}y + {{c2}}z = {{d2}}$$

**Method:**
1. Direction vector of line: $\vec{d} = \vec{n}_1 \times \vec{n}_2$ (cross product of normal vectors)
   - $\vec{n}_1 = \begin{pmatrix} {{a1}} \\ {{b1}} \\ {{c1}} \end{pmatrix}$, $\vec{n}_2 = \begin{pmatrix} {{a2}} \\ {{b2}} \\ {{c2}} \end{pmatrix}$
2. Find one point on the line by setting one coordinate to 0 (e.g., $z = 0$) and solving the system
3. Write parametric equation: $\vec{r} = \vec{a} + t\vec{d}$

### 15. Reflection of Point Across Line
Find the reflection $P'$ of point $P({{px}}, {{py}}, {{pz}})$ across line:
$$g: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + t\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$$

**Strategy:**
1. Find foot of perpendicular $F$ from $P$ to line $g$
2. $F$ is the midpoint of $P$ and $P'$
3. Use midpoint formula: $F = \frac{1}{2}(P + P')$, so $P' = 2F - P$

**Steps:**
a) Find foot of perpendicular $F$ (see Problem 7)
b) Calculate $P' = 2F - P$
c) Verify: distance from $P$ to $g$ equals distance from $P'$ to $g$

## Task Requirements
- Use parametric form as primary representation
- Always use proper vector notation with column vectors
- Include problems requiring analysis of line relationships (parallel, intersecting, skew)
- Mix pure geometry with physics applications (trajectories)
- Require distance and angle calculations
- Use varied numerical values across generations
- Include verification steps where appropriate
- Show multiple solution methods when applicable
- Emphasize geometric interpretation alongside algebraic calculation
- Use realistic units for physics problems (m, m/s, s)
- Ensure problems require multi-step reasoning
- Include both 2-parameter systems (line intersection) and 1-parameter (points on lines)
