---
id: grade6-deepening-volume-and-surface-area
name: Deepening Volume and Surface Area
description: Measurement
grade: 6
ages:
  - 11
  - 12
focus: Measurement
difficulty: medium
learning_objectives:
  - Calculate cuboid and cube confidently
  - Word problems with volume
  - Connection between volume and capacity
prerequisites:
  - grade-5-volume-surface
example_tasks:
  - 'Aquarium: 50 cm × 30 cm × 40 cm. How many liters of water?'
real_world_context: Understanding volume and surface area helps calculate water capacity in aquariums, paint needed for rooms, and packaging materials for boxes.
---

# Volume and Surface Area Problems

Create diverse problems involving volume and surface area calculations for cuboids and cubes, emphasizing real-world applications and the connection between volume and capacity.

## Problem Variations

### 1. Aquarium Water Capacity
An aquarium has dimensions {{length}} cm × {{width}} cm × {{height}} cm. Calculate:
a) The volume in cubic centimeters
b) The water capacity in liters (1 liter = 1000 cm³)
c) If the water is filled to {{percentage}}% of the height, how many liters are needed?

**Include the formula:**
$$V = l \times w \times h$$

**Provide an SVG diagram showing the aquarium dimensions:**
```svg
<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
  <rect x="30" y="30" width="140" height="90" fill="lightblue" stroke="black" stroke-width="2"/>
  <text x="100" y="20" text-anchor="middle" font-size="12">{{length}} cm</text>
  <text x="10" y="75" text-anchor="middle" font-size="12">{{height}} cm</text>
  <text x="180" y="75" text-anchor="middle" font-size="12">{{width}} cm</text>
</svg>
```

### 2. Packaging Box Design
A company needs to design a rectangular box with dimensions {{box_length}} cm × {{box_width}} cm × {{box_height}} cm.
a) Calculate the volume of the box
b) How much cardboard (surface area) is needed to make one box?
c) If they need {{num_boxes}} boxes, what is the total cardboard area required?

**Surface area formula:**
$$A = 2(lw + lh + wh)$$

### 3. Swimming Pool Volume
A rectangular swimming pool measures {{pool_length}} m × {{pool_width}} m × {{pool_depth}} m.
a) Calculate the volume in cubic meters
b) Convert the volume to liters (1 m³ = 1000 liters)
c) If a pump fills the pool at {{fill_rate}} liters per minute, how long will it take to fill completely?

**Present the answer in hours and minutes.**

### 4. Cube vs. Cuboid Comparison
Compare a cube with edge length {{cube_edge}} cm to a cuboid with dimensions {{cuboid_l}} cm × {{cuboid_w}} cm × {{cuboid_h}} cm.
a) Calculate the volume of each shape
b) Calculate the surface area of each shape
c) Which shape has the larger volume? By how much?
d) Which shape has the larger surface area? By how much?

**Use a table to organize results:**

| Shape | Volume (cm³) | Surface Area (cm²) |
|-------|--------------|-------------------|
| Cube | | |
| Cuboid | | |

### 5. Paint Coverage Problem
A room has dimensions {{room_length}} m × {{room_width}} m × {{room_height}} m.
a) Calculate the total wall area (all 4 walls, excluding ceiling and floor)
b) One door measures {{door_width}} m × {{door_height}} m and one window measures {{window_width}} m × {{window_height}} m. Calculate the actual area to be painted.
c) If 1 liter of paint covers {{coverage}} m², how many liters are needed?

**Wall area formula:**
$$A_{walls} = 2h(l + w)$$

### 6. Storage Container Optimization
A storage company has {{total_volume}} m³ of space to fill with cubic boxes.
a) If each box has an edge length of {{box_size}} cm, what is the volume of one box in m³?
b) How many boxes can fit in the storage space (theoretically)?
c) If the boxes are stacked {{stack_height}} high, what floor area is needed?

### 7. Water Tank Problem
A cylindrical water tank is being replaced by a rectangular tank. The new tank has dimensions {{tank_l}} m × {{tank_w}} m × {{tank_h}} m.
a) Calculate the volume of the new tank in m³
b) Express this volume in liters
c) If the family uses {{daily_usage}} liters per day, how many days will a full tank last?
d) Calculate the surface area if all 6 faces need to be sealed with waterproof coating.

### 8. Gift Box Surface Area
You need to wrap a gift box measuring {{gift_l}} cm × {{gift_w}} cm × {{gift_h}} cm.
a) Calculate the minimum wrapping paper needed (surface area)
b) Adding {{overlap_percent}}% extra for overlaps, how much paper is actually needed?
c) If wrapping paper costs {{cost_per_sqm}} per square meter, what is the total cost?

**Include unit conversion:**
$$1 \text{ m}^2 = 10000 \text{ cm}^2$$

## Task Requirements
- Use varied dimensions appropriate for grade 6 students
- Include at least 2 unit conversions (cm³ ↔ liters, cm² ↔ m²)
- Provide SVG diagrams for visualization when helpful
- Show step-by-step calculations in the solution
- Round final answers appropriately (to whole numbers or 2 decimal places)
- Ensure answers vary significantly between different task generations
