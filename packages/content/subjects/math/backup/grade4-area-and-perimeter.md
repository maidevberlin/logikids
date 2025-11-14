---
id: grade4-area-and-perimeter
name: Area and Perimeter
description: Measurement
grade: 4
ages:
  - 9
  - 10
focus: Measurement
difficulty: medium
learning_objectives:
  - 'Apply formulas for rectangle (A = a × b, P = 2a + 2b)'
  - 'Area units (cm², m², km²)'
  - Composite figures
prerequisites:
  - grade-3-area
example_tasks:
  - 'Rectangle: a = 8 cm, b = 5 cm. Calculate A and P'
real_world_context: Essential for measuring rooms for flooring or paint, calculating garden sizes, determining fencing needs, or planning sports field layouts.
---

# Area and Perimeter

Create tasks that help students understand and apply formulas for calculating area and perimeter of rectangles and composite shapes.

## Problem Variations

**Variation 1: Basic Rectangle Calculations**
A rectangle has length $a = {{length}}$ cm and width $b = {{width}}$ cm.

Calculate:
1. Area: $A = a \times b$
2. Perimeter: $P = 2a + 2b$

<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="50" y="50" width="{{svg_length}}" height="{{svg_width}}" fill="none" stroke="#3b82f6" stroke-width="2"/>
  <text x="{{mid_x}}" y="40" font-size="14" fill="#3b82f6" text-anchor="middle">{{length}} cm</text>
  <text x="30" y="{{mid_y}}" font-size="14" fill="#3b82f6" text-anchor="middle">{{width}} cm</text>
</svg>

**Variation 2: Real-World Garden Problem**
Maria wants to plant a rectangular vegetable garden. The garden should be ${{length}}$ m long and ${{width}}$ m wide.

a) How much area will the garden cover?
b) How many meters of fencing does Maria need to enclose the garden?

Solution table:

| Measurement | Formula | Calculation | Result |
|-------------|---------|-------------|--------|
| Area | $A = a \times b$ | ${{length}} \times {{width}}$ | ${{area}}$ m² |
| Perimeter | $P = 2a + 2b$ | $2 \times {{length}} + 2 \times {{width}}$ | ${{perimeter}}$ m |

**Variation 3: Comparison Task**
Two rectangles have the same perimeter of ${{perimeter}}$ cm:
- Rectangle A: length = ${{length_a}}$ cm, width = ${{width_a}}$ cm
- Rectangle B: length = ${{length_b}}$ cm, width = ${{width_b}}$ cm

Which rectangle has the larger area? Calculate both areas to verify.

**Variation 4: Missing Dimension Problems**
A rectangle has:
- Area = ${{area}}$ cm²
- Length = ${{length}}$ cm
- Width = ?

Find the missing width using: $b = A \div a$

**Variation 5: Composite Figure (L-Shape)**
Calculate the area of this L-shaped figure by dividing it into two rectangles:

<svg width="350" height="300" xmlns="http://www.w3.org/2000/svg">
  <path d="M 50 50 L 250 50 L 250 150 L 150 150 L 150 250 L 50 250 Z" fill="#e0f2fe" stroke="#3b82f6" stroke-width="2"/>
  <text x="150" y="40" font-size="14" fill="#3b82f6" text-anchor="middle">{{horizontal_long}} cm</text>
  <text x="200" y="100" font-size="14" fill="#3b82f6">{{vertical_short}} cm</text>
  <text x="100" y="200" font-size="14" fill="#3b82f6">{{vertical_long}} cm</text>
  <text x="100" y="140" font-size="14" fill="#3b82f6" text-anchor="middle">{{horizontal_short}} cm</text>
</svg>

Method: Divide into Rectangle 1 (${{h1}} \times {{v1}}$) and Rectangle 2 (${{h2}} \times {{v2}}$)

Total area = $A_1 + A_2 = ({{h1}} \times {{v1}}) + ({{h2}} \times {{v2}}) = {{area_1}} + {{area_2}} = {{total_area}}$ cm²

**Variation 6: Room Flooring Problem**
A classroom is ${{length}}$ m long and ${{width}}$ m wide.

a) What is the area of the classroom floor?
b) If floor tiles cost ${{price}}$ per m², how much will it cost to tile the entire floor?

**Variation 7: Square vs Rectangle**
A square has side length ${{side}}$ cm. A rectangle has length ${{rect_length}}$ cm and width ${{rect_width}}$ cm.

Create a comparison table:

| Shape | Dimensions | Area Formula | Area | Perimeter Formula | Perimeter |
|-------|------------|--------------|------|-------------------|-----------|
| Square | $s = {{side}}$ cm | $A = s^2$ | ? | $P = 4s$ | ? |
| Rectangle | $a = {{rect_length}}$, $b = {{rect_width}}$ cm | $A = a \times b$ | ? | $P = 2a + 2b$ | ? |

**Variation 8: Perimeter to Dimensions**
A rectangular playground has a perimeter of ${{perimeter}}$ m. If the length is ${{length}}$ m, what is the width?

Use: $P = 2a + 2b$, so $b = (P - 2a) \div 2$

Calculation: $b = ({{perimeter}} - 2 \times {{length}}) \div 2 = {{width}}$ m
