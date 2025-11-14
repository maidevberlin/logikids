---
id: planes-in-space
name: Planes in 3D Space
description: Vectors and analytical geometry
grade: 12
ages:
  - 17
  - 18
focus: Vectors and analytical geometry
difficulty: hard
learning_objectives:
  - Write equations of planes in various forms (parametric, normal, coordinate)
  - Determine relationships between planes (parallel, intersecting, identical)
  - Find intersection of planes and lines
  - Calculate distances from points to planes
  - Determine angles between planes
prerequisites:
  - vectors-basics
  - scalar-product
  - cross-product
  - lines-in-space
example_tasks:
  - Write parametric equation for plane through three points
  - Find intersection line of two planes
  - Calculate distance from point to plane
real_world_context: Planes model surfaces in architecture, flight paths in aviation, cutting planes in manufacturing, collision detection in computer graphics, and crystal structures in chemistry.
---

# Planes in 3D Space

Create diverse problems for understanding planes in three-dimensional space, including various representations, plane relationships, intersections with lines and planes, distances, and angles.

## Problem Variations

### 1. Plane from Three Points
Find the parametric equation of the plane through points $A({{x1}}, {{y1}}, {{z1}})$, $B({{x2}}, {{y2}}, {{z2}})$, $C({{x3}}, {{y3}}, {{z3}})$.

**Parametric form:**
$$E: \vec{r} = \vec{a} + s\vec{u} + t\vec{v}$$

where $\vec{a}$ is a position vector (point on plane) and $\vec{u}$, $\vec{v}$ are direction vectors (not parallel).

**Steps:**
1. Choose $\vec{a} = \vec{OA}$ (use point $A$)
2. Calculate $\vec{u} = \vec{AB}$ and $\vec{v} = \vec{AC}$
3. Write equation:
$$E: \vec{r} = \begin{pmatrix} {{x1}} \\ {{y1}} \\ {{z1}} \end{pmatrix} + s\begin{pmatrix} ? \\ ? \\ ? \end{pmatrix} + t\begin{pmatrix} ? \\ ? \\ ? \end{pmatrix}, \quad s,t \in \mathbb{R}$$

### 2. Normal Vector and Normal Form
For the plane from Problem 1:

a) Calculate the normal vector $\vec{n} = \vec{u} \times \vec{v}$
b) Write the plane equation in normal form: $\vec{n} \cdot (\vec{r} - \vec{a}) = 0$
c) Verify that all three points $A$, $B$, $C$ satisfy the equation

**Normal form:**
$$\vec{n} \cdot \vec{r} = \vec{n} \cdot \vec{a}$$

or

$$n_1x + n_2y + n_3z = d$$

where $d = \vec{n} \cdot \vec{a}$

### 3. Coordinate Form from Normal Vector
Given plane with normal vector $\vec{n} = \begin{pmatrix} {{a}} \\ {{b}} \\ {{c}} \end{pmatrix}$ passing through point $P({{x0}}, {{y0}}, {{z0}})$.

**Coordinate form:**
$$ax + by + cz = d$$

**Steps:**
1. Start with: ${{a}}(x - {{x0}}) + {{b}}(y - {{y0}}) + {{c}}(z - {{z0}}) = 0$
2. Expand: ${{a}}x + {{b}}y + {{c}}z = {{a}} \cdot {{x0}} + {{b}} \cdot {{y0}} + {{c}} \cdot {{z0}}$
3. Calculate $d = ?$

Verify that point $P$ satisfies the equation.

### 4. Point in Plane Test
Determine if point $P({{px}}, {{py}}, {{pz}})$ lies in plane:
$$E: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + s\begin{pmatrix} {{u1}} \\ {{u2}} \\ {{u3}} \end{pmatrix} + t\begin{pmatrix} {{v1}} \\ {{v2}} \\ {{v3}} \end{pmatrix}$$

**Method 1 - Parametric:**
Solve the system:
$${{a1}} + s \cdot {{u1}} + t \cdot {{v1}} = {{px}}$$
$${{a2}} + s \cdot {{u2}} + t \cdot {{v2}} = {{py}}$$
$${{a3}} + s \cdot {{u3}} + t \cdot {{v3}} = {{pz}}$$

If values of $s$ and $t$ exist satisfying all three equations, then $P$ is in the plane.

**Method 2 - Normal form:**
1. Find normal vector $\vec{n} = \vec{u} \times \vec{v}$
2. Check if $\vec{n} \cdot (\vec{OP} - \vec{OA}) = 0$

### 5. Parallel Planes
Determine if planes are parallel:
$$E_1: {{a1}}x + {{b1}}y + {{c1}}z = {{d1}}$$
$$E_2: {{a2}}x + {{b2}}y + {{c2}}z = {{d2}}$$

**Parallel condition:**
Normal vectors are parallel: $\vec{n}_1 = k\vec{n}_2$ for some $k \neq 0$.

a) Check if $\begin{pmatrix} {{a1}} \\ {{b1}} \\ {{c1}} \end{pmatrix} = k\begin{pmatrix} {{a2}} \\ {{b2}} \\ {{c2}} \end{pmatrix}$
b) If parallel, are planes identical or distinct?
   - Identical: $d_1 = k \cdot d_2$
   - Distinct: $d_1 \neq k \cdot d_2$

### 6. Intersection of Plane and Line
Find the intersection of line and plane:
$$g: \vec{r} = \begin{pmatrix} {{lx}} \\ {{ly}} \\ {{lz}} \end{pmatrix} + t\begin{pmatrix} {{dx}} \\ {{dy}} \\ {{dz}} \end{pmatrix}$$
$$E: {{a}}x + {{b}}y + {{c}}z = {{d}}$$

**Method:**
1. Substitute line equation into plane equation:
$${{a}}({{lx}} + t \cdot {{dx}}) + {{b}}({{ly}} + t \cdot {{dy}}) + {{c}}({{lz}} + t \cdot {{dz}}) = {{d}}$$

2. Solve for $t$
3. Substitute $t$ back into line equation to find intersection point

**Special cases:**
- If equation has solution: line intersects plane at one point
- If equation is $0 = 0$: line lies in plane (infinitely many solutions)
- If equation is $0 = k$ (where $k \neq 0$): line is parallel to plane (no solution)

### 7. Distance from Point to Plane
Calculate the distance from point $P({{px}}, {{py}}, {{pz}})$ to plane:
$$E: {{a}}x + {{b}}y + {{c}}z = {{d}}$$

**Formula:**
$$d = \frac{|{{a}} \cdot {{px}} + {{b}} \cdot {{py}} + {{c}} \cdot {{pz}} - {{d}}|}{\sqrt{ {{a}}^2 + {{b}}^2 + {{c}}^2 }$$

**Simplified:**
$$d = \frac{|ax_P + by_P + cz_P - d|}{|\vec{n}|}$$

where $\vec{n} = \begin{pmatrix} a \\ b \\ c \end{pmatrix}$ is the normal vector.

**Steps:**
1. Calculate numerator: $|{{a}} \cdot {{px}} + {{b}} \cdot {{py}} + {{c}} \cdot {{pz}} - {{d}}|$
2. Calculate denominator: $\sqrt{ {{a}}^2 + {{b}}^2 + {{c}}^2 }$
3. Divide to get distance

### 8. Foot of Perpendicular
Find the point $F$ on plane $E: {{a}}x + {{b}}y + {{c}}z = {{d}}$ that is closest to point $P({{px}}, {{py}}, {{pz}})$.

**Method:**
The line through $P$ perpendicular to the plane has direction vector $\vec{n} = \begin{pmatrix} {{a}} \\ {{b}} \\ {{c}} \end{pmatrix}$ (the normal vector).

**Steps:**
1. Write line equation: $g: \vec{r} = \begin{pmatrix} {{px}} \\ {{py}} \\ {{pz}} \end{pmatrix} + t\begin{pmatrix} {{a}} \\ {{b}} \\ {{c}} \end{pmatrix}$
2. Find intersection of this line with plane $E$ (see Problem 6)
3. This intersection point is $F$
4. Verify: distance $|PF|$ equals distance calculated in Problem 7

### 9. Angle Between Planes
Calculate the angle between planes:
$$E_1: {{a1}}x + {{b1}}y + {{c1}}z = {{d1}}$$
$$E_2: {{a2}}x + {{b2}}y + {{c2}}z = {{d2}}$$

**Formula:**
$$\cos(\varphi) = \frac{|\vec{n}_1 \cdot \vec{n}_2|}{|\vec{n}_1| \cdot |\vec{n}_2|}$$

where $\vec{n}_1 = \begin{pmatrix} {{a1}} \\ {{b1}} \\ {{c1}} \end{pmatrix}$, $\vec{n}_2 = \begin{pmatrix} {{a2}} \\ {{b2}} \\ {{c2}} \end{pmatrix}$

**Note:** Use absolute value to get acute angle (0° to 90°).

**Steps:**
1. Calculate $\vec{n}_1 \cdot \vec{n}_2$
2. Calculate $|\vec{n}_1|$ and $|\vec{n}_2|$
3. Calculate $\cos(\varphi)$
4. Find angle $\varphi$

### 10. Intersection Line of Two Planes
Find the line of intersection of planes:
$$E_1: {{a1}}x + {{b1}}y + {{c1}}z = {{d1}}$$
$$E_2: {{a2}}x + {{b2}}y + {{c2}}z = {{d2}}$$

**Method:**
1. Direction vector: $\vec{d} = \vec{n}_1 \times \vec{n}_2$ (perpendicular to both normal vectors)
2. Find one point on the line:
   - Set one coordinate to 0 (e.g., $z = 0$)
   - Solve the resulting 2×2 system for $x$ and $y$
3. Write parametric equation: $g: \vec{r} = \vec{a} + t\vec{d}$

**Check:** Verify that the line lies in both planes by substituting into both equations.

### 11. Intersection of Three Planes
Determine the intersection of three planes:
$$E_1: {{a1}}x + {{b1}}y + {{c1}}z = {{d1}}$$
$$E_2: {{a2}}x + {{b2}}y + {{c2}}z = {{d2}}$$
$$E_3: {{a3}}x + {{b3}}y + {{c3}}z = {{d3}}$$

**Solve the system:**
This is a 3×3 linear system. Use elimination or matrix methods.

**Possible outcomes:**
- One unique point (three planes meet at a point)
- A line (three planes share a common line)
- A plane (three planes are identical)
- No solution (planes have no common point)

### 12. Angle Between Line and Plane
Calculate the angle between line $g: \vec{r} = \begin{pmatrix} {{lx}} \\ {{ly}} \\ {{lz}} \end{pmatrix} + t\begin{pmatrix} {{dx}} \\ {{dy}} \\ {{dz}} \end{pmatrix}$ and plane $E: {{a}}x + {{b}}y + {{c}}z = {{d}}$.

**Formula:**
$$\sin(\varphi) = \frac{|\vec{d} \cdot \vec{n}|}{|\vec{d}| \cdot |\vec{n}|}$$

where $\vec{d} = \begin{pmatrix} {{dx}} \\ {{dy}} \\ {{dz}} \end{pmatrix}$ is the line direction and $\vec{n} = \begin{pmatrix} {{a}} \\ {{b}} \\ {{c}} \end{pmatrix}$ is the plane normal.

**Note:** This gives the angle between the line and the plane (not the angle between line and normal!).

**Special case:** If $\vec{d} \perp \vec{n}$ (i.e., $\vec{d} \cdot \vec{n} = 0$), the line is parallel to the plane.

### 13. Plane Through Point Parallel to Plane
Find the equation of plane $F$ that passes through point $P({{px}}, {{py}}, {{pz}})$ and is parallel to plane:
$$E: {{a}}x + {{b}}y + {{c}}z = {{d}}$$

**Strategy:**
Parallel planes have the same normal vector.

**Equation:**
$$F: {{a}}x + {{b}}y + {{c}}z = {{a}} \cdot {{px}} + {{b}} \cdot {{py}} + {{c}} \cdot {{pz}}$$

a) Calculate the right side: $d' = ?$
b) Verify point $P$ satisfies the equation
c) Verify planes $E$ and $F$ are parallel but distinct

### 14. Plane Through Line and Point
Find the equation of the plane containing line:
$$g: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + s\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$$

and point $P({{px}}, {{py}}, {{pz}})$ (not on the line).

**Strategy:**
1. Point $A({{a1}}, {{a2}}, {{a3}})$ is on the line (and thus in the plane)
2. Direction vector $\vec{d}$ of line is in the plane
3. Vector $\vec{AP}$ is also in the plane
4. Normal vector: $\vec{n} = \vec{d} \times \vec{AP}$

**Steps:**
a) Calculate $\vec{AP}$
b) Calculate $\vec{n} = \vec{d} \times \vec{AP}$
c) Write plane equation: $\vec{n} \cdot (\vec{r} - \vec{OA}) = 0$
d) Convert to coordinate form

### 15. Distance Between Parallel Planes
Calculate the distance between parallel planes:
$$E_1: {{a}}x + {{b}}y + {{c}}z = {{d1}}$$
$$E_2: {{a}}x + {{b}}y + {{c}}z = {{d2}}$$

**Method 1 - Direct formula:**
$$d = \frac{|d_2 - d_1|}{\sqrt{a^2 + b^2 + c^2}$$

**Method 2 - Point-to-plane:**
1. Find any point $P$ on plane $E_1$ (e.g., set two coordinates to 0, solve for third)
2. Calculate distance from $P$ to plane $E_2$

Use both methods and verify they give the same result.

### 16. Plane Through Three Collinear Points
Show that it is impossible to uniquely determine a plane through three collinear points $A({{x1}}, {{y1}}, {{z1}})$, $B({{x2}}, {{y2}}, {{z2}})$, $C({{x3}}, {{y3}}, {{z3}})$.

**Steps:**
1. Show points are collinear (see lines-in-space concept)
2. Calculate $\vec{AB}$ and $\vec{AC}$
3. Try to find normal vector: $\vec{n} = \vec{AB} \times \vec{AC}$
4. What happens? Why can't we define a unique plane?

**Conclusion:** Three collinear points determine infinitely many planes (all planes containing the line through the points).

### 17. Plane Containing Two Parallel Lines
Determine if two parallel lines lie in a plane, and if so, find the plane equation.

Given parallel lines:
$$g: \vec{r} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix} + s\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$$
$$h: \vec{r} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix} + t\begin{pmatrix} {{d1}} \\ {{d2}} \\ {{d3}} \end{pmatrix}$$

**Strategy:**
1. Verify lines are parallel (same direction vector)
2. Calculate $\vec{AB}$ where $A$ is on $g$ and $B$ is on $h$
3. Normal vector: $\vec{n} = \vec{d} \times \vec{AB}$
4. Write plane equation using $\vec{n}$ and point $A$

### 18. Reflection of Point Across Plane
Find the reflection $P'$ of point $P({{px}}, {{py}}, {{pz}})$ across plane:
$$E: {{a}}x + {{b}}y + {{c}}z = {{d}}$$

**Strategy:**
1. Find foot of perpendicular $F$ from $P$ to plane (see Problem 8)
2. $F$ is the midpoint of $P$ and $P'$
3. Calculate $P' = 2F - P$

**Steps:**
a) Find $F$
b) Calculate $P' = 2F - P$
c) Verify: distance from $P$ to $E$ equals distance from $P'$ to $E$
d) Verify: line $PP'$ is perpendicular to plane $E$

### 19. Tetrahedron Volume
Calculate the volume of tetrahedron with vertices $O(0,0,0)$, $A({{x1}}, {{y1}}, {{z1}})$, $B({{x2}}, {{y2}}, {{z2}})$, $C({{x3}}, {{y3}}, {{z3}})$.

**Formula using scalar triple product:**
$$V = \frac{1}{6}|\vec{OA} \cdot (\vec{OB} \times \vec{OC})|$$

**Steps:**
1. Calculate $\vec{OB} \times \vec{OC}$ (cross product)
2. Calculate $\vec{OA} \cdot (\vec{OB} \times \vec{OC})$ (scalar triple product)
3. Take absolute value and divide by 6

**Alternative formula:** $V = \frac{1}{6}|det(\vec{OA}, \vec{OB}, \vec{OC})|$

### 20. Plane Bisecting Two Points
Find the equation of the plane that is the perpendicular bisector of the line segment from $A({{x1}}, {{y1}}, {{z1}})$ to $B({{x2}}, {{y2}}, {{z2}})$.

**Strategy:**
1. Midpoint: $M = \frac{1}{2}(A + B)$
2. Normal vector: $\vec{n} = \vec{AB}$ (perpendicular to plane)
3. Plane passes through $M$ with normal $\vec{n}$

**Steps:**
a) Calculate midpoint $M$
b) Calculate $\vec{AB}$
c) Write plane equation: $\vec{AB} \cdot (\vec{r} - \vec{OM}) = 0$
d) Verify: distances from $A$ and $B$ to the plane are equal

## Task Requirements
- Use multiple forms: parametric, normal, and coordinate
- Require conversion between forms
- Include problems involving line-plane and plane-plane intersections
- Mix pure geometry with applications (e.g., optimization, physics)
- Calculate distances and angles
- Use varied numerical values across generations
- Include verification steps where appropriate
- Show relationship between normal vectors and plane orientation
- Require multi-step reasoning
- Emphasize geometric visualization alongside algebraic calculation
- Include special cases (parallel, identical, perpendicular)
- Connect to cross product and scalar product concepts
