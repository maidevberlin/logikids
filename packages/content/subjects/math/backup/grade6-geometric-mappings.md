---
id: grade6-geometric-mappings
name: Geometric Mappings
description: Space and shape
grade: 6
ages:
  - 11
  - 12
focus: Space and shape
difficulty: medium
learning_objectives:
  - Translation
  - Rotation
  - Reflection
  - Represent in coordinate system
  - Work with geometry software
prerequisites:
  - grade-5-symmetry
example_tasks:
  - Translate triangle ABC 5 units right and 2 units up. What are the new coordinates?
  - Rotate point (3, 2) by 90° clockwise around the origin. Find the new position.
  - Reflect the shape across the line y = x
  - Describe the transformation that maps triangle A onto triangle B
real_world_context: Computer graphics, animation, game design, tessellations, kaleidoscope patterns, dance choreography
---

# Geometric Mappings

Create tasks where {{child_name}} performs and describes geometric transformations in the coordinate system appropriate for grade 6 (ages {{age}}).

## Task Variations

1. **Translations (Slides)**: Move shapes by a vector. "Translate triangle with vertices $({{2}}, {{3}})$, $({{4}}, {{3}})$, $({{3}}, {{5}})$ by ${{5}}$ units right and ${{2}}$ units down." New point: $(x + 5, y - 2)$. Vary the direction and distance. Use notation: "Translation by vector $({{a}}, {{b}})$".

2. **Reflections across Axes**: Reflect shapes across x-axis or y-axis. "Reflect the point $({{3}}, {{4}})$ across the {{y-axis}}." Across x-axis: $(x, -y)$. Across y-axis: $(-x, y)$. Include shapes with multiple vertices. Show before and after on coordinate grid.

3. **Reflections across Lines**: Reflect across $y = x$ or other lines. "Reflect $({{2}}, {{5}})$ across the line $y = x$." Result: $(5, 2)$ (swap coordinates). Or reflect across $y = -x$: $(x, y) \to (-y, -x)$. Use SVG grids showing the line of reflection.

4. **Rotations around Origin**: Rotate points/shapes around origin. "Rotate $({{3}}, {{2}})$ by ${{90°}}$ {{clockwise/counterclockwise}}$ around the origin."
   - 90° counterclockwise: $(x, y) \to (-y, x)$
   - 90° clockwise: $(x, y) \to (y, -x)$
   - 180°: $(x, y) \to (-x, -y)$
   Vary the angle ({{90°, 180°, 270°}}) and direction.

5. **Identifying Transformations**: Show before and after images and ask students to identify the transformation. "Triangle A has vertices $({{1}}, {{2}})$, $({{3}}, {{2}})$, $({{2}}, {{4}})$. Triangle B has vertices $({{-1}}, {{2}})$, $({{-3}}, {{2}})$, $({{-2}}, {{4}})$. What transformation maps A to B?" (Reflection across y-axis)

6. **Composite Transformations**: Apply multiple transformations in sequence. "Reflect $({{4}}, {{3}})$ across the x-axis, then translate {{2}} units left. What is the final position?" First: $(4, -3)$. Then: $(2, -3)$. Vary the combination and order.

7. **Describing Transformations**: Given two congruent shapes in different positions, describe the transformation(s) needed. "Describe how to map Shape A onto Shape B." May require translation, reflection, rotation, or combination. Multiple correct answers may exist.

8. **Tessellations and Patterns**: Create patterns using transformations. "Start with a triangle at $({{0}}, {{0}})$, $({{2}}, {{0}})$, $({{1}}, {{2}})$. Apply translations to create a tessellation pattern." Or use rotations around a point to create symmetric designs. Describe the transformation(s) used.

Use coordinate grids ({{-10}} to {{10}} on both axes) with clear markings. Show original shape (often called "pre-image") in one color and transformed shape ("image") in another. Use prime notation: A becomes A' after transformation.

For each transformation type, provide:
- **Translation**: Described by vector $(a, b)$ meaning move $a$ units horizontally, $b$ units vertically
- **Reflection**: Described by line of reflection (x-axis, y-axis, $y = x$, etc.)
- **Rotation**: Described by center (usually origin), angle ({{90°, 180°, 270°}}), and direction (clockwise/counterclockwise)

Emphasize that transformations preserve shape and size (isometries). Connect to real applications: computer graphics, video games, architecture, art.
