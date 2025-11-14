---
id: grade4-solids-and-nets
name: Solids and Nets
description: Space and shape
grade: 4
ages:
  - 9
  - 10
focus: Space and shape
difficulty: medium
learning_objectives:
  - 'Distinguish cube, cuboid, pyramid, cylinder'
  - Match nets
  - Build solids from nets
  - 'Count vertices, edges, faces'
prerequisites:
  - grade-3-geometric-solids
example_tasks:
  - "Count the number of vertices, edges, and faces on a rectangular prism (cuboid) and explain the relationships between these numbers"
  - "Determine which of three given nets can be folded to make a cube, explaining why the others cannot work"
  - "Match different 3D shapes (cube, rectangular prism, square pyramid, triangular prism) to their unfolded nets"
real_world_context: "Understanding nets helps us design packaging boxes, build 3D models, and visualize how flat materials can create solid objects."
---

# Solids and Nets

Generate tasks where students work with 3D shapes (solids) and their 2D unfolded versions (nets). Focus on recognizing shapes, understanding the relationship between nets and solids, and counting geometric properties.

## Variation Guidelines

Create diverse tasks using these approaches:

1. **Counting Properties**: Present a specific 3D shape (cube, cuboid, triangular prism, square pyramid, cylinder, or cone) using SVG or description. Ask students to count and report vertices (corners), edges, and faces. Vary the shape each time: cube (8 vertices, 12 edges, 6 faces), cuboid (8, 12, 6), triangular prism (6, 9, 5), square pyramid (5, 8, 5), triangular pyramid (4, 6, 4).

2. **Net Identification**: Show a net (unfolded shape) using SVG and ask students to identify which 3D shape it will make when folded. Use nets for cubes, cuboids, triangular prisms, or square pyramids. Ensure the net is actually valid and drawable in 2D.

3. **Net Validation**: Present {{number_of_nets}} different nets (2-4 options) and ask which ones can fold to make a {{target_shape}}. Include both valid and invalid nets. For cubes, show various arrangements of 6 connected squares. For cuboids, show arrangements of rectangles.

4. **Shape from Description**: Describe properties of a 3D shape (e.g., "This shape has 6 faces, all of them squares, 8 vertices, and 12 edges. What shape is it?") and ask students to identify it. Vary the descriptions and shapes.

5. **Comparing Shapes**: Present two different 3D shapes (like a cube vs. a cuboid, or a triangular prism vs. a square pyramid) and create a table comparing their properties. Ask questions like "How many more edges does shape A have than shape B?" or "Which shape has more faces?"

6. **Net Construction**: Describe a specific 3D shape and ask students to imagine or describe what its net would look like. "A cube needs 6 squares arranged so they fold into a box. How many different ways could you arrange these 6 squares?" (There are 11 different cube nets, but students just explore possibilities.)

7. **Real-World Nets**: Show or describe a real-world package (cereal box, tissue box, juice carton) as a {{shape_type}} and ask students to identify its properties or imagine its net. Calculate total surface area if dimensions are given (extension for advanced students).

8. **Shape Classification**: Present several 3D shapes and ask students to group them by properties: "Which shapes have only flat faces? Which have curved surfaces? Which are prisms? Which are pyramids?" Shapes to use: cube, cuboid, triangular prism, cylinder, cone, square pyramid, triangular pyramid, sphere.

**SVG Examples** for visualization:

For a **cube net** (one of many possible arrangements):
```svg
<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
  <!-- Cross-shaped cube net -->
  <rect x="50" y="0" width="30" height="30" fill="none" stroke="black" stroke-width="1"/>
  <rect x="50" y="30" width="30" height="30" fill="none" stroke="black" stroke-width="1"/>
  <rect x="20" y="30" width="30" height="30" fill="none" stroke="black" stroke-width="1"/>
  <rect x="80" y="30" width="30" height="30" fill="none" stroke="black" stroke-width="1"/>
  <rect x="50" y="60" width="30" height="30" fill="none" stroke="black" stroke-width="1"/>
  <rect x="50" y="90" width="30" height="30" fill="none" stroke="black" stroke-width="1"/>
</svg>
```

For a **rectangular prism** (3D view):
```svg
<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
  <!-- Front face -->
  <polygon points="30,90 90,90 90,50 30,50" fill="lightblue" stroke="black" stroke-width="1"/>
  <!-- Top face -->
  <polygon points="30,50 90,50 110,35 50,35" fill="lightcyan" stroke="black" stroke-width="1"/>
  <!-- Side face -->
  <polygon points="90,90 90,50 110,35 110,75" fill="lightsteelblue" stroke="black" stroke-width="1"/>
</svg>
```

**Vary complexity** by choosing different shapes (simpler: cube, cuboid; harder: pyramids, prisms), changing whether shapes are shown visually or described, and adjusting the level of analysis required.
