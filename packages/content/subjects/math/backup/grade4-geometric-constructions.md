---
id: grade4-geometric-constructions
name: Geometric Constructions
description: Space and shape
grade: 4
ages:
  - 9
  - 10
focus: Space and shape
difficulty: medium
learning_objectives:
  - Work with compass and set square
  - Draw circles
  - Parallel and perpendicular lines
prerequisites:
  - grade-3-geometric-figures
example_tasks:
  - 'Draw a circle with center point A and radius 4 cm'
  - 'Construct a line parallel to line AB that passes through point P'
  - 'Draw a perpendicular line to line CD that passes through point Q'
real_world_context: Geometric constructions are essential for technical drawing, architecture, engineering, carpentry, and creating accurate designs.
---

# Geometric Constructions

Generate tasks that teach students to use geometric tools (compass, ruler, set square, protractor) to accurately construct circles, parallel lines, perpendicular lines, and geometric figures.

## Task Variations

### 1. Drawing Circles
Use a compass to create circles:
- **Basic Circle**: "Draw a circle with center {{point}} and radius {{length}} cm"
- **Specified Diameter**: "Draw a circle with diameter {{length}} cm"
- **Multiple Circles**: "Draw {{num}} circles with centers {{points}} and radii {{measurements}}"
- **Concentric Circles**: "Draw two circles with the same center, radii {{r1}} cm and {{r2}} cm"

Key concepts:
- Radius: Distance from center to edge ($r$)
- Diameter: Distance across through center ($d = 2r$)
- Compass: One point stays at center, pencil draws circle

Examples:
- "Draw circle with center A, radius 3 cm"
- "Draw concentric circles: inner radius 2 cm, outer radius 5 cm"

### 2. Constructing Perpendicular Lines
Create lines at right angles (90°):
- **Perpendicular from Point on Line**: "Draw a perpendicular to line AB through point P (on the line)"
- **Perpendicular from Point off Line**: "Draw a perpendicular to line CD through point Q (not on the line)"
- **Perpendicular at Endpoint**: "Construct a perpendicular to line segment EF at point E"
- **Using Set Square**: "Use a set square to draw a perpendicular to this line"

Construction steps (compass method):
1. Place compass at point on line
2. Draw two arcs crossing the line (equal radii)
3. From arc intersections, draw larger arcs above and below
4. Connect where these arcs meet to original point

### 3. Constructing Parallel Lines
Create lines that never intersect:
- **Parallel Through Point**: "Draw a line parallel to AB passing through point P"
- **Specific Distance**: "Construct a line parallel to CD, {{distance}} cm away"
- **Multiple Parallels**: "Draw {{num}} parallel lines, each {{spacing}} cm apart"
- **Using Set Square**: "Use set square and ruler to construct parallel lines"

Set square method:
1. Place set square against ruler along original line
2. Hold ruler firmly, slide set square along it
3. Draw new line at desired position
4. Lines are parallel

### 4. Measuring and Drawing Angles
Use a protractor to create specific angles:
- **Draw Angle**: "Draw an angle of {{degrees}}° with vertex at point A"
- **Measure Angle**: "Measure angle ABC and record its size"
- **Specific Angles**: "Construct angles: 30°, 45°, 60°, 90°, 120°"
- **Angle Bisector**: "Draw a line that divides this {{angle}}° angle in half"

Common angles:
- Right angle: 90°
- Acute angle: Less than 90°
- Obtuse angle: Between 90° and 180°
- Straight angle: 180°

### 5. Constructing Triangles
Build triangles with specific measurements:
- **Three Sides (SSS)**: "Construct triangle with sides {{a}} cm, {{b}} cm, {{c}} cm"
- **Two Sides and Angle (SAS)**: "Draw triangle: sides {{a}} cm and {{b}} cm with {{angle}}° between them"
- **Side and Two Angles (ASA)**: "Construct triangle with base {{length}} cm and angles {{angle1}}° and {{angle2}}° at the ends"
- **Right Triangle**: "Draw right triangle with legs {{a}} cm and {{b}} cm"

Construction steps (SSS):
1. Draw base of length $a$
2. Set compass to length $b$, draw arc from one end
3. Set compass to length $c$, draw arc from other end
4. Connect intersection point to both ends

### 6. Constructing Quadrilaterals
Build four-sided shapes:
- **Rectangle**: "Construct rectangle {{width}} cm × {{height}} cm"
- **Square**: "Draw a square with side length {{length}} cm"
- **Parallelogram**: "Construct parallelogram with base {{base}} cm, side {{side}} cm, angle {{angle}}°"
- **Using Properties**: "Build a quadrilateral where opposite sides are parallel and equal"

Rectangle construction:
1. Draw base {{width}} cm
2. Construct perpendiculars at both ends
3. Mark {{height}} cm on each perpendicular
4. Connect the two marks

### 7. Creating Regular Polygons
Construct shapes with equal sides and angles:
- **Equilateral Triangle**: "Draw an equilateral triangle with side {{length}} cm"
- **Regular Hexagon**: "Construct a regular hexagon with side {{length}} cm"
- **Using Circle**: "Inscribe a regular {{n}}-gon in a circle of radius {{r}} cm"

Hexagon in circle method:
1. Draw circle with compass
2. Keep same radius setting
3. Mark point on circle, draw arc from it
4. Continue around circle - radius equals side length for hexagon

### 8. Complex Constructions
Combine multiple techniques:
- **Geometric Design**: "Create a pattern using {{shapes}} with {{constraints}}"
- **Tangent Lines**: "Draw two circles that are tangent (touching at exactly one point)"
- **Inscribed Shapes**: "Draw a circle, then inscribe a square inside it"
- **Problem Solving**: "Construct a triangle with perimeter {{total}} cm where all sides are different"

Example: Flower pattern
- Draw central circle
- Draw 6 circles of same radius around it (centers on first circle)
- Creates petal pattern

## Answer Requirements

Provide solutions that:
- List required tools: compass, ruler, set square, protractor
- Show step-by-step construction instructions numbered clearly
- Use SVG diagrams to illustrate construction steps:

<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- Constructing perpendicular line -->
  <!-- Original line -->
  <line x1="50" y1="150" x2="250" y2="150" stroke="black" stroke-width="2"/>
  <text x="240" y="170">Line AB</text>

  <!-- Point P on line -->
  <circle cx="150" cy="150" r="3" fill="red"/>
  <text x="155" y="145">P</text>

  <!-- Perpendicular line -->
  <line x1="150" y1="50" x2="150" y2="150" stroke="blue" stroke-width="2" stroke-dasharray="5,5"/>

  <!-- Right angle marker -->
  <rect x="145" y="145" width="10" height="10" fill="none" stroke="red" stroke-width="1"/>

  <!-- Construction arcs (light) -->
  <circle cx="150" cy="150" r="40" fill="none" stroke="gray" stroke-width="1" opacity="0.5"/>
</svg>

- Include measurements and labels on diagrams
- Explain why constructions work (e.g., "compass arcs ensure equal distances")
- Note accuracy requirements (e.g., "use sharp pencil for precise points")
- Mention common mistakes to avoid
- For parallel/perpendicular tests, show how to verify (measure distances, check angles)
- Use proper geometric notation: Line AB, Point P, Angle ABC
- Indicate which tools are needed for each construction method
