---
id: vectors-basics
name: Vector Basics
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
  - Represent vectors in component form and geometrically
  - Calculate vector length (magnitude)
  - Add and subtract vectors
  - Multiply vectors by scalars
  - Understand position and direction vectors
prerequisites:
  - coordinate-system
  - pythagorean-theorem
example_tasks:
  - Calculate |$\vec{a}$| for $\vec{a} = \begin{pmatrix} 3 \\ -4 \\ 0 \end{pmatrix}$
  - Find $2\vec{a} - 3\vec{b}$ for given vectors
real_world_context: Vectors model physical quantities like velocity, force, and displacement in physics and engineering. They are essential for GPS navigation, computer graphics, and robotics.
---

# Vector Basics

Create diverse problems for understanding vectors in 2D and 3D space, including representation, magnitude calculation, addition, subtraction, and scalar multiplication.

## Problem Variations

### 1. Vector Representation and Components
Given points $A({{x1}}, {{y1}}, {{z1}})$ and $B({{x2}}, {{y2}}, {{z2}})$ in 3D space.

a) Write the position vector $\vec{OA}$ (from origin to $A$)
b) Write the direction vector $\vec{AB}$ (from $A$ to $B$)
c) Calculate the components: $\vec{AB} = \begin{pmatrix} ? \\ ? \\ ? \end{pmatrix}$

**Formula for direction vector:**
$$\vec{AB} = \begin{pmatrix} x_2 - x_1 \\ y_2 - y_1 \\ z_2 - z_1 \end{pmatrix}$$

### 2. Vector Magnitude (Length)
Calculate the length of vector $\vec{v} = \begin{pmatrix} {{a}} \\ {{b}} \\ {{c}} \end{pmatrix}$

**Show your calculation:**
$$|\vec{v}| = \sqrt{a^2 + b^2 + c^2}$$
$$|\vec{v}| = \sqrt{{{a}}^2 + {{b}}^2 + {{c}}^2}$$
$$|\vec{v}| = \sqrt{?} = ?$$

**For 2D vectors:** $|\vec{v}| = \sqrt{a^2 + b^2}$

### 3. Distance Between Points
Calculate the distance between points $P({{x1}}, {{y1}}, {{z1}})$ and $Q({{x2}}, {{y2}}, {{z2}})$.

**Strategy:**
1. Find the direction vector $\vec{PQ}$
2. Calculate its length: $d = |\vec{PQ}|$
3. Show the complete calculation

**Distance formula in 3D:**
$$d = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}$$

### 4. Vector Addition
Given $\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix}$ and $\vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}$

a) Calculate $\vec{a} + \vec{b}$
b) Calculate $\vec{a} - \vec{b}$
c) Verify the commutative law: $\vec{a} + \vec{b} = \vec{b} + \vec{a}$

**Addition rule:**
$$\vec{a} + \vec{b} = \begin{pmatrix} a_1 + b_1 \\ a_2 + b_2 \\ a_3 + b_3 \end{pmatrix}$$

### 5. Scalar Multiplication
For $\vec{v} = \begin{pmatrix} {{x}} \\ {{y}} \\ {{z}} \end{pmatrix}$ and scalar $k = {{k}}$:

a) Calculate $k\vec{v}$
b) Calculate $|k\vec{v}|$
c) Compare $|k\vec{v}|$ with $|k| \cdot |\vec{v}|$
d) What is the relationship?

**Scalar multiplication:**
$$k\vec{v} = \begin{pmatrix} kx \\ ky \\ kz \end{pmatrix}$$

**Property:** $|k\vec{v}| = |k| \cdot |\vec{v}|$

### 6. Linear Combination of Vectors
Given $\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix}$, $\vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}$, $\vec{c} = \begin{pmatrix} {{c1}} \\ {{c2}} \\ {{c3}} \end{pmatrix}$

Calculate: ${{k1}}\vec{a} + {{k2}}\vec{b} - {{k3}}\vec{c}$

**Process:**
1. Multiply each vector by its scalar
2. Add/subtract component-wise
3. Write the result vector

### 7. Unit Vectors
For $\vec{v} = \begin{pmatrix} {{x}} \\ {{y}} \\ {{z}} \end{pmatrix}$:

a) Calculate the length $|\vec{v}|$
b) Find the unit vector $\vec{e}_v = \frac{\vec{v}}{|\vec{v}|}$
c) Verify: $|\vec{e}_v| = 1$

**Unit vector formula:**
$$\vec{e}_v = \frac{1}{|\vec{v}|} \cdot \vec{v} = \frac{\vec{v}}{|\vec{v}|}$$

A unit vector has length 1 and points in the same direction as $\vec{v}$.

### 8. Parallel Vectors
Determine whether vectors $\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix}$ and $\vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}$ are parallel.

**Check:**
Two vectors are parallel if $\vec{b} = k\vec{a}$ for some scalar $k$.

a) Calculate the ratios: $\frac{b_1}{a_1}$, $\frac{b_2}{a_2}$, $\frac{b_3}{a_3}$
b) Are all ratios equal?
c) If yes, find $k$; if no, the vectors are not parallel

### 9. Midpoint Formula
Find the midpoint $M$ of the line segment connecting points $A({{x1}}, {{y1}}, {{z1}})$ and $B({{x2}}, {{y2}}, {{z2}})$.

**Two methods:**

**Method 1 - Average coordinates:**
$$M = \left(\frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2}, \frac{z_1 + z_2}{2}\right)$$

**Method 2 - Vector approach:**
$$\vec{OM} = \vec{OA} + \frac{1}{2}\vec{AB}$$

Use both methods and verify they give the same result.

### 10. Triangle Problems
Given triangle $ABC$ with vertices $A({{x1}}, {{y1}}, {{z1}})$, $B({{x2}}, {{y2}}, {{z2}})$, $C({{x3}}, {{y3}}, {{z3}})$.

a) Calculate the side vectors $\vec{AB}$, $\vec{BC}$, $\vec{CA}$
b) Calculate the side lengths $|AB|$, $|BC|$, $|CA|$
c) Verify: $\vec{AB} + \vec{BC} + \vec{CA} = \vec{0}$ (closed triangle)
d) Find the coordinates of the centroid $S = \frac{1}{3}(A + B + C)$

**Centroid formula:**
$$S = \left(\frac{x_1+x_2+x_3}{3}, \frac{y_1+y_2+y_3}{3}, \frac{z_1+z_2+z_3}{3}\right)$$

### 11. Physics Application - Displacement
A particle moves from position $P_1({{x1}}, {{y1}}, {{z1}})$ to $P_2({{x2}}, {{y2}}, {{z2}})$, then to $P_3({{x3}}, {{y3}}, {{z3}})$.

a) Calculate displacement vectors $\vec{d_1} = \vec{P_1P_2}$ and $\vec{d_2} = \vec{P_2P_3}$
b) Find the total displacement $\vec{d}_{total} = \vec{d_1} + \vec{d_2}$
c) Calculate the total distance traveled vs. the magnitude of total displacement
d) Verify: $\vec{d}_{total} = \vec{P_1P_3}$

**Note:** Distance traveled ≥ magnitude of displacement

### 12. Collinear Points
Determine whether points $A({{x1}}, {{y1}}, {{z1}})$, $B({{x2}}, {{y2}}, {{z2}})$, and $C({{x3}}, {{y3}}, {{z3}})$ are collinear (lie on the same line).

**Method:**
Three points are collinear if vectors $\vec{AB}$ and $\vec{AC}$ are parallel.

a) Calculate $\vec{AB}$ and $\vec{AC}$
b) Check if $\vec{AC} = k\vec{AB}$ for some scalar $k$
c) Are the points collinear?

**Alternative check:** $\vec{AB} + \vec{BC} = \vec{AC}$ and $\vec{BC} \parallel \vec{AB}$

### 13. Standard Basis Vectors
Express vector $\vec{v} = \begin{pmatrix} {{a}} \\ {{b}} \\ {{c}} \end{pmatrix}$ as a linear combination of standard basis vectors.

**Standard basis in 3D:**
$$\vec{e}_1 = \begin{pmatrix} 1 \\ 0 \\ 0 \end{pmatrix}, \quad \vec{e}_2 = \begin{pmatrix} 0 \\ 1 \\ 0 \end{pmatrix}, \quad \vec{e}_3 = \begin{pmatrix} 0 \\ 0 \\ 1 \end{pmatrix}$$

**Express:** $\vec{v} = {{a}}\vec{e}_1 + {{b}}\vec{e}_2 + {{c}}\vec{e}_3$

### 14. Vector Equation of Motion
A particle starts at position $\vec{r}_0 = \begin{pmatrix} {{x0}} \\ {{y0}} \\ {{z0}} \end{pmatrix}$ and moves with constant velocity $\vec{v} = \begin{pmatrix} {{vx}} \\ {{vy}} \\ {{vz}} \end{pmatrix}$.

a) Write the position vector at time $t$: $\vec{r}(t) = \vec{r}_0 + t\vec{v}$
b) Find the position at time $t = {{t}}$
c) At what time does the particle reach point $P({{px}}, {{py}}, {{pz}})$? (Set up equations)

**Position equation:**
$$\vec{r}(t) = \vec{r}_0 + t\vec{v}$$

### 15. Force Vectors in Physics
Two forces $\vec{F}_1 = \begin{pmatrix} {{f1x}} \\ {{f1y}} \\ {{f1z}} \end{pmatrix}$ N and $\vec{F}_2 = \begin{pmatrix} {{f2x}} \\ {{f2y}} \\ {{f2z}} \end{pmatrix}$ N act on an object.

a) Calculate the resultant force $\vec{F}_{res} = \vec{F}_1 + \vec{F}_2$
b) Calculate the magnitude $|\vec{F}_{res}|$
c) If a third force $\vec{F}_3$ balances these two (equilibrium), what is $\vec{F}_3$?

**Equilibrium condition:** $\vec{F}_1 + \vec{F}_2 + \vec{F}_3 = \vec{0}$

## Task Requirements
- Use 3D vectors predominantly (some 2D problems acceptable)
- Always require clear notation with column vectors
- Include geometric interpretation where appropriate
- Vary numerical values significantly across generations
- Mix pure mathematical problems with physics applications
- Require verification of results where possible
- Emphasize both algebraic and geometric understanding
- Include problems requiring multi-step reasoning
- Use realistic values for physics contexts (meters, Newtons, etc.)
- Ensure all calculations are feasible without calculator for harder problems
