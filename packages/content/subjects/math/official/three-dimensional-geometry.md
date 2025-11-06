---
id: 3d-geometry
name: 3D Geometry - Volumes and Surface Areas
description: Calculating volumes and surface areas of 3D solids including prisms, pyramids, cylinders, cones, and spheres
grade: 8
ages:
  - 13
  - 14
  - 15
  - 16
focus: Prism volume and surface area, cylinder volume and surface area, pyramid and cone geometry, sphere calculations, composite solids
difficulty: medium
learning_objectives:
  - Calculate volumes and surface areas of prisms and cylinders
  - Calculate volumes and surface areas of pyramids and cones
  - Calculate volume and surface area of spheres
  - Solve problems involving composite solids
  - Apply formulas to real-world contexts
prerequisites: []
example_tasks:
  - Calculate the volume of a rectangular prism with dimensions 5 cm × 3 cm × 4 cm
  - A cylinder has radius 4 cm and height 10 cm. Find its volume and surface area
  - A sphere has radius 6 cm. Calculate its volume
real_world_context: Packaging design, tank capacity, construction materials, architectural planning, volume optimization
---

# 3D Geometry - Volumes and Surface Areas Tasks

Create mathematics problems that explore volumes and surface areas of three-dimensional solids. Problems should help students calculate volumes and surface areas of prisms, cylinders, pyramids, cones, and spheres, and apply these concepts to real-world situations.

**Vary the problem structure:**
- **Rectangular prism (cuboid)**: Volume $V = l \times w \times h$, Surface area $SA = 2(lw + lh + wh)$
- **Cube**: Volume $V = s^3$, Surface area $SA = 6s^2$
- **Triangular prism**: Volume $V = \frac{1}{2}bh \times l$ (base triangle area × length), Surface area includes 2 triangular faces + 3 rectangular faces
- **Cylinder**: Volume $V = \pi r^2 h$, Surface area $SA = 2\pi r^2 + 2\pi rh = 2\pi r(r + h)$
- **Pyramid**: Volume $V = \frac{1}{3} \times \text{base area} \times h$, Surface area = base area + sum of triangular face areas
- **Cone**: Volume $V = \frac{1}{3}\pi r^2 h$, Surface area $SA = \pi r^2 + \pi r s$ where s is slant height
- **Sphere**: Volume $V = \frac{4}{3}\pi r^3$, Surface area $SA = 4\pi r^2$
- **Hemisphere**: Volume $V = \frac{2}{3}\pi r^3$, Surface area $SA = 3\pi r^2$ (curved surface + flat circular base)
- **Composite solids**: Combine multiple shapes (prism + pyramid, cylinder + cone, etc.) to calculate total volume or surface area
- **Work backwards**: Given volume or surface area, find dimensions (radius, height, side length)

**Vary the content/context:**
- **Packaging**: Box design, container capacity, shipping optimization, material usage minimization
- **Construction**: Concrete needed for foundations, paint for walls and ceilings, insulation volume
- **Storage tanks**: Water tanks, fuel tanks, silos, cylindrical and spherical containers
- **Food and cooking**: Ingredient volumes, container capacity, can sizes, baking pan volumes
- **Swimming pools**: Water volume, surface area for lining, rectangular and cylindrical pools
- **Architecture**: Room volumes, dome structures, pyramidal roofs, cylindrical towers
- **Nature**: Volumes of approximately spherical objects (balls, planets, bubbles)

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 14): Focus on rectangular prisms and cylinders, all dimensions clearly given, whole numbers or simple decimals, one formula application, straightforward contexts
- **For middle ages** ({{age}} 14-15): Include pyramids and cones, calculate both volume and surface area, two-step problems (find area then volume), composite shapes with 2 simple solids, decimal values
- **For older ages** ({{age}} >= 16): Spheres and hemispheres, complex composite solids (3+ components), work backwards from volume to find dimensions, optimization problems (minimize surface area for given volume), algebraic dimensions, combined with other concepts

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for simple formulas: Volume of cube $V = s^3$, cylinder $V = \pi r^2 h$
- Block for key formulas:

$$V_{\text{prism}} = \text{base area} \times h$$

$$V_{\text{pyramid}} = \frac{1}{3} \times \text{base area} \times h$$

$$V_{\text{sphere}} = \frac{4}{3}\pi r^3$$

$$SA_{\text{cylinder}} = 2\pi r(r + h)$$

**Tables for comparing solids:**

| Solid | Volume Formula | Surface Area Formula |
|-------|----------------|---------------------|
| Cube | $V = s^3$ | $SA = 6s^2$ |
| Cylinder | $V = \pi r^2 h$ | $SA = 2\pi r(r+h)$ |
| Sphere | $V = \frac{4}{3}\pi r^3$ | $SA = 4\pi r^2$ |

| Dimension | Prism A | Prism B |
|-----------|---------|---------|
| Length | 5 cm | 8 cm |
| Width | 3 cm | 4 cm |
| Height | 4 cm | 2 cm |
| Volume | 60 cm³ | 64 cm³ |

**SVG diagrams for 3D solids:**

Use SVG to show:
- 3D representation of prisms, cylinders, pyramids, cones, spheres
- Labeled dimensions (length, width, height, radius)
- Net diagrams for surface area calculations
- Composite solids with separate components highlighted
- Cross-sections of solids
- Comparison of similar solids with different dimensions

Example SVG for labeled cylinder:
```svg
<svg viewBox="0 0 400 350" xmlns="http://www.w3.org/2000/svg">
  <!-- Cylinder body -->
  <ellipse cx="200" cy="100" rx="80" ry="20" fill="none" stroke="#3b82f6" stroke-width="2"/>
  <line x1="120" y1="100" x2="120" y2="280" stroke="#3b82f6" stroke-width="2"/>
  <line x1="280" y1="100" x2="280" y2="280" stroke="#3b82f6" stroke-width="2"/>
  <ellipse cx="200" cy="280" rx="80" ry="20" fill="none" stroke="#3b82f6" stroke-width="2"/>
  <!-- Dimension lines -->
  <line x1="200" y1="100" x2="280" y2="100" stroke="#ef4444" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="290" y1="100" x2="290" y2="280" stroke="#ef4444" stroke-width="1" stroke-dasharray="3,3"/>
  <!-- Labels -->
  <text x="235" y="95" font-size="16" fill="#ef4444">r</text>
  <text x="295" y="190" font-size="16" fill="#ef4444">h</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Rectangular prisms and cylinders only, all dimensions given directly, whole numbers or simple decimals, one calculation (volume OR surface area), direct formula application
- **Medium**: Include pyramids and cones, calculate both volume and surface area, two-step problems, composite shapes with 2 simple solids, require π ≈ 3.14 or calculator, decimal results
- **Hard**: Spheres and complex composite solids, work backwards from volume/surface area to find dimensions, optimization problems, algebraic dimensions (e.g., radius = 2h), combine multiple concepts (Pythagorean theorem for slant height), 3+ step problems

**Include variety in numerical values:**
- Rectangular prisms: dimensions 3×4×5 cm, 6×8×10 m, 2.5×3.5×4 dm
- Cubes: side lengths 5 cm, 8 m, 3.5 dm
- Cylinders: radius 3-10 cm, height 5-20 cm
- Spheres: radius 4-12 cm
- Pyramids: base sides 6-10 cm, height 8-15 cm
- Cones: radius 4-8 cm, height 10-20 cm, slant height when needed
- Use π ≈ 3.14 for medium difficulty, exact π for advanced
- Different units: cm, m, dm, liters (for volume)
- Realistic contexts: pool dimensions in meters, tank volumes in liters, package dimensions in cm
- Ensure variety in which dimensions are given and which need calculation
