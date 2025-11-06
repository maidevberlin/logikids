---
id: kinematics
name: Kinematics
description: 'Study of motion without considering forces - position, velocity, acceleration, and motion in one and two dimensions'
grade: 7
ages:
  - 12
  - 13
  - 14
  - 15
focus: 'Linear motion, uniform and accelerated motion, free fall, horizontal projectile motion, two-dimensional motion, motion diagrams, velocity vectors'
difficulty: medium
learning_objectives:
  - Describe motion using position-time and velocity-time diagrams
  - Calculate velocity and acceleration
  - Analyze linear and parabolic motion
  - Understand vector representation of motion
prerequisites: []
example_tasks:
  - A car travels 150 km in 2 hours. What is its average velocity?
  - A ball is dropped from a 20m high building. How long does it take to hit the ground?
  - Draw a velocity-time diagram for a bicycle that accelerates from 0 to 6 m/s in 3 seconds
real_world_context: 'Traffic analysis, sports motion tracking, GPS navigation, animation and video game physics'
---

# Kinematik Tasks

Create physics problems that explore motion description using position, velocity, and acceleration. Problems should help students analyze motion patterns, interpret motion diagrams, and understand kinematic relationships without considering the forces causing the motion.

**Vary the problem structure:**
- **Average velocity calculations** using $v = \frac{\Delta s}{\Delta t}$: Calculate velocity when given distance and time for cars, trains, cyclists, or runners
- **Acceleration problems** using $a = \frac{\Delta v}{\Delta t}$: Determine acceleration for vehicles speeding up or slowing down, given initial and final velocities and time intervals
- **Uniformly accelerated motion** using $s = v_0 \cdot t + \frac{1}{2}a \cdot t^2$ and $v = v_0 + a \cdot t$: Calculate distance traveled, final velocity, or time for objects with constant acceleration
- **Free fall problems** using $g = 9.81 \frac{m}{s^2}$: Analyze objects dropped from buildings, thrown upward, or falling from rest, calculating fall times and impact velocities
- **Position-time diagram analysis**: Present graphs showing position vs. time and ask students to determine velocity (slope), identify constant vs. changing motion
- **Velocity-time diagram analysis**: Show velocity vs. time graphs and ask students to determine acceleration (slope) and distance traveled (area under curve)
- **Creating motion diagrams**: Given a motion description (accelerating car, decelerating bike), ask students to sketch appropriate position-time or velocity-time diagrams
- **Horizontal projectile motion** (for older students): Analyze objects thrown horizontally, combining horizontal constant motion with vertical free fall using $s_x = v_0 \cdot t$ and $s_y = \frac{1}{2}g \cdot t^2$

**Vary the content/context:**
- **Road traffic**: Cars accelerating, braking, highway driving at constant speed, emergency stops, speed limits and safety distances
- **Public transportation**: Trains accelerating from stations, trams braking at stops, subway motion patterns
- **Sports**: Runners sprinting, cyclists racing, skiers descending slopes, balls thrown or kicked
- **Everyday motion**: Walking, running, riding escalators, elevator motion
- **Nature**: Raindrops falling, leaves falling, water flowing in streams
- **Technology**: Drones flying, robots moving, conveyor belts operating

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 13): Focus on uniform motion with constant velocity, use simple numbers, basic formula $v = \frac{s}{t}$, emphasize conceptual understanding of "how fast" and "how far"
- **For middle ages** ({{age}} 13-14): Introduce acceleration, uniformly accelerated motion, simple free fall problems, interpretation of simple motion diagrams, unit conversions (km/h to m/s)
- **For older ages** ({{age}} >= 15): Complex multi-step problems, combined motions, projectile motion basics, advanced diagram interpretation, calculating from diagrams, vector representation of velocity

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for definitions: Velocity $v = \frac{\Delta s}{\Delta t}$, acceleration $a = \frac{\Delta v}{\Delta t}$
- Block for kinematic equations:

$$s = v_0 \cdot t + \frac{1}{2}a \cdot t^2$$

$$v^2 = v_0^2 + 2 \cdot a \cdot s$$

**Tables for motion data:**

| Time (s) | Position (m) | Velocity (m/s) |
|----------|--------------|----------------|
| 0        | 0            | 0              |
| 1        | 2            | 4              |
| 2        | 8            | 8              |

**SVG diagrams for motion visualization:**

Use SVG to show:
- Position-time diagrams with gridlines and labeled axes
- Velocity-time diagrams showing acceleration phases
- Motion sequences with position markers at equal time intervals
- Velocity vectors along motion paths
- Coordinate systems for two-dimensional motion

Example SVG for velocity-time diagram:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Axes -->
  <line x1="50" y1="250" x2="350" y2="250" stroke="black" stroke-width="2"/>
  <line x1="50" y1="250" x2="50" y2="50" stroke="black" stroke-width="2"/>
  <!-- Velocity line -->
  <polyline points="50,250 150,150 250,150 350,250" fill="none" stroke="#3b82f6" stroke-width="3"/>
  <!-- Labels -->
  <text x="180" y="280" font-size="14">Zeit (s)</text>
  <text x="10" y="150" font-size="14">v (m/s)</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Single formula application, uniform motion only, all values given directly, simple contexts (walking, driving at constant speed)
- **Medium**: Uniformly accelerated motion, two-step problems, one unit conversion (km/h ↔ m/s), interpret simple diagrams, basic free fall
- **Hard**: Multi-step calculations, combine multiple equations, extract information from complex diagrams, projectile motion, require students to choose appropriate formulas

**Include variety in numerical values:**
- Different distances: 50 m, 2.5 km, 180 m, 0.8 km
- Vary velocities: 5 m/s, 72 km/h, 1.5 m/s, 25 m/s
- Different time intervals: 2 s, 0.5 min, 1.5 h, 8 s
- Various accelerations: 2 m/s², 0.5 m/s², -3 m/s² (braking)
- Heights for free fall: 5 m, 20 m, 45 m, 80 m
- Ensure different numerical answers each time to prevent memorization
