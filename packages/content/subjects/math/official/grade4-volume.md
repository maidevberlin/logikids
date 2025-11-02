---
id: grade4-volume
name: Volume
description: Measurement
grade: 4
ages:
  - 9
  - 10
focus: Measurement
difficulty: medium
learning_objectives:
  - Volume with unit cubes
  - Cube and cuboid (introduction)
  - Connection between liters and cm³
prerequisites:
  - grade-3-volume-measures
example_tasks:
  - "Count unit cubes in a 3D rectangular structure to find its volume, where some cubes are hidden from view"
  - "Calculate the volume of a rectangular box with dimensions 5 cm × 3 cm × 4 cm using the formula V = l × w × h"
  - "Convert between liters and cubic centimeters: How many milliliters (cm³) are in 2.5 liters?"
real_world_context: "Volume calculations help us measure liquid containers, estimate storage space in boxes, and determine how much water a pool can hold."
---

# Volume

Generate tasks where students measure and calculate volume using unit cubes, apply the volume formula for rectangular prisms, and understand the relationship between liters and cubic centimeters. Focus on developing spatial reasoning and connecting abstract formulas to concrete counting.

## Variation Guidelines

Create diverse tasks using these approaches:

1. **Counting Unit Cubes**: Show a 3D structure built from unit cubes (1 cm × 1 cm × 1 cm) using SVG or description. Ask students to count the total number of cubes to find the volume in cm³. Vary complexity: start with all cubes visible, then include structures where some cubes are hidden behind others. Use structures like {{length}} × {{width}} × {{height}} with dimensions from 2-5 in each direction.

2. **Building with Dimensions**: Give dimensions (length, width, height) and ask "How many unit cubes would you need to build this rectangular box?" For example: "A box is 4 cubes long, 3 cubes wide, and 2 cubes tall. How many unit cubes does it contain?" Use dimensions ranging from 2 to 6 for each measurement.

3. **Volume Formula Application**: Present a rectangular prism (cuboid) with labeled dimensions in centimeters and ask students to calculate volume using $V = l \times w \times h$. Use varied dimensions like 5 cm × 3 cm × 4 cm or 6 cm × 2 cm × 5 cm. Result is in cm³.

4. **Multiple Representations**: Show the same rectangular prism both as a 3D drawing with unit cubes AND with labeled dimensions. Ask students to verify that counting cubes gives the same answer as using the formula: "Count the cubes. Then use $l \times w \times h$. Do you get the same answer?"

5. **Liters to Cubic Centimeters**: Provide volume in liters and ask students to convert to milliliters (ml) or cubic centimeters (cm³), or vice versa. Use the relationship: 1 liter = 1000 ml = 1000 cm³. Examples: "A bottle holds 2 liters. How many cm³ is that?" or "A box has volume 3500 cm³. How many liters is that?"

6. **Comparing Volumes**: Present two different rectangular prisms with their dimensions and ask students to calculate and compare their volumes. "Box A: 4 cm × 3 cm × 5 cm. Box B: 6 cm × 2 cm × 4 cm. Which box has greater volume? How much greater?" Vary so sometimes the answer is close, sometimes very different.

7. **Real-World Containers**: Describe a real-world container (aquarium, storage box, juice carton) with given dimensions in cm. Ask students to calculate its volume in cm³ and optionally convert to liters. "An aquarium is 50 cm long, 30 cm wide, and 40 cm tall. What is its volume? How many liters of water can it hold?"

8. **Finding Missing Dimensions**: Give volume and two dimensions, ask for the third. "A rectangular box has volume 60 cm³. Its length is 5 cm and width is 3 cm. What is its height?" This reinforces understanding of the volume formula: $h = \frac{V}{l \times w}$.

**SVG Examples** for unit cube structures:

For a **3 × 2 × 2 structure** (12 cubes):
```svg
<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
  <!-- Bottom layer (3×2 = 6 cubes shown in isometric view) -->
  <!-- Front-left cube -->
  <polygon points="20,80 40,70 40,50 20,60" fill="lightblue" stroke="black" stroke-width="1"/>
  <polygon points="40,70 60,60 60,40 40,50" fill="lightsteelblue" stroke="black" stroke-width="1"/>
  <polygon points="20,60 40,50 60,40 40,30 20,40" fill="lightcyan" stroke="black" stroke-width="1"/>
  <!-- Add more cubes... (simplified for example) -->
  <text x="10" y="120" font-size="12">Count all the cubes to find the volume</text>
</svg>
```

For a **labeled rectangular prism**:
```svg
<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
  <!-- Rectangular prism with dimensions -->
  <polygon points="30,90 90,90 90,40 30,40" fill="lightblue" stroke="black" stroke-width="2"/>
  <polygon points="30,40 90,40 110,25 50,25" fill="lightcyan" stroke="black" stroke-width="2"/>
  <polygon points="90,90 90,40 110,25 110,75" fill="lightsteelblue" stroke="black" stroke-width="2"/>
  <!-- Labels -->
  <text x="55" y="105" font-size="12">5 cm</text>
  <text x="95" y="65" font-size="12">3 cm</text>
  <text x="15" y="70" font-size="12">4 cm</text>
</svg>
```

**Vary complexity** by adjusting dimensions (smaller numbers for easier, larger for harder), whether cubes are shown or just dimensions given, and whether conversion between cm³ and liters is required.
