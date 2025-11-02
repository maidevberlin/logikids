---
id: grade6-deepening-triangles
name: Deepening Triangles
description: Space and shape
grade: 6
ages:
  - 11
  - 12
focus: Space and shape
difficulty: hard
learning_objectives:
  - 'Special lines (altitude, perpendicular bisector, median, angle bisector)'
  - Triangle constructions with compass and protractor
  - Congruence theorems (basics)
prerequisites:
  - grade-5-triangles
example_tasks:
  - 'Construct a triangle with a = 5 cm, b = 6 cm, c = 4 cm'
real_world_context: Triangle constructions and special lines are used in engineering, architecture, navigation, and surveying to create precise measurements and stable structures.
---

# Advanced Triangle Properties and Constructions

You will create tasks about special lines in triangles (altitudes, medians, angle bisectors, perpendicular bisectors), triangle constructions using compass and protractor, and basic congruence concepts. Use SVG diagrams extensively to visualize these geometric concepts and LaTeX for measurements.

## Problem Variations

### 1. Triangle Construction from Three Sides (SSS)
Students construct triangles given all three side lengths using compass and straightedge.

**Examples:**
- Construct a triangle with sides $a = {{sideA}}$ cm, $b = {{sideB}}$ cm, and $c = {{sideC}}$ cm.
- Draw a triangle ABC where $AB = {{length1}}$ cm, $BC = {{length2}}$ cm, and $AC = {{length3}}$ cm.
- Can you construct a triangle with sides ${{side1}}$ cm, ${{side2}}$ cm, and ${{side3}}$ cm? Check the triangle inequality first.
- Use compass and ruler to construct a triangle with sides $5$ cm, $6$ cm, and $7$ cm.

**Triangle Inequality Check:**
The sum of any two sides must be greater than the third side:
$$a + b > c \quad \text{and} \quad a + c > b \quad \text{and} \quad b + c > a$$

Include an SVG diagram showing construction steps:
```svg
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <line x1="50" y1="150" x2="200" y2="150" stroke="black" stroke-width="2"/>
  <text x="125" y="170" font-size="12" text-anchor="middle">c = {{sideC}} cm</text>
  <circle cx="50" cy="150" r="{{radiusA}}" fill="none" stroke="blue" stroke-width="1" stroke-dasharray="5,5"/>
  <circle cx="200" cy="150" r="{{radiusB}}" fill="none" stroke="red" stroke-width="1" stroke-dasharray="5,5"/>
  <polygon points="50,150 200,150 {{pointCx}},{{pointCy}}" fill="none" stroke="black" stroke-width="2"/>
  <text x="30" y="150" font-size="12">A</text>
  <text x="210" y="150" font-size="12">B</text>
  <text x="{{pointCx}}" y="{{pointCy}}" font-size="12">C</text>
</svg>
```

### 2. Triangle Construction from Two Sides and Included Angle (SAS)
Students construct triangles given two sides and the angle between them.

**Examples:**
- Construct a triangle with sides $a = {{sideA}}$ cm, $b = {{sideB}}$ cm, and the included angle $\gamma = {{angle}}°$.
- Draw triangle ABC where $AB = {{length1}}$ cm, $AC = {{length2}}$ cm, and $\angle A = {{angle}}°$.
- Construct a triangle with two sides of ${{side1}}$ cm and ${{side2}}$ cm meeting at an angle of ${{angle}}°$.

**Construction steps:**
1. Draw side $c$
2. Use protractor to measure angle at one endpoint
3. Draw the second side along the angle ray
4. Connect the endpoints to form the triangle

### 3. Triangle Construction from One Side and Two Adjacent Angles (ASA)
Students construct triangles given one side and the two angles at its endpoints.

**Examples:**
- Construct a triangle with side $c = {{side}}$ cm, $\angle A = {{angleA}}°$, and $\angle B = {{angleB}}°$.
- Draw triangle ABC where $AB = {{length}}$ cm, $\angle A = {{angle1}}°$, and $\angle B = {{angle2}}°$.
- Given side ${{length}}$ cm with angles ${{angle1}}°$ and ${{angle2}}°$ at its endpoints, construct the triangle.

**Angle check:** $\angle A + \angle B$ must be less than $180°$ (since $\angle A + \angle B + \angle C = 180°$).

### 4. Altitudes in Triangles
Students understand and draw altitudes (perpendicular lines from vertices to opposite sides).

**Examples:**
- Draw the altitude from vertex A to side BC in the given triangle.
- How many altitudes does a triangle have?
- In a right triangle, which side serves as the altitude from the right angle?
- Draw all three altitudes of triangle ABC. What do you notice about where they meet?

**Definition:** An altitude is a line segment from a vertex perpendicular to the opposite side (or its extension).

Include an SVG diagram:
```svg
<svg width="250" height="200" xmlns="http://www.w3.org/2000/svg">
  <polygon points="125,30 40,160 210,160" fill="none" stroke="black" stroke-width="2"/>
  <line x1="125" y1="30" x2="125" y2="160" stroke="red" stroke-width="2" stroke-dasharray="5,5"/>
  <circle cx="125" cy="160" r="3" fill="red"/>
  <text x="125" y="20" font-size="12" text-anchor="middle">A</text>
  <text x="30" y="175" font-size="12">B</text>
  <text x="220" y="175" font-size="12">C</text>
  <text x="140" y="100" font-size="11" fill="red">altitude</text>
  <!-- Right angle marker -->
  <path d="M 120,160 L 120,155 L 125,155" fill="none" stroke="red" stroke-width="1"/>
</svg>
```

**Key fact:** All three altitudes meet at a single point called the **orthocenter**.

### 5. Medians in Triangles
Students understand and draw medians (lines from vertices to midpoints of opposite sides).

**Examples:**
- Draw the median from vertex A to side BC.
- The midpoint of BC is M. Draw the median AM.
- How many medians does a triangle have? Where do they meet?
- In triangle ABC, side BC has length ${{length}}$ cm. Where is the midpoint M located?

**Definition:** A median connects a vertex to the midpoint of the opposite side.

**Key fact:** All three medians meet at the **centroid** (center of mass), which divides each median in a 2:1 ratio.

### 6. Angle Bisectors in Triangles
Students understand and draw angle bisectors (lines that divide angles into two equal parts).

**Examples:**
- Draw the angle bisector of $\angle A$ in triangle ABC.
- If $\angle A = {{angle}}°$, what are the two angles created by the angle bisector?
- Draw all three angle bisectors of triangle ABC. Where do they meet?
- The angle bisector of $\angle B$ divides it into two angles. If $\angle B = 80°$, what is each resulting angle?

**Definition:** An angle bisector divides an angle into two congruent (equal) angles.

Include an SVG diagram:
```svg
<svg width="250" height="200" xmlns="http://www.w3.org/2000/svg">
  <polygon points="50,30 40,160 210,160" fill="none" stroke="black" stroke-width="2"/>
  <line x1="50" y1="30" x2="125" y2="160" stroke="blue" stroke-width="2" stroke-dasharray="5,5"/>
  <text x="50" y="20" font-size="12" text-anchor="middle">A</text>
  <text x="30" y="175" font-size="12">B</text>
  <text x="220" y="175" font-size="12">C</text>
  <text x="90" y="100" font-size="11" fill="blue">angle bisector</text>
</svg>
```

**Key fact:** All three angle bisectors meet at the **incenter** (center of the inscribed circle).

### 7. Perpendicular Bisectors
Students understand and draw perpendicular bisectors of sides (perpendicular lines through midpoints).

**Examples:**
- Draw the perpendicular bisector of side AB.
- Side BC has length ${{length}}$ cm. Where is its midpoint, and how do you draw the perpendicular bisector?
- Draw all three perpendicular bisectors. Where do they meet?
- Any point on the perpendicular bisector of AB is equidistant from which two points?

**Definition:** A perpendicular bisector is perpendicular to a side at its midpoint.

**Key fact:** All three perpendicular bisectors meet at the **circumcenter** (center of the circumscribed circle).

### 8. Congruence Criteria (SSS, SAS, ASA)
Students determine if two triangles are congruent based on given information.

**Examples:**
- Triangle ABC has sides $5$ cm, $6$ cm, $7$ cm. Triangle DEF has sides $5$ cm, $6$ cm, $7$ cm. Are they congruent? Which criterion?
- Two triangles have two sides and the included angle equal. Are they congruent? (SAS)
- Triangle ABC has $AB = {{length1}}$ cm, $AC = {{length2}}$ cm, $\angle A = {{angle}}°$. Triangle XYZ has $XY = {{length1}}$ cm, $XZ = {{length2}}$ cm, $\angle X = {{angle}}°$. Are they congruent?
- Which congruence criterion (SSS, SAS, ASA) can you use to prove these triangles are congruent?

**Congruence Criteria:**
| Criterion | What must be equal |
|-----------|-------------------|
| SSS | All three sides |
| SAS | Two sides and the included angle |
| ASA | Two angles and the included side |

**Notation:** Triangle ABC ≅ Triangle DEF means they are congruent.

### 9. Special Points and Lines Combined
Students identify and work with multiple special lines in one triangle.

**Examples:**
- In triangle ABC, name the four special points: orthocenter, centroid, incenter, circumcenter.
- Which special lines meet at the centroid?
- Draw a triangle and construct both the altitude and median from vertex A. Are they the same line?
- In what type of triangle are the altitude, median, angle bisector, and perpendicular bisector from one vertex all the same line?

**Answer to last question:** In an **isosceles triangle**, these lines from the vertex angle to the base are all the same.

### 10. Real-World Applications and Problem Solving
Students apply triangle construction and properties to practical problems.

**Examples:**
- An architect needs to create a triangular support with exact measurements: ${{side1}}$ m, ${{side2}}$ m, ${{side3}}$ m. Describe how to construct it.
- To find the center of a circular table, explain how to use perpendicular bisectors of any two chords (straight lines across the circle).
- A triangular garden has sides of ${{a}}$ m, ${{b}}$ m, and ${{c}}$ m. Where should you place a sprinkler so it's equidistant from all three vertices?
- In navigation, you have bearings to three landmarks. How can you use triangle construction to find your position?

**Hint for sprinkler:** The circumcenter is equidistant from all three vertices.
