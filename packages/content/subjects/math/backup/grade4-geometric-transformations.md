---
id: grade4-geometric-transformations
name: Geometric Transformations
description: Space and shape
grade: 4
ages:
  - 9
  - 10
focus: Space and shape
difficulty: medium
learning_objectives:
  - 'Translate, rotate, reflect'
  - Enlarge and reduce
  - Scale (introduction)
prerequisites:
  - grade-3-symmetry
example_tasks:
  - 'Translate this triangle 5 units right and 3 units up on the coordinate grid'
  - 'Rotate this square 90 degrees clockwise around point P'
  - 'Enlarge this rectangle by a scale factor of 2. What are the new dimensions?'
real_world_context: Geometric transformations are used in video games, animation, map scaling, architecture, and understanding how objects move and change size.
---

# Geometric Transformations

Generate tasks that teach students to perform translations (slides), rotations (turns), reflections (flips), and scaling (enlarging/reducing) on geometric shapes.

## Task Variations

### 1. Translations (Slides)
Move shapes on a coordinate grid:
- **Basic Translation**: "Translate shape {{distance}} units {{direction}}"
- **Two-Direction**: "Move {{horizontal}} units right and {{vertical}} units up"
- **Describing Translation**: "Shape A moved to position B. Describe the translation"
- **Coordinate Changes**: "Point $({{x}}, {{y}})$ translates {{dx}} right, {{dy}} up. New coordinates?"

Examples:
- Triangle with vertex $(2, 3)$ → Translate 4 right, 2 up → New vertex: $(6, 5)$
- Translation: "5 units left and 3 units down"

### 2. Reflections (Flips)
Reflect shapes across lines:
- **Reflect Across Axis**: "Reflect this shape across the {{axis}}-axis"
- **Vertical/Horizontal Lines**: "Reflect across the line ${{variable}} = {{value}}$"
- **Find Image**: "After reflection, where is point $({{x}}, {{y}})$?"
- **Mirror Lines**: "This shape was reflected. Draw the line of reflection"

Reflection rules:
- Across $x$-axis: $(x, y) \to (x, -y)$
- Across $y$-axis: $(x, y) \to (-x, y)$
- Across $y = x$: $(x, y) \to (y, x)$

### 3. Rotations (Turns)
Rotate shapes around a point:
- **90° Rotation**: "Rotate {{degrees}} clockwise/counterclockwise around point {{center}}"
- **180° Rotation**: "Rotate this shape 180° around the origin"
- **Describing Rotation**: "This shape rotated. What angle and direction?"
- **Multiple Rotations**: "Rotate 90° clockwise twice. What single rotation is this equivalent to?"

Common rotations around origin:
- 90° clockwise: $(x, y) \to (y, -x)$
- 90° counterclockwise: $(x, y) \to (-y, x)$
- 180°: $(x, y) \to (-x, -y)$

### 4. Enlargement and Reduction (Scaling)
Change shape size proportionally:
- **Scale Factor**: "Enlarge this shape by scale factor {{factor}}"
- **Dimensions**: "Rectangle is {{width}} × {{height}}. Double its size. New dimensions?"
- **Reduction**: "Reduce this triangle to half its size"
- **Area Changes**: "When enlarged by factor {{n}}, how does area change?"

Examples:
- Rectangle 4 cm × 6 cm, scale factor 3 → $12 \text{ cm} \times 18 \text{ cm}$
- Square side 8 cm, reduce by 1/2 → side $4 \text{ cm}$
- Scale factor 2 → Area multiplied by $2^2 = 4$

### 5. Combining Transformations
Perform multiple transformations:
- **Two Steps**: "Translate {{direction1}}, then reflect across {{line}}"
- **Three Steps**: "Rotate 90°, translate {{direction}}, then reflect"
- **Order Matters**: "Does translating then rotating give the same result as rotating then translating?"
- **Return to Original**: "What transformation would return this shape to its original position?"

Example sequence:
1. Start: Triangle at $(1, 2)$, $(3, 2)$, $(2, 4)$
2. Translate 2 right → $(3, 2)$, $(5, 2)$, $(4, 4)$
3. Reflect across $x$-axis → $(3, -2)$, $(5, -2)$, $(4, -4)$

### 6. Identifying Transformations
Determine which transformation occurred:
- **Name Transform**: "Shape A became Shape B. What transformation was used?"
- **Multiple Choice**: "Is this a translation, rotation, reflection, or enlargement?"
- **Describe Completely**: "Fully describe the transformation (type, direction/angle, distance/factor)"

Distinguishing features:
- **Translation**: Same orientation, different position
- **Reflection**: Flipped orientation (mirror image)
- **Rotation**: Different orientation, turns around a point
- **Enlargement**: Same shape, different size

### 7. Congruence and Similarity
Understand shape relationships:
- **Congruent Shapes**: "Which transformations create congruent shapes?"
- **Similar Shapes**: "Which transformation creates similar but not congruent shapes?"
- **Testing Congruence**: "Can you transform Shape A to exactly match Shape B using only {{allowed_transformations}}?"

Key concepts:
- **Congruent**: Same size and shape (translation, rotation, reflection)
- **Similar**: Same shape, different size (enlargement/reduction)
- Test: If one transformation or series makes shapes match, they're congruent

### 8. Real-World Applications
Apply transformations to practical contexts:
- **Maps**: "On this map, 1 cm represents {{scale}} m. How is the real building transformed to map scale?"
- **Patterns**: "This wallpaper pattern uses {{transformation}}. Describe how the design repeats"
- **Architecture**: "The building's reflection in the water is what type of transformation?"
- **Games**: "A game character moves {{description}}. Describe the transformation"

Examples:
- Map scale 1:1000 → Reduction by factor 1/1000
- Wallpaper: Repeated translations and rotations
- Water reflection: Reflection across horizontal line
- Game: "Move 3 spaces right, 2 up" → Translation

## Answer Requirements

Provide solutions that:
- Use clear coordinate notation for positions: $(x, y)$
- Show transformations step-by-step with intermediate positions
- Include SVG diagrams showing before and after:

<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- Grid -->
  <line x1="0" y1="100" x2="300" y2="100" stroke="gray" stroke-width="1"/>
  <line x1="150" y1="0" x2="150" y2="200" stroke="gray" stroke-width="1"/>

  <!-- Original triangle -->
  <polygon points="160,110 180,110 170,90" fill="blue" opacity="0.5" stroke="blue" stroke-width="2"/>
  <text x="165" y="115" fill="blue">Original</text>

  <!-- Translated triangle -->
  <polygon points="210,80 230,80 220,60" fill="red" opacity="0.5" stroke="red" stroke-width="2"/>
  <text x="215" y="85" fill="red">After</text>

  <!-- Arrow showing translation -->
  <line x1="175" y1="100" x2="215" y2="70" stroke="green" stroke-width="2" marker-end="url(#arrowhead)"/>
</svg>

- State transformation rules for coordinates when applicable
- Explain scale factors and their effect on dimensions
- Distinguish between congruent (same size) and similar (proportional) shapes
- Use directional language: right/left, up/down, clockwise/counterclockwise
- For combined transformations, number and describe each step clearly
