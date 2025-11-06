---
id: cross-product
name: Cross Product (Vector Product)
description: Vectors and analytical geometry
grade: 12
ages:
  - 17
  - 18
  - 19
focus: Vectors and analytical geometry
difficulty: hard
learning_objectives:
  - Calculate cross product of vectors
  - Determine area of parallelograms and triangles
  - Find vectors perpendicular to given vectors
  - Apply cross product to physics problems (torque, angular momentum)
prerequisites:
  - vectors-basics
  - scalar-product
example_tasks:
  - Calculate $\vec{a} \times \vec{b}$ for given vectors
  - Find area of parallelogram spanned by two vectors
  - Determine if vectors are parallel using cross product
real_world_context: The cross product is essential in physics for calculating torque, angular momentum, magnetic force, and in computer graphics for determining surface normals and detecting whether points are clockwise or counterclockwise.
---

# Cross Product (Vector Product)

Create diverse problems for understanding and applying the cross product (vector product) of vectors, including perpendicular vector calculations, area calculations, and applications in geometry and physics.

## Problem Variations

### 1. Basic Cross Product Calculation
Calculate the cross product of vectors:
$$\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix}, \quad \vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}$$

**Formula using determinant notation:**
$$\vec{a} \times \vec{b} = \begin{pmatrix} a_2b_3 - a_3b_2 \\ a_3b_1 - a_1b_3 \\ a_1b_2 - a_2b_1 \end{pmatrix}$$

**Mnemonic (determinant form):**
$$\vec{a} \times \vec{b} = \begin{vmatrix} \vec{e}_1 & \vec{e}_2 & \vec{e}_3 \\ a_1 & a_2 & a_3 \\ b_1 & b_2 & b_3 \end{vmatrix}$$

a) Calculate $\vec{a} \times \vec{b}$
b) Calculate $\vec{b} \times \vec{a}$
c) Verify: $\vec{b} \times \vec{a} = -(\vec{a} \times \vec{b})$ (anti-commutative property)

### 2. Perpendicularity Verification
For the cross product $\vec{c} = \vec{a} \times \vec{b}$ calculated above:

a) Verify $\vec{c} \perp \vec{a}$ by calculating $\vec{c} \cdot \vec{a}$
b) Verify $\vec{c} \perp \vec{b}$ by calculating $\vec{c} \cdot \vec{b}$

**Property:** The cross product $\vec{a} \times \vec{b}$ is perpendicular to both $\vec{a}$ and $\vec{b}$.

This means:
- $(\vec{a} \times \vec{b}) \cdot \vec{a} = 0$
- $(\vec{a} \times \vec{b}) \cdot \vec{b} = 0$

### 3. Area of Parallelogram
Calculate the area of the parallelogram spanned by vectors:
$$\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix}, \quad \vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}$$

**Formula:**
$$A_{parallelogram} = |\vec{a} \times \vec{b}|$$

**Steps:**
1. Calculate $\vec{a} \times \vec{b}$
2. Calculate the magnitude $|\vec{a} \times \vec{b}|$
3. This is the area

### 4. Area of Triangle
Given triangle with vertices $A({{x1}}, {{y1}}, {{z1}})$, $B({{x2}}, {{y2}}, {{z2}})$, $C({{x3}}, {{y3}}, {{z3}})$.

**Formula:**
$$A_{triangle} = \frac{1}{2}|\vec{AB} \times \vec{AC}|$$

**Steps:**
1. Find vectors $\vec{AB}$ and $\vec{AC}$
2. Calculate $\vec{AB} \times \vec{AC}$
3. Calculate magnitude
4. Divide by 2

**Why?** The triangle has half the area of the parallelogram spanned by $\vec{AB}$ and $\vec{AC}$.

### 5. Finding Perpendicular Vector
Find a vector perpendicular to both:
$$\vec{u} = \begin{pmatrix} {{u1}} \\ {{u2}} \\ {{u3}} \end{pmatrix}, \quad \vec{v} = \begin{pmatrix} {{v1}} \\ {{v2}} \\ {{v3}} \end{pmatrix}$$

a) Calculate $\vec{n} = \vec{u} \times \vec{v}$ (normal vector)
b) Verify orthogonality: $\vec{n} \cdot \vec{u} = 0$ and $\vec{n} \cdot \vec{v} = 0$
c) Find a unit normal vector: $\vec{n}_0 = \frac{\vec{n}}{|\vec{n}|}$

**Application:** Normal vectors are used for plane equations.

### 6. Parallel Vectors Test
Determine if vectors $\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix}$ and $\vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}$ are parallel.

**Method using cross product:**
Vectors are parallel if and only if $\vec{a} \times \vec{b} = \vec{0}$.

a) Calculate $\vec{a} \times \vec{b}$
b) Is it the zero vector?
c) If not parallel, what is the area of the parallelogram they span?

### 7. Scalar Triple Product (Volume)
Calculate the volume of the parallelepiped spanned by:
$$\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix}, \quad \vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}, \quad \vec{c} = \begin{pmatrix} {{c1}} \\ {{c2}} \\ {{c3}} \end{pmatrix}$$

**Scalar triple product:**
$$V = |\vec{a} \cdot (\vec{b} \times \vec{c})|$$

**Steps:**
1. Calculate $\vec{b} \times \vec{c}$
2. Calculate $\vec{a} \cdot (\vec{b} \times \vec{c})$
3. Take absolute value

**Geometric meaning:** Volume of parallelepiped with edges $\vec{a}$, $\vec{b}$, $\vec{c}$.

**Volume of tetrahedron:** $V_{tetrahedron} = \frac{1}{6}|\vec{a} \cdot (\vec{b} \times \vec{c})|$

### 8. Torque in Physics
A force $\vec{F} = \begin{pmatrix} {{fx}} \\ {{fy}} \\ {{fz}} \end{pmatrix}$ N is applied at point $P$ whose position vector from the pivot point $O$ is $\vec{r} = \begin{pmatrix} {{rx}} \\ {{ry}} \\ {{rz}} \end{pmatrix}$ m.

**Torque formula:**
$$\vec{\tau} = \vec{r} \times \vec{F}$$

a) Calculate the torque vector $\vec{\tau}$ (in N·m)
b) Calculate the magnitude $|\vec{\tau}|$
c) The torque is perpendicular to which plane?

**Physical meaning:** Torque measures the rotational effect of a force.

### 9. Lagrange Identity
Verify the Lagrange identity for given vectors:
$$|\vec{a} \times \vec{b}|^2 = |\vec{a}|^2|\vec{b}|^2 - (\vec{a} \cdot \vec{b})^2$$

Given: $\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix}$, $\vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}$

**Calculate:**
1. Left side: $|\vec{a} \times \vec{b}|^2$
   - Find $\vec{a} \times \vec{b}$
   - Square its magnitude
2. Right side: $|\vec{a}|^2|\vec{b}|^2 - (\vec{a} \cdot \vec{b})^2$
   - Calculate each term
3. Verify equality

### 10. Relationship Between Cross and Dot Products
For $\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix}$ and $\vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}$:

a) Calculate $|\vec{a} \times \vec{b}|$ (magnitude of cross product)
b) Calculate $|\vec{a}| \cdot |\vec{b}| \cdot \sin(\varphi)$ where $\varphi$ is the angle between vectors
   - First find $\varphi$ using $\cos(\varphi) = \frac{\vec{a} \cdot \vec{b}}{|\vec{a}||\vec{b}|}$
   - Then calculate $\sin(\varphi)$
c) Verify: $|\vec{a} \times \vec{b}| = |\vec{a}| \cdot |\vec{b}| \cdot \sin(\varphi)$

**Geometric formula for cross product magnitude:**
$$|\vec{a} \times \vec{b}| = |\vec{a}| \cdot |\vec{b}| \cdot \sin(\varphi)$$

### 11. Coplanar Vectors Test
Determine if vectors $\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix}$, $\vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}$, $\vec{c} = \begin{pmatrix} {{c1}} \\ {{c2}} \\ {{c3}} \end{pmatrix}$ are coplanar.

**Method:**
Vectors are coplanar if their scalar triple product is zero:
$$\vec{a} \cdot (\vec{b} \times \vec{c}) = 0$$

a) Calculate $\vec{b} \times \vec{c}$
b) Calculate $\vec{a} \cdot (\vec{b} \times \vec{c})$
c) Are the vectors coplanar?

**Why?** If coplanar, the parallelepiped they form has zero volume.

### 12. Angular Velocity and Linear Velocity
An object rotates with angular velocity $\vec{\omega} = \begin{pmatrix} {{wx}} \\ {{wy}} \\ {{wz}} \end{pmatrix}$ rad/s about an axis through the origin. A point $P$ has position vector $\vec{r} = \begin{pmatrix} {{rx}} \\ {{ry}} \\ {{rz}} \end{pmatrix}$ m.

**Linear velocity formula:**
$$\vec{v} = \vec{\omega} \times \vec{r}$$

a) Calculate the linear velocity $\vec{v}$ (in m/s)
b) Calculate the speed $|\vec{v}|$
c) Verify that $\vec{v} \perp \vec{r}$ (tangent to circular path)
d) Verify that $\vec{v} \perp \vec{\omega}$ (perpendicular to rotation axis)

### 13. BAC-CAB Rule
Verify the vector triple product identity (BAC-CAB rule):
$$\vec{a} \times (\vec{b} \times \vec{c}) = \vec{b}(\vec{a} \cdot \vec{c}) - \vec{c}(\vec{a} \cdot \vec{b})$$

Given: $\vec{a} = \begin{pmatrix} {{a1}} \\ {{a2}} \\ {{a3}} \end{pmatrix}$, $\vec{b} = \begin{pmatrix} {{b1}} \\ {{b2}} \\ {{b3}} \end{pmatrix}$, $\vec{c} = \begin{pmatrix} {{c1}} \\ {{c2}} \\ {{c3}} \end{pmatrix}$

**Calculate both sides:**
1. Left side: $\vec{a} \times (\vec{b} \times \vec{c})$
   - First find $\vec{b} \times \vec{c}$
   - Then find $\vec{a} \times (result)$
2. Right side: $\vec{b}(\vec{a} \cdot \vec{c}) - \vec{c}(\vec{a} \cdot \vec{b})$
3. Verify equality

### 14. Plane Normal Vector
Find the equation of the plane containing points $A({{x1}}, {{y1}}, {{z1}})$, $B({{x2}}, {{y2}}, {{z2}})$, $C({{x3}}, {{y3}}, {{z3}})$.

**Strategy:**
1. Find vectors $\vec{AB}$ and $\vec{AC}$ in the plane
2. Calculate normal vector: $\vec{n} = \vec{AB} \times \vec{AC}$
3. Plane equation: $\vec{n} \cdot (\vec{r} - \vec{r}_A) = 0$ or $ax + by + cz = d$

**Coordinate form:**
If $\vec{n} = \begin{pmatrix} a \\ b \\ c \end{pmatrix}$, then:
$$ax + by + cz = ax_1 + by_1 + cz_1$$

### 15. Magnetic Force on Moving Charge
A charged particle with charge $q = {{q}}$ C moves with velocity $\vec{v} = \begin{pmatrix} {{vx}} \\ {{vy}} \\ {{vz}} \end{pmatrix}$ m/s through a magnetic field $\vec{B} = \begin{pmatrix} {{bx}} \\ {{by}} \\ {{bz}} \end{pmatrix}$ T.

**Lorentz force formula:**
$$\vec{F} = q(\vec{v} \times \vec{B})$$

a) Calculate the magnetic force $\vec{F}$ (in Newtons)
b) Calculate the magnitude $|\vec{F}|$
c) Verify that $\vec{F} \perp \vec{v}$ (force perpendicular to velocity)
d) Verify that $\vec{F} \perp \vec{B}$ (force perpendicular to field)

**Physical meaning:** The magnetic force is always perpendicular to both velocity and field, causing circular motion.

## Task Requirements
- Use exclusively 3D vectors (cross product is 3D specific)
- Always show detailed calculation steps for cross product
- Include verification of perpendicularity using dot product
- Mix pure mathematical problems with physics applications
- Require area and volume calculations
- Use varied numerical values across generations
- Emphasize geometric interpretations (area, volume, perpendicularity)
- Include problems requiring both cross product and dot product
- Use realistic physical units for applications (N, m, N·m, T, C)
- Show connection between algebraic and geometric formulas
- Include problems testing properties (anti-commutative, triple products)
