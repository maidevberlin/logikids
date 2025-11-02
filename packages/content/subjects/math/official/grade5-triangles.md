---
id: grade5-triangles
name: Triangles
description: Space and shape
grade: 5
ages:
  - 10
  - 11
focus: Space and shape
difficulty: medium
learning_objectives:
  - Classify triangle types
  - Angle sum in triangle (180°)
  - Simple constructions
prerequisites:
  - geometric-basic-concepts
example_tasks:
  - In a triangle two angles are 60° and 80°. How large is the third?
real_world_context: Triangles are fundamental in architecture, bridge construction, and design because their rigid structure makes them the strongest geometric shape.
---

# Triangle Properties and Classifications

You will create tasks about triangles that help students understand triangle types, angle relationships, and basic constructions. Use SVG diagrams to visualize triangles and LaTeX for angle measurements.

## Problem Variations

### 1. Finding Missing Angles Using Angle Sum
The sum of all angles in a triangle is always $180°$. Students calculate missing angles.

**Examples:**
- In a triangle, two angles measure ${{angle1}}°$ and ${{angle2}}°$. What is the measure of the third angle?
- A triangle has angles of ${{angle1}}°$ and ${{angle2}}°$. Calculate the missing angle.
- One angle in a triangle is ${{angle1}}°$ and another is ${{angle2}}°$. How large is the third angle?

### 2. Classifying Triangles by Angles
Students identify triangle types based on their angles: acute (all angles < 90°), right (one angle = 90°), or obtuse (one angle > 90°).

**Examples:**
- A triangle has angles of ${{angle1}}°$, ${{angle2}}°$, and ${{angle3}}°$. What type of triangle is it? (acute, right, or obtuse)
- Classify the triangle with angles ${{angle1}}°$, ${{angle2}}°$, and ${{angle3}}°$.
- Is a triangle with angles $50°$, $60°$, and $70°$ acute, right, or obtuse?

Include an SVG diagram showing the triangle:
```svg
<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
  <polygon points="100,20 30,130 170,130" fill="none" stroke="black" stroke-width="2"/>
  <text x="100" y="15" font-size="14" text-anchor="middle">{{angle1}}°</text>
  <text x="20" y="145" font-size="14" text-anchor="middle">{{angle2}}°</text>
  <text x="180" y="145" font-size="14" text-anchor="middle">{{angle3}}°</text>
</svg>
```

### 3. Classifying Triangles by Sides
Students identify triangle types based on side lengths: equilateral (all sides equal), isosceles (two sides equal), or scalene (all sides different).

**Examples:**
- A triangle has sides of length ${{side1}}$ cm, ${{side2}}$ cm, and ${{side3}}$ cm. What type of triangle is it?
- Classify the triangle with side lengths $5$ cm, $5$ cm, and $7$ cm.
- Is a triangle with sides ${{side1}}$ cm, ${{side2}}$ cm, and ${{side3}}$ cm equilateral, isosceles, or scalene?

### 4. Properties of Isosceles Triangles
In an isosceles triangle, two sides are equal and the base angles are equal.

**Examples:**
- An isosceles triangle has a top angle of ${{topAngle}}°$. What are the measures of the two base angles?
- In an isosceles triangle, each base angle is ${{baseAngle}}°$. What is the top angle?
- An isosceles triangle has two equal sides and a top angle of $40°$. Calculate the base angles.

### 5. Properties of Equilateral Triangles
In an equilateral triangle, all three sides are equal and all three angles are $60°$.

**Examples:**
- An equilateral triangle has a side length of ${{side}}$ cm. What are all the angles?
- If one angle of an equilateral triangle is $60°$, what are the other two angles?
- An equilateral triangle has a perimeter of ${{perimeter}}$ cm. What is the length of one side?

### 6. Angle Problems in Special Triangles
Combine triangle properties with angle calculations.

**Examples:**
- A right triangle has one angle of $90°$ and another angle of ${{angle}}°$. What is the third angle?
- In an obtuse triangle, one angle is $120°$ and another is ${{angle}}°$. Find the third angle.
- An acute triangle has angles of ${{angle1}}°$ and ${{angle2}}°$. What is the third angle, and verify that all angles are less than $90°$.

### 7. Perimeter Calculations
Students calculate the perimeter by adding all three side lengths.

**Examples:**
- A triangle has sides of length ${{side1}}$ cm, ${{side2}}$ cm, and ${{side3}}$ cm. What is its perimeter?
- Calculate the perimeter of an isosceles triangle with two sides of ${{equalSide}}$ cm and a base of ${{base}}$ cm.
- An equilateral triangle has a side length of ${{side}}$ cm. What is its perimeter?

### 8. Constructing Triangles from Given Information
Students use given measurements to draw or describe triangles.

**Examples:**
- Draw a triangle with sides ${{side1}}$ cm, ${{side2}}$ cm, and ${{side3}}$ cm. What type of triangle is it?
- Construct an isosceles triangle with two equal sides of ${{equalSide}}$ cm and a base of ${{base}}$ cm.
- Can you construct a triangle with sides $2$ cm, $3$ cm, and $6$ cm? Explain why or why not. (Triangle inequality: sum of any two sides must be greater than the third side)
