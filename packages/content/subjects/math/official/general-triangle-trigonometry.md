---
id: general-triangle-trigonometry
name: Trigonometry in General Triangles
description: Applying sine rule, cosine rule, and area formulas to solve any triangle
grade: 10
ages:
  - 15
  - 16
  - 17
focus: Sine rule, cosine rule, area formula with sine, choosing appropriate rule, ambiguous SSA case
difficulty: hard
learning_objectives:
  - Apply the sine rule to find unknown sides or angles
  - Apply the cosine rule to find unknown sides or angles
  - Calculate triangle area using ½ab·sin(C)
  - Determine when to use sine rule vs. cosine rule
  - Solve ambiguous cases (SSA)
prerequisites: []
example_tasks:
  - In triangle ABC, angle A = 50°, angle B = 70°, side a = 8 cm. Find side b using the sine rule
  - In triangle ABC, sides a = 7 cm, b = 9 cm, angle C = 65°. Find side c using the cosine rule
  - Calculate the area of a triangle with sides 8 cm and 6 cm and included angle 50°
real_world_context: Surveying, navigation, engineering, astronomy, distance measurement without direct access
---

# Trigonometry in General Triangles Tasks

Create mathematics problems that explore trigonometric methods for solving any triangle (not just right triangles). Problems should help students apply the sine rule, cosine rule, and area formulas, and determine which method to use in different situations.

**Vary the problem structure:**
- **Sine rule for sides (ASA or AAS)**: Given two angles and one side, use $\frac{a}{\sin(A)} = \frac{b}{\sin(B)} = \frac{c}{\sin(C)}$ to find another side
- **Sine rule for angles (SSA)**: Given two sides and one non-included angle, use sine rule to find another angle: $\sin(B) = \frac{b \cdot \sin(A)}{a}$, then $B = \sin^{-1}(...)$
- **Cosine rule for side (SAS)**: Given two sides and included angle, use $c^2 = a^2 + b^2 - 2ab\cos(C)$ to find third side
- **Cosine rule for angle (SSS)**: Given all three sides, use $\cos(C) = \frac{a^2 + b^2 - c^2}{2ab}$ to find an angle
- **Area formula**: Given two sides and included angle, calculate area using $A = \frac{1}{2}ab\sin(C)$
- **Combined problems**: Find one element using sine/cosine rule, then calculate area or another element
- **Ambiguous case (SSA)**: Given two sides and non-included angle - determine if 0, 1, or 2 triangles possible
- **Find all elements**: Given partial information (AAS, ASA, SAS, or SSS), find all unknown sides and angles
- **Application problems**: Surveying problems, navigation with bearings, distance calculations
- **Choose the method**: Problems where students must determine whether to use sine rule, cosine rule, or both

**Vary the content/context:**
- **Surveying**: Triangulation to measure distances, land boundaries, inaccessible distances
- **Navigation**: Ship or aircraft navigation, bearing calculations, course plotting, position fixing
- **Engineering**: Structural triangulation, bridge design, roof truss calculations
- **Astronomy**: Angular distances between stars, parallax measurements, celestial triangles
- **Search and rescue**: Locating position from multiple observations, optimal search patterns
- **Architecture**: Irregularly shaped plots, non-rectangular room layouts, angular measurements
- **Sports**: Golf course design, orienteering, trajectory planning

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 16): Clear identification of which rule to use (explicitly state or make obvious from given information), ASA and SAS cases only, integer or simple decimal angles, one or two calculation steps, avoid ambiguous case
- **For middle ages** ({{age}} 16-17): Mix of sine and cosine rule problems requiring students to choose, SSS and AAS cases, calculate multiple unknowns in sequence, find all triangle elements, area calculations combined with side/angle finding
- **For older ages** ({{age}} >= 18): Ambiguous SSA cases requiring analysis of number of solutions, complex multi-step problems, application problems with bearings and navigation, prove impossibility of certain triangles, optimization problems, 3D applications

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for rules: Sine rule $\frac{a}{\sin(A)} = \frac{b}{\sin(B)}$, Cosine rule $c^2 = a^2 + b^2 - 2ab\cos(C)$
- Block for key formulas:

$$\frac{a}{\sin(A)} = \frac{b}{\sin(B)} = \frac{c}{\sin(C)} \text{ (Sine Rule)}$$

$$c^2 = a^2 + b^2 - 2ab\cos(C) \text{ (Cosine Rule)}$$

$$\cos(C) = \frac{a^2 + b^2 - c^2}{2ab}$$

$$\text{Area} = \frac{1}{2}ab\sin(C)$$

**Tables for given and unknown values:**

| Element | Given | Unknown |
|---------|-------|---------|
| Side a | 8 cm | - |
| Angle A | 50° | - |
| Angle B | 70° | - |
| Side b | ? | To find |

| Rule | When to Use | Example |
|------|-------------|---------|
| Sine Rule | ASA, AAS, SSA | Two angles + one side |
| Cosine Rule | SAS, SSS | Two sides + included angle |

**SVG diagrams for general triangles:**

Use SVG to show:
- Non-right triangles with labeled sides (a, b, c) and angles (A, B, C)
- Given information highlighted in one color, unknown in another
- Surveying setup with two observation points
- Navigation problem with bearings and distances
- Triangle with measurements for area calculation
- Ambiguous case showing two possible triangles

Example SVG for labeled general triangle:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Triangle -->
  <polygon points="100,250 350,250 200,80" fill="none" stroke="#3b82f6" stroke-width="3"/>
  <!-- Vertices -->
  <circle cx="100" cy="250" r="4" fill="#ef4444"/>
  <circle cx="350" cy="250" r="4" fill="#ef4444"/>
  <circle cx="200" cy="80" r="4" fill="#ef4444"/>
  <!-- Vertex labels -->
  <text x="85" y="270" font-size="18" font-weight="bold">A</text>
  <text x="355" y="270" font-size="18" font-weight="bold">B</text>
  <text x="200" y="70" font-size="18" font-weight="bold">C</text>
  <!-- Side labels -->
  <text x="225" y="275" font-size="16" fill="#3b82f6">c</text>
  <text x="140" y="165" font-size="16" fill="#3b82f6">b</text>
  <text x="280" y="165" font-size="16" fill="#3b82f6">a</text>
  <!-- Angle labels -->
  <text x="115" y="240" font-size="14" fill="#10b981">A</text>
  <text x="330" y="240" font-size="14" fill="#10b981">B</text>
  <text x="200" y="105" font-size="14" fill="#10b981">C</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Clearly state which rule to use or make it obvious (ASA → sine rule, SAS → cosine rule), one rule application to find one unknown, integer or simple angles (30°, 45°, 60°), avoid ambiguous cases
- **Medium**: Students choose appropriate rule from given information, two-step problems (find side/angle, then find another), use both sine and cosine rules in one problem, calculate area after finding needed measurements, angles requiring calculator
- **Hard**: Ambiguous SSA cases, find all six elements of triangle from three given, complex application problems requiring triangle setup, navigation with bearings, prove triangle impossibility, multi-step optimization, 3D extensions

**Include variety in numerical values:**
- Angles: 35°, 45°, 50°, 65°, 70°, 80°, 95°, 110° (ensure angles sum to 180° in triangle)
- Side lengths: 5-15 cm for basic problems, 50-200 m for surveying/navigation
- Different given information patterns:
  - ASA: angle-side-angle (use sine rule)
  - AAS: angle-angle-side (use sine rule)
  - SAS: side-angle-side (use cosine rule)
  - SSS: side-side-side (use cosine rule)
  - SSA: side-side-angle (sine rule, check for ambiguous case)
- Mix of acute and obtuse triangles
- Realistic contexts: surveying distances 100-1000 m, navigation distances 5-50 km, bearings 000°-360°
- For area problems: sides 6-12 cm with angles 40°-80°
- Ensure angle sum equals 180° when multiple angles given
- Vary which elements are given and which must be found
- Include problems where cosine is negative (obtuse angle)
