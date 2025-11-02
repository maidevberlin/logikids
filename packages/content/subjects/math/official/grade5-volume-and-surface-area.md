---
id: grade5-volume-and-surface-area
name: Volume and Surface Area
description: Measurement
grade: 5
ages:
  - 10
  - 11
focus: Measurement
difficulty: medium
learning_objectives:
  - 'Cuboid: V = a × b × c'
  - 'Cube: V = a³'
  - Surface area of cuboid and cube
  - Volume units
prerequisites:
  - grade-4-volume
example_tasks:
  - 'Cube with a = 4 cm: Calculate V and S'
  - 1 dm³ = __ cm³ = __ l
real_world_context: Understanding volume and surface area is crucial for packing boxes, calculating paint needed for walls, and determining storage capacity of containers.
---

# Volume and Surface Area of Cuboids and Cubes

You will create tasks about calculating volume and surface area of cuboids (rectangular prisms) and cubes. Use LaTeX for formulas and SVG diagrams to visualize 3D shapes. Help students understand the relationship between dimensions, volume, and surface area.

## Problem Variations

### 1. Volume of a Cuboid
Students calculate volume using the formula $V = \text{length} \times \text{width} \times \text{height}$ or $V = a \times b \times c$.

**Examples:**
- A cuboid has length ${{length}}$ cm, width ${{width}}$ cm, and height ${{height}}$ cm. Calculate its volume.
- Calculate the volume of a box that is ${{a}}$ cm long, ${{b}}$ cm wide, and ${{c}}$ cm high.
- A rectangular container has dimensions ${{length}}$ m × ${{width}}$ m × ${{height}}$ m. What is its volume?

**Formula:**
$$V = a \times b \times c$$

Include an SVG diagram:
```svg
<svg width="250" height="200" xmlns="http://www.w3.org/2000/svg">
  <polygon points="50,100 150,100 150,50 50,50" fill="lightblue" stroke="black" stroke-width="2"/>
  <polygon points="150,100 200,130 200,80 150,50" fill="lightsteelblue" stroke="black" stroke-width="2"/>
  <polygon points="50,50 100,80 200,80 150,50" fill="skyblue" stroke="black" stroke-width="2"/>
  <text x="100" y="120" font-size="14">{{length}} cm</text>
  <text x="170" y="115" font-size="14">{{width}} cm</text>
  <text x="25" y="80" font-size="14">{{height}} cm</text>
</svg>
```

### 2. Volume of a Cube
Students calculate volume of a cube using $V = a^3$ where $a$ is the edge length.

**Examples:**
- A cube has an edge length of ${{edge}}$ cm. Calculate its volume.
- What is the volume of a cube with side length ${{a}}$ mm?
- Calculate $V$ for a cube where $a = {{edge}}$ dm.

**Formula:**
$$V = a^3$$

**Example calculation:**
If $a = 5$ cm, then $V = 5^3 = 5 \times 5 \times 5 = 125$ cm³.

### 3. Surface Area of a Cuboid
Students calculate surface area by finding the area of all 6 faces: $S = 2(ab + bc + ac)$.

**Examples:**
- A cuboid has dimensions ${{a}}$ cm, ${{b}}$ cm, and ${{c}}$ cm. Calculate its surface area.
- Calculate the surface area of a box with length ${{length}}$ m, width ${{width}}$ m, and height ${{height}}$ m.
- How much wrapping paper is needed to cover a box that is ${{a}}$ cm × ${{b}}$ cm × ${{c}}$ cm?

**Formula:**
$$S = 2(ab + bc + ac)$$

**Explanation:** A cuboid has 6 faces:
- 2 faces of area $a \times b$
- 2 faces of area $b \times c$
- 2 faces of area $a \times c$

### 4. Surface Area of a Cube
Students calculate surface area of a cube using $S = 6a^2$ where $a$ is the edge length.

**Examples:**
- A cube has an edge length of ${{edge}}$ cm. Calculate its surface area.
- What is the surface area of a cube with side length ${{a}}$ m?
- If a die has edge length ${{edge}}$ mm, what is its total surface area?

**Formula:**
$$S = 6a^2$$

**Explanation:** A cube has 6 identical square faces, each with area $a^2$.

### 5. Combined Volume and Surface Area
Students calculate both volume and surface area for the same shape.

**Examples:**
- A cube has edge length ${{edge}}$ cm. Calculate both its volume and surface area.
- For a cuboid with dimensions ${{a}}$ cm × ${{b}}$ cm × ${{c}}$ cm, find both $V$ and $S$.
- A storage box is ${{length}}$ m long, ${{width}}$ m wide, and ${{height}}$ m high. Calculate its volume and surface area.

### 6. Converting Volume Units
Students convert between cubic units: mm³, cm³, dm³, m³, and relate to liters.

**Examples:**
- Convert ${{value}}$ dm³ to cm³.
- How many liters is ${{value}}$ dm³?
- Convert ${{value}}$ cm³ to mm³.
- A cube has volume ${{value}}$ cm³. How many liters is this?

**Key conversions:**
| From | To | Multiply by |
|------|-----|-------------|
| 1 dm³ | cm³ | 1000 |
| 1 m³ | dm³ | 1000 |
| 1 dm³ | liters | 1 |
| 1 cm³ | mm³ | 1000 |

$$1 \text{ dm}^3 = 1000 \text{ cm}^3 = 1 \text{ liter}$$

### 7. Finding Unknown Dimensions
Students work backwards from volume or surface area to find missing dimensions.

**Examples:**
- A cube has volume ${{volume}}$ cm³. What is its edge length?
- A cuboid has length ${{a}}$ cm, width ${{b}}$ cm, and volume ${{volume}}$ cm³. What is its height?
- If a cube has surface area ${{surfaceArea}}$ cm², what is the length of one edge?

**Example:**
If $V = 64$ cm³ for a cube, then $a^3 = 64$, so $a = \sqrt[3]{64} = 4$ cm.

### 8. Real-World Applications
Students solve practical problems involving volume and surface area.

**Examples:**
- A swimming pool is ${{length}}$ m long, ${{width}}$ m wide, and ${{depth}}$ m deep. How many liters of water does it hold?
- A gift box measures ${{a}}$ cm × ${{b}}$ cm × ${{c}}$ cm. How much wrapping paper is needed to cover it (with no overlap)?
- An aquarium has dimensions ${{length}}$ cm × ${{width}}$ cm × ${{height}}$ cm. Calculate its volume in liters.
- A room is ${{a}}$ m long, ${{b}}$ m wide, and ${{c}}$ m high. How much paint is needed to paint all four walls and the ceiling? (1 liter covers 10 m²)

**Conversion reminder:**
$$1 \text{ m}^3 = 1000 \text{ dm}^3 = 1000 \text{ liters}$$
