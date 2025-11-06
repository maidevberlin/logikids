---
id: integration-applications
name: Applications of Integration
description: Using integration to calculate areas, volumes, and solve applied problems
grade: 12
ages:
  - 17
  - 18
  - 19
focus: Area between curves, volumes by disk and shell methods, arc length, surface area of revolution, work and force applications, average value of functions
difficulty: hard
learning_objectives:
  - Calculate areas between curves
  - Determine volumes of solids of revolution
  - Find arc length of curves
  - Apply integration to physics problems (work, center of mass)
  - Solve accumulation problems
prerequisites:
  - integration
  - derivatives
  - geometric-shapes
example_tasks:
  - Find the area between y = x² and y = x from x = 0 to x = 1
  - Calculate the volume when y = √x is rotated about the x-axis from x = 0 to x = 4
  - Determine the work done lifting a 500 N object 10 meters against gravity
real_world_context: Tank volume calculations, work done by forces, total distance traveled, population accumulation
---

# Applications of Integration Tasks

Create calculus problems that apply integration to calculate geometric quantities (area, volume, arc length) and physical quantities (work, center of mass). Problems should help students visualize integration as accumulation and apply it to diverse real-world contexts.

**Vary the problem structure:**
- **Area between two curves**: Calculate $\int_a^b [f(x) - g(x)]\,dx$ where $f(x) \geq g(x)$ on $[a,b]$, such as area between parabola and line
- **Area with respect to y**: For curves better expressed as functions of $y$, calculate $\int_c^d [g(y) - h(y)]\,dy$
- **Volume by disk method**: Rotate $y = f(x)$ about x-axis: $V = \pi\int_a^b [f(x)]^2\,dx$
- **Volume by washer method**: Rotate region between two curves: $V = \pi\int_a^b \{[f(x)]^2 - [g(x)]^2\}\,dx$
- **Volume by shell method**: Rotate about y-axis using shells: $V = 2\pi\int_a^b x \cdot f(x)\,dx$
- **Arc length**: Calculate length of curve using $L = \int_a^b \sqrt{1 + [f'(x)]^2}\,dx$
- **Surface area of revolution**: Find surface area when curve rotates: $S = 2\pi\int_a^b f(x)\sqrt{1 + [f'(x)]^2}\,dx$
- **Work problems**: Calculate work $W = \int_a^b F(x)\,dx$ where force varies with position (spring, lifting rope, pumping water)
- **Average value of function**: Find average $\bar{f} = \frac{1}{b-a}\int_a^b f(x)\,dx$ over interval $[a,b]$
- **Accumulation from rate**: Given rate function $r(t)$, find total accumulation $\int_0^T r(t)\,dt$ (distance from velocity, total production from rate)
- **Center of mass**: Calculate $\bar{x} = \frac{1}{M}\int x\,dm$ for continuous mass distribution

**Vary the content/context:**
- **Areas - polynomial curves**: Parabolas, cubic curves, regions between polynomial functions
- **Areas - mixed functions**: Region between polynomial and exponential, or polynomial and trigonometric curve
- **Volumes - simple shapes**: Rotating semicircle (sphere), rotating triangle (cone), rotating rectangle (cylinder)
- **Volumes - complex shapes**: Paraboloid, hyperboloid, torus (if rotating about different axis)
- **Physics - springs**: Work to compress/stretch spring using Hooke's law $F = kx$
- **Physics - gravity**: Work to lift object against constant gravity or variable gravitational field
- **Physics - fluid pumping**: Work to pump liquid from tank (force increases with depth)
- **Physics - cables/ropes**: Lifting cable where weight increases with length
- **Economics**: Consumer surplus $\int_0^Q [D(q) - P]\,dq$, producer surplus
- **Biology**: Total population growth $\int_0^T r(t)\,dt$ where $r(t)$ is growth rate

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 18): Simple area between curve and x-axis, basic disk method volumes (rotating simple function), work with constant force, average value of polynomial
- **For middle ages** ({{age}} 18): Area between two curves, washer method, shell method for simple functions, work with linearly varying force (spring), accumulation problems
- **For older ages** ({{age}} >= 19): Complex volume problems requiring choice of method, arc length and surface area, work with non-linear force, center of mass, multi-step applications combining concepts

**Use appropriate formats:**

**LaTeX for formulas:**
- Area between curves: $A = \int_a^b [f(x) - g(x)]\,dx$
- Volume formulas in block form:

**Volume by Disk Method:**
$$V = \pi\int_a^b [f(x)]^2\,dx$$

**Volume by Washer Method:**
$$V = \pi\int_a^b \{[R(x)]^2 - [r(x)]^2\}\,dx$$
where $R(x)$ is outer radius, $r(x)$ is inner radius

**Volume by Shell Method:**
$$V = 2\pi\int_a^b (\text{radius})(\text{height})\,dx = 2\pi\int_a^b x \cdot f(x)\,dx$$

**Arc Length:**
$$L = \int_a^b \sqrt{1 + [f'(x)]^2}\,dx$$

**Work:**
$$W = \int_a^b F(x)\,dx$$

**Average Value:**
$$\bar{f} = \frac{1}{b-a}\int_a^b f(x)\,dx$$

**Tables for numerical integration:**

| Interval | $f(x) - g(x)$ | Area contribution |
|----------|---------------|-------------------|
| [0, 0.5] | 0.25          | 0.125             |
| [0.5, 1] | 0.75          | 0.375             |

**SVG diagrams for integration applications:**

Use SVG to show:
- Shaded region between two curves with labeled curves and limits
- 3D solid of revolution showing disk or washer cross-section
- Representative disk perpendicular to axis of rotation (thickness $dx$)
- Shell method: cylindrical shell with radius, height, and thickness labeled
- Force diagram for work problems (spring, rope, fluid)
- Cross-sectional view of rotating region
- Graph of rate function with shaded area representing total accumulation

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Area under single curve (above x-axis), volume by rotating simple function about x-axis using disk method, work with constant force $W = F \cdot d$
- **Medium**: Area between two curves with clear intersection points, volume by washer method, volume by shell method for x-rotation, work with spring force, average value calculations
- **Hard**: Finding intersection points algebraically, choosing optimal method for volume (disk vs shell), arc length and surface area, work with variable density or depth-dependent force, center of mass, combined multi-step problems

**Include variety in numerical values:**
- Different curve functions: $y = x^2$, $y = \sqrt{x}$, $y = e^x$, $y = \sin(x)$
- Various integration limits: [0, 1], [0, 2], [1, 4], [0, π]
- Different axes of rotation: x-axis, y-axis, $y = k$, $x = k$
- Multiple intersection points to calculate
- Various spring constants: $k = 100$ N/m, $k = 50$ N/m
- Different forces and distances in work problems
- Varied densities and volumes in fluid problems
- Ensure each problem has unique numerical answer based on setup
