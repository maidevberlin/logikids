---
id: grade5-area-and-perimeter
name: Area and Perimeter
description: Measurement
grade: 5
ages:
  - 10
  - 11
focus: Measurement
difficulty: medium
learning_objectives:
  - Apply formulas for rectangle and square confidently
  - Convert area units
  - Composite figures
prerequisites:
  - grade-4-area-perimeter
example_tasks:
  - 'Convert: 3.5 m² = __ cm²'
  - Calculate area of L-shaped figure
real_world_context: Calculating area and perimeter is crucial for planning room layouts, buying flooring or wallpaper, fencing gardens, and many construction projects.
---

# Area and Perimeter - Problem Variations

Generate tasks that deepen understanding of area and perimeter formulas, unit conversions, and composite figures.

## Variation 1: Rectangle Area and Perimeter
A rectangle has a length of ${{length}}$ cm and a width of ${{width}}$ cm.
a) Calculate the area.
b) Calculate the perimeter.

**Formulas:**
- Area: $A = l \times w$
- Perimeter: $P = 2 \times (l + w)$

**Example:** Length 12 cm, width 8 cm
a) $A = 12 \times 8 = 96$ cm²
b) $P = 2 \times (12 + 8) = 2 \times 20 = 40$ cm

## Variation 2: Area Unit Conversion (m² to cm²)
Convert the following area measurements:

a) ${{value1}}$ m² = ___ cm²
b) ${{value2}}$ cm² = ___ m²

**Remember:** $1$ m² $= 10000$ cm² (because $100$ cm $\times$ $100$ cm)

**Example:**
a) $3.5$ m² $= 3.5 \times 10000 = 35000$ cm²
b) $75000$ cm² $= 75000 \div 10000 = 7.5$ m²

## Variation 3: L-Shaped Composite Figure
Calculate the area of this L-shaped figure by dividing it into two rectangles:

<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="20" width="{{w1}}" height="{{h1}}" fill="none" stroke="black" stroke-width="2"/>
  <rect x="20" y="{{h1+20}}" width="{{w2}}" height="{{h2}}" fill="none" stroke="black" stroke-width="2"/>
  <text x="{{w1/2}}" y="{{h1/2+20}}" font-size="14">{{w1}} cm</text>
  <text x="10" y="{{h1/2+20}}" font-size="14">{{h1}} cm</text>
  <text x="{{w2/2}}" y="{{h1+h2/2+20}}" font-size="14">{{w2}} cm</text>
  <text x="10" y="{{h1+h2/2+20}}" font-size="14">{{h2}} cm</text>
</svg>

**Example:** Top rectangle: $8 \times 3 = 24$ cm², Bottom rectangle: $5 \times 4 = 20$ cm² → Total: $24 + 20 = 44$ cm²

## Variation 4: Finding Missing Dimensions
A rectangle has an area of ${{area}}$ cm² and a length of ${{length}}$ cm. What is the width?

**Formula:** $w = A \div l$

**Example:** Area 96 cm², length 12 cm → $w = 96 \div 12 = 8$ cm

## Variation 5: Square Properties
A square has a side length of ${{side}}$ cm.
a) Calculate the area.
b) Calculate the perimeter.
c) If you double the side length, by what factor does the area increase?

**Example:** Side 6 cm
a) $A = 6 \times 6 = 36$ cm²
b) $P = 4 \times 6 = 24$ cm
c) New side: $12$ cm, new area: $144$ cm² → Factor: $144 \div 36 = 4$ (area quadruples!)

## Variation 6: Comparison Problem
Two rooms need new flooring:
- Room A: ${{lengthA}}$ m × ${{widthA}}$ m
- Room B: ${{lengthB}}$ m × ${{widthB}}$ m

a) Calculate the area of each room.
b) Which room is larger and by how many m²?
c) If flooring costs €${{price}}$ per m², how much will both rooms cost?

**Example:** Room A: $4.5 \times 3.2 = 14.4$ m², Room B: $5 \times 2.8 = 14$ m²
b) Room A larger by $0.4$ m²
c) Total: $(14.4 + 14) \times 25 = 28.4 \times 25 = 710$ euros

## Variation 7: Perimeter with Missing Side
A rectangle has a perimeter of ${{perimeter}}$ cm. One side is ${{side}}$ cm long. How long is the other side?

**Approach:** $P = 2 \times (l + w)$ → ${{perimeter}} = 2 \times ({{side}} + w)$

**Example:** Perimeter 40 cm, one side 12 cm
$40 = 2 \times (12 + w)$ → $20 = 12 + w$ → $w = 8$ cm

## Variation 8: Composite Figure with Subtraction
A large rectangle measures ${{outer_length}}$ cm × ${{outer_width}}$ cm. A smaller rectangle of ${{inner_length}}$ cm × ${{inner_width}}$ cm is cut out from one corner. What is the remaining area?

<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="20" width="200" height="120" fill="lightblue" stroke="black" stroke-width="2"/>
  <rect x="20" y="20" width="80" height="50" fill="white" stroke="black" stroke-width="2"/>
</svg>

**Example:** Large: $15 \times 10 = 150$ cm², Small: $5 \times 4 = 20$ cm² → Remaining: $150 - 20 = 130$ cm²

## Variation 9: Fence Around Garden
A rectangular garden is ${{length}}$ m long and ${{width}}$ m wide. A fence is needed around the entire garden. Fence posts are placed every ${{spacing}}$ meters.
a) How long is the fence (perimeter)?
b) How many fence posts are needed (including corners)?

**Example:** 12 m × 8 m garden, posts every 2 m
a) $P = 2 \times (12 + 8) = 40$ m
b) Posts: $40 \div 2 = 20$ posts
