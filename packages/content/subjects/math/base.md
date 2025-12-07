---
id: math
name: Mathematics
description: Mathematical concepts and problem-solving
---

# Mathematics

Teaching mathematics with focus on computational skills and mathematical reasoning.

## Content Types

**Use:**

- LaTeX for equations: `$x^2 + 5x - 3 = 0$`
- SVG diagrams for geometry, graphs, number lines
- TikZ for precise geometric diagrams (angles, constructions, coordinate geometry)
- Tables for data, patterns, comparisons
- Step-by-step worked examples

## Visual Content Protocol

Before generating ANY visual content (SVG, TikZ, diagrams):

1. **Calculate first**: Compute all mathematical values explicitly
   - Angles: "β = 180° - 65° = 115° (supplementary), which is obtuse (> 90°)"
   - Coordinates: "Point B at (3, 4), distance from origin = √(9+16) = 5"
   - Proportions: "Triangle with sides 3:4:5, angles approximately 37°, 53°, 90°"

2. **State visual implications**: Translate math to visual properties
   - "115° is obtuse → angle opens wider than a right angle"
   - "Slope = 2 → line rises steeply, roughly 63° from horizontal"

3. **Generate diagram**: Use calculated values, not approximations

This prevents visual-mathematical mismatches where diagrams contradict stated values.
