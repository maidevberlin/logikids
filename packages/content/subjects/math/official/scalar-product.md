---
id: scalar-product
name: Scalar Product (Dot Product)
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
  - Calculate scalar product of vectors
  - Determine angles between vectors
  - Check orthogonality of vectors
  - Apply scalar product in geometry and physics
prerequisites:
  - vectors-basics
example_tasks:
  - Calculate $\vec{a} \cdot \vec{b}$ for given vectors
  - Find angle between two vectors
  - Determine if vectors are orthogonal
real_world_context: The scalar product is fundamental in physics for calculating work (force · displacement), determining components of forces, and in computer graphics for lighting calculations and backface culling.
---

# Scalar Product (Dot Product)

Create diverse problems for understanding and applying the scalar product (dot product) of vectors, including angle calculations, orthogonality tests, and applications in geometry and physics.

## Problem Variations

### 1. Basic Scalar Product Calculation
Calculate the scalar product of vectors:
$$\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix}, \quad \vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}$$

**Formula:**
$$\vec{a} \cdot \vec{b} = a_1b_1 + a_2b_2 + a_3b_3$$

a) Calculate $\vec{a} \cdot \vec{b}$
b) Calculate $\vec{b} \cdot \vec{a}$ and verify: $\vec{a} \cdot \vec{b} = \vec{b} \cdot \vec{a}$ (commutative property)
c) Calculate $\vec{a} \cdot \vec{a}$ and compare with $|\vec{a}|^2$

**Property:** $\vec{a} \cdot \vec{a} = |\vec{a}|^2$

### 2. Angle Between Vectors
For vectors $\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix}$ and $\vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}$, find the angle $\varphi$ between them.

**Formula:**
$$\cos(\varphi) = \frac{\vec{a} \cdot \vec{b}}{|\vec{a}| \cdot |\vec{b}|}$$

**Steps:**
1. Calculate $\vec{a} \cdot \vec{b}$
2. Calculate $|\vec{a}|$ and $|\vec{b}|$
3. Calculate $\cos(\varphi)$
4. Find $\varphi = \arccos\left(\frac{\vec{a} \cdot \vec{b}}{|\vec{a}| \cdot |\vec{b}|}\right)$

Give answer in degrees and/or radians.

### 3. Orthogonality Test
Determine whether the following vectors are orthogonal (perpendicular):
$$\vec{u} = \begin{pmatrix} {{u1}} \\ {{u2}} \\ {{u3}} \end{pmatrix}, \quad \vec{v} = \begin{pmatrix} {{v1}} \\ {{v2}} \\ {{v3}} \end{pmatrix}$$

**Orthogonality condition:** $\vec{u} \perp \vec{v} \Leftrightarrow \vec{u} \cdot \vec{v} = 0$

a) Calculate $\vec{u} \cdot \vec{v}$
b) Are the vectors orthogonal?
c) If not orthogonal, what is the angle between them?

### 4. Finding Unknown Component
Find the value of $k$ such that vectors $\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ k \end{pmatrix}$ and $\vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}$ are orthogonal.

**Setup:**
$$\vec{a} \cdot \vec{b} = 0$$
$${{a1}} \cdot {{b1}} + {{a2}} \cdot {{b2}} + k \cdot {{b3}} = 0$$

Solve for $k$.

### 5. Triangle Angle Calculation
Given triangle $ABC$ with vertices $A({{x1}}, {{y1}}, {{z1}})$, $B({{x2}}, {{y2}}, {{z2}})$, $C({{x3}}, {{y3}}, {{z3}})$.

Calculate the angle at vertex $B$ (angle $\angle ABC$).

**Strategy:**
1. Find vectors $\vec{BA}$ and $\vec{BC}$
2. Use formula: $\cos(\angle ABC) = \frac{\vec{BA} \cdot \vec{BC}}{|\vec{BA}| \cdot |\vec{BC}|}$
3. Calculate the angle

**Note:** The angle at $B$ is between vectors pointing FROM $B$ to the other vertices.

### 6. Projection of Vector onto Another
Find the scalar projection and vector projection of $\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix}$ onto $\vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}$.

**Scalar projection (length):**
$$\text{comp}_{\vec{b}}\vec{a} = \frac{\vec{a} \cdot \vec{b}}{|\vec{b}|}$$

**Vector projection:**
$$\text{proj}_{\vec{b}}\vec{a} = \frac{\vec{a} \cdot \vec{b}}{|\vec{b}|^2} \cdot \vec{b} = \frac{\vec{a} \cdot \vec{b}}{\vec{b} \cdot \vec{b}} \cdot \vec{b}$$

a) Calculate the scalar projection
b) Calculate the vector projection
c) Verify that $\text{proj}_{\vec{b}}\vec{a}$ is parallel to $\vec{b}$

### 7. Work Done by Force (Physics)
A force $\vec{F} = \begin{pmatrix} {{fx}} \\ {{fy}} \\ {{fz}} \end{pmatrix}$ N acts on an object that moves from point $A$ to point $B$ with displacement $\vec{d} = \begin{pmatrix} {{dx}} \\ {{dy}} \\ {{dz}} \end{pmatrix}$ m.

**Work formula:**
$$W = \vec{F} \cdot \vec{d}$$

a) Calculate the work done $W$ (in Joules)
b) If the displacement were $\begin{pmatrix} {{d2x}} \\ {{d2y}} \\ {{d2z}} \end{pmatrix}$ m instead, what work would be done?
c) For which displacement direction (same magnitude) is the work maximum?

**Note:** Work is maximum when force and displacement are parallel.

### 8. Distributive Property
Verify the distributive property for:
$$\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix}, \quad \vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}, \quad \vec{c} = \begin{pmatrix} {{c1}} \\ {{c2}} \\ {{c3}} \end{pmatrix}$$

Show that: $\vec{a} \cdot (\vec{b} + \vec{c}) = \vec{a} \cdot \vec{b} + \vec{a} \cdot \vec{c}$

**Calculate:**
1. Left side: $\vec{a} \cdot (\vec{b} + \vec{c})$
   - First find $\vec{b} + \vec{c}$
   - Then compute scalar product with $\vec{a}$
2. Right side: $\vec{a} \cdot \vec{b} + \vec{a} \cdot \vec{c}$
3. Verify equality

### 9. Angle Classification
For each pair of vectors, calculate the angle and classify it as acute, right, or obtuse:

a) $\vec{u}_1 = \begin{pmatrix} {{u1a}} \\ {{u2a}} \\ {{u3a}} \end{pmatrix}$, $\vec{v}_1 = \begin{pmatrix} {{v1a}} \\ {{v2a}} \\ {{v3a}} \end{pmatrix}$

b) $\vec{u}_2 = \begin{pmatrix} {{u1b}} \\ {{u2b}} \\ {{u3b}} \end{pmatrix}$, $\vec{v}_2 = \begin{pmatrix} {{v1b}} \\ {{v2b}} \\ {{v3b}} \end{pmatrix}$

**Classification:**
- $\vec{u} \cdot \vec{v} > 0$: acute angle ($0° < \varphi < 90°$)
- $\vec{u} \cdot \vec{v} = 0$: right angle ($\varphi = 90°$)
- $\vec{u} \cdot \vec{v} < 0$: obtuse angle ($90° < \varphi < 180°$)

### 10. Cauchy-Schwarz Inequality
For $\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix}$ and $\vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}$, verify the Cauchy-Schwarz inequality:

$$|\vec{a} \cdot \vec{b}| \leq |\vec{a}| \cdot |\vec{b}|$$

**Calculate:**
1. Left side: $|\vec{a} \cdot \vec{b}|$ (absolute value of dot product)
2. Right side: $|\vec{a}| \cdot |\vec{b}|$ (product of magnitudes)
3. Verify the inequality holds
4. When does equality occur?

**Equality condition:** When vectors are parallel (angle 0° or 180°)

### 11. Orthogonal Basis Vectors
Verify that the following vectors form an orthogonal set:
$$\vec{e}_1 = \begin{pmatrix} {{e11}} \\ {{e12}} \\ {{e13}} \end{pmatrix}, \quad \vec{e}_2 = \begin{pmatrix} {{e21}} \\ {{e22}} \\ {{e23}} \end{pmatrix}, \quad \vec{e}_3 = \begin{pmatrix} {{e31}} \\ {{e32}} \\ {{e33}} \end{pmatrix}$$

**Check all pairs:**
a) $\vec{e}_1 \cdot \vec{e}_2 = ?$
b) $\vec{e}_1 \cdot \vec{e}_3 = ?$
c) $\vec{e}_2 \cdot \vec{e}_3 = ?$

If all three are zero, the vectors are mutually orthogonal.

**Bonus:** Check if they form an orthonormal basis (each has length 1).

### 12. Angle in a Parallelogram
A parallelogram has adjacent sides represented by vectors:
$$\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix}, \quad \vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}$$

a) Calculate the angle between sides $\vec{a}$ and $\vec{b}$
b) Calculate the length of both diagonals:
   - $\vec{d}_1 = \vec{a} + \vec{b}$ (one diagonal)
   - $\vec{d}_2 = \vec{a} - \vec{b}$ (other diagonal)
c) Verify: $|\vec{d}_1|^2 + |\vec{d}_2|^2 = 2(|\vec{a}|^2 + |\vec{b}|^2)$ (parallelogram law)

### 13. Finding Orthogonal Vector
Find a vector $\vec{c}$ that is orthogonal to both:
$$\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix}, \quad \vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}$$

**Method:**
Let $\vec{c} = \begin{pmatrix} x \\ y \\ z \end{pmatrix}$

Set up system of equations:
- $\vec{c} \cdot \vec{a} = 0$: ${{a1}}x + {{a2}}y + {{a3}}z = 0$
- $\vec{c} \cdot \vec{b} = 0$: ${{b1}}x + {{b2}}y + {{b3}}z = 0$

Choose a value for one variable (e.g., $z = 1$) and solve for the others.

**Note:** There are infinitely many solutions (any scalar multiple works).

### 14. Component Perpendicular to Vector
Decompose $\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix}$ into components parallel and perpendicular to $\vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}$.

**Decomposition:**
$$\vec{a} = \vec{a}_{\parallel} + \vec{a}_{\perp}$$

where:
- $\vec{a}_{\parallel} = \text{proj}_{\vec{b}}\vec{a} = \frac{\vec{a} \cdot \vec{b}}{|\vec{b}|^2}\vec{b}$ (parallel component)
- $\vec{a}_{\perp} = \vec{a} - \vec{a}_{\parallel}$ (perpendicular component)

a) Calculate $\vec{a}_{\parallel}$
b) Calculate $\vec{a}_{\perp}$
c) Verify: $\vec{a}_{\perp} \cdot \vec{b} = 0$
d) Verify: $\vec{a}_{\parallel} + \vec{a}_{\perp} = \vec{a}$

### 15. Power in Physics
A force $\vec{F} = \begin{pmatrix} {{fx}} \\ {{fy}} \\ {{fz}} \end{pmatrix}$ N acts on an object moving with velocity $\vec{v} = \begin{pmatrix} {{vx}} \\ {{vy}} \\ {{vz}} \end{pmatrix}$ m/s.

**Power formula:**
$$P = \vec{F} \cdot \vec{v}$$

a) Calculate the power $P$ (in Watts)
b) If the force remains constant but the object changes direction to velocity $\vec{v}' = \begin{pmatrix} {{v2x}} \\ {{v2y}} \\ {{v2z}} \end{pmatrix}$ m/s (same magnitude), calculate the new power
c) What velocity direction (same magnitude) would result in zero power?

**Zero power condition:** $\vec{v} \perp \vec{F}$ (velocity perpendicular to force)

## Task Requirements
- Use 3D vectors predominantly
- Include both algebraic calculations and geometric interpretations
- Require angle calculations in degrees (and sometimes radians)
- Mix pure mathematical problems with physics applications
- Always verify orthogonality conditions explicitly
- Include problems requiring multi-step reasoning
- Use varied numerical values across generations
- Emphasize properties (commutative, distributive, etc.)
- Include verification steps where appropriate
- Make clear distinction between scalar projection (number) and vector projection (vector)
- Use realistic physical units for applications (N, m, J, W)
