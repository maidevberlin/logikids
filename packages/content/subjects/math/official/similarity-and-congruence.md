---
id: similarity-congruence
name: Similarity and Congruence
description: Understanding congruent and similar figures with applications to scaling
grade: 8
ages:
  - 13
  - 15
focus: Congruence criteria (SSS, SAS, ASA, AAS), similarity criteria (AA, SAS, SSS), scale factors, proportional reasoning
difficulty: medium
learning_objectives:
  - Determine congruence using SSS, SAS, ASA, AAS criteria
  - Identify similar figures and scale factors
  - Apply properties of similar triangles
  - Use similarity for indirect measurement
  - Solve problems involving proportional sides
prerequisites: []
example_tasks:
  - Two triangles have all three sides equal. Are they congruent? Which criterion applies?
  - A triangle has sides 3 cm, 4 cm, 5 cm. A similar triangle has shortest side 6 cm. Find the other sides
  - A 1.8 m tall person casts a 2.4 m shadow. A tree casts a 12 m shadow. How tall is the tree?
real_world_context: Map scales, model building, shadow problems, indirect measurement, photographic enlargement
---

# Similarity and Congruence Tasks

Create mathematics problems that explore congruent and similar figures. Problems should help students apply congruence criteria, identify similar figures, work with scale factors, and use similarity for indirect measurement in real-world contexts.

**Vary the problem structure:**
- **Congruence identification**: Determine if two triangles are congruent using SSS (Side-Side-Side), SAS (Side-Angle-Side), ASA (Angle-Side-Angle), or AAS (Angle-Angle-Side) criteria
- **Scale factor calculation**: Given corresponding sides of similar figures, calculate scale factor k using $k = \frac{\text{new length}}{\text{original length}}$
- **Finding corresponding sides**: Given one or two pairs of corresponding sides in similar figures, use proportions to find unknown sides: $\frac{a}{a'} = \frac{b}{b'} = \frac{c}{c'}$
- **Similar triangle identification**: Determine if triangles are similar using AA (Angle-Angle), SAS (Side-Angle-Side with proportional sides), or SSS (all sides proportional) similarity criteria
- **Shadow problems**: Use similar triangles to find heights - person and shadow compared to tree and shadow
- **Map scale problems**: Convert between map distances and real distances using scale factor (e.g., 1:50000)
- **Area ratio**: Calculate area ratio of similar figures - area ratio equals square of scale factor: $\frac{A_2}{A_1} = k^2$
- **Model building**: Given scale factor, convert between model dimensions and real dimensions
- **Indirect measurement**: Use mirror method or stick method with similar triangles to measure heights
- **Perimeter ratio**: Calculate perimeter ratio of similar figures - perimeter ratio equals scale factor: $\frac{P_2}{P_1} = k$

**Vary the content/context:**
- **Maps and geography**: Map scales, distance conversion, area calculation on maps, scale models of terrain
- **Architecture and construction**: Building models, scale drawings, architectural plans, miniature replicas
- **Photography**: Image enlargement and reduction, aspect ratios, photo scaling
- **Shadow measurement**: Using shadows to measure tree heights, building heights, flagpole heights
- **Mirror method**: Using ground mirror reflection to measure heights indirectly
- **Art and design**: Scaling artwork, proportional drawing, enlarging patterns
- **Manufacturing**: Scale models, prototype to production scaling

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 14): Simple congruence identification with clear matching sides/angles, basic similarity with integer scale factors (2, 3, 4), straightforward shadow problems with clear proportions, one-step calculations
- **For middle ages** ({{age}} 14-15): Determine which congruence criterion applies, decimal or fractional scale factors (1.5, 2/3), two-step similarity problems, calculate multiple unknown sides, apply area and perimeter ratios
- **For older ages** ({{age}} >= 16): Prove similarity or congruence from given information, complex multi-step problems, combine with other geometry (Pythagorean theorem, trigonometry), algebraic side lengths, work backwards from area ratios to find scale factor or dimensions

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for relationships: Scale factor $k = \frac{a'}{a}$, area ratio $\frac{A_2}{A_1} = k^2$
- Block for proportion equations:

$$\frac{a}{a'} = \frac{b}{b'} = \frac{c}{c'} = k$$

$$\text{If } \frac{A_2}{A_1} = k^2 \text{, then } k = \sqrt{\frac{A_2}{A_1}}$$

**Tables for corresponding measurements:**

| Original | Scale Factor | New Figure |
|----------|--------------|------------|
| 3 cm | k = 2 | 6 cm |
| 4 cm | k = 2 | 8 cm |
| 5 cm | k = 2 | 10 cm |

| Figure | Perimeter | Area |
|--------|-----------|------|
| Original | 12 cm | 6 cm² |
| Scaled (k=3) | 36 cm | 54 cm² |

**SVG diagrams for similarity and congruence:**

Use SVG to show:
- Two congruent triangles with matching marks for equal sides and angles
- Two similar triangles with corresponding sides labeled
- Shadow problem setup (person/object and their shadows)
- Map with scale bar
- Grid showing enlargement or reduction of a shape
- Mirror method diagram for indirect measurement

Example SVG for similar triangles:
```svg
<svg viewBox="0 0 450 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Small triangle -->
  <polygon points="50,200 150,200 150,100" fill="none" stroke="#3b82f6" stroke-width="2"/>
  <text x="100" y="220" font-size="14">3</text>
  <text x="160" y="150" font-size="14">4</text>
  <text x="90" y="145" font-size="14">5</text>
  <!-- Large triangle -->
  <polygon points="200,250 400,250 400,50" fill="none" stroke="#10b981" stroke-width="2"/>
  <text x="300" y="270" font-size="14">6</text>
  <text x="410" y="150" font-size="14">8</text>
  <text x="290" y="145" font-size="14">10</text>
  <!-- Scale factor -->
  <text x="200" y="30" font-size="16" fill="#ef4444">k = 2</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Identify congruence with all information clearly given, integer scale factors (2, 3, 4), one proportion to solve, straightforward shadow or map problems with direct calculation
- **Medium**: Determine which congruence or similarity criterion applies, non-integer scale factors (1.5, 2.5, 0.75), find multiple unknown sides, apply area or perimeter ratios, two-step problems
- **Hard**: Prove congruence or similarity from minimal information, complex proportional reasoning with 3+ unknowns, work backwards from areas to find scale factor or original dimensions, combine with Pythagorean theorem or trigonometry, algebraic side lengths

**Include variety in numerical values:**
- Simple scale factors: 2, 3, 4, 5 (for easy problems)
- Decimal scale factors: 1.5, 2.5, 0.5, 1.2, 3.5
- Fractional scale factors: 1/2, 2/3, 3/4, 3/2
- Map scales: 1:50000, 1:100000, 1:25000
- Shadow lengths: person 1.6-2.0 m, tree 8-15 m, shadows 1-12 m
- Triangle sides: 3-4-5, 5-12-13, 6-8-10, 8-15-17 (Pythagorean triples work well)
- Model scales: 1:50 (architecture), 1:24 (cars), 1:87 (trains)
- Different unit combinations: cm to m, m to km
- Ensure different answer values each time to prevent memorization
