---
id: mechanical-energy
name: Mechanical Energy
description: 'Energy transformations in mechanical systems - kinetic, potential, elastic energy and conservation principles'
grade: 9
ages:
  - 14
  - 16
focus: 'Kinetic energy, potential energy, elastic energy, energy conservation, work, power, efficiency, energy transformations'
difficulty: medium
learning_objectives:
  - Distinguish between different forms of mechanical energy
  - Apply energy conservation principle to mechanical systems
  - Calculate work and power in mechanical processes
  - Analyze energy transformations
prerequisites:
  - kinematics
  - dynamics
example_tasks:
  - Calculate the kinetic energy of a 1000 kg car traveling at 20 m/s
  - A 2 kg ball is lifted to a height of 5 m. What is its potential energy?
  - How much work is done pushing a box 10 m with a force of 50 N?
real_world_context: 'Roller coasters, hydroelectric dams, wind turbines, vehicle crashes, sports performance, building energy efficiency'
---

# Mechanische Energie Tasks

Create physics problems that explore energy in mechanical systems and energy transformations. Problems should help students understand different forms of mechanical energy, apply conservation of energy, calculate work and power, and analyze energy transformations in real-world scenarios.

**Vary the problem structure:**
- **Kinetic energy calculations** using $E_{kin} = \frac{1}{2}m \cdot v^2$: Calculate kinetic energy of moving vehicles, balls, or other objects given mass and velocity
- **Potential energy calculations** using $E_{pot} = m \cdot g \cdot h$: Determine gravitational potential energy for objects at various heights (buildings, hills, shelves, cranes)
- **Elastic energy in springs** using $E_{el} = \frac{1}{2}D \cdot s^2$: Calculate energy stored in compressed or stretched springs, bungee cords, or trampolines
- **Energy conservation problems**: Analyze energy transformations where total mechanical energy remains constant (pendulum swings, roller coasters, free fall, sliding down frictionless slopes)
- **Work calculations** using $W = F \cdot s$ or $W = F \cdot s \cdot \cos(\alpha)$: Calculate work done by forces moving objects, lifting loads, or pushing at angles
- **Power calculations** using $P = \frac{W}{t}$ or $P = \frac{E}{t}$: Determine power output when lifting objects, climbing stairs, or operating machines in given time intervals
- **Efficiency analysis** using $\eta = \frac{E_{useful}}{E_{input}}$: Calculate efficiency of machines, energy conversions, compare useful energy output to total energy input
- **Energy transformation chains**: Trace complete energy conversion sequences (potential → kinetic → heat in braking, chemical → kinetic → potential in cycling uphill)

**Vary the content/context:**
- **Amusement parks**: Roller coaster energy transformations, swing rides, drop towers, pendulum rides
- **Sports**: Pole vaulting, ski jumping, diving, ball sports (energy at different trajectory points), cycling uphill
- **Hydroelectric power**: Water falling in dams, turbines, potential to kinetic to electrical energy conversion
- **Transportation**: Vehicle braking (kinetic to heat), accelerating cars, trains climbing hills, bicycle mechanics
- **Construction**: Pile drivers, wrecking balls, crane operations, material transport
- **Everyday activities**: Climbing stairs, riding elevators, playground swings, trampolines, bungee jumping

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 15): Simple single-energy-form calculations, basic work problems with force parallel to motion, straightforward energy conservation with two forms (potential ↔ kinetic), whole number values
- **For middle ages** ({{age}} 15-16): Combined energy forms, work with forces at angles, power calculations, efficiency problems, energy conservation with three forms (potential, kinetic, elastic)
- **For older ages** ({{age}} >= 16): Complex multi-step energy problems, energy loss to friction/heat, combined work-energy-power problems, detailed efficiency analysis with multiple stages, realistic numerical values

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for energy definitions: $E_{kin} = \frac{1}{2}mv^2$, $E_{pot} = mgh$, $E_{el} = \frac{1}{2}Ds^2$
- Block for conservation and work-energy:

$$E_{kin,1} + E_{pot,1} = E_{kin,2} + E_{pot,2}$$

$$W = \Delta E$$

$$\eta = \frac{P_{out}}{P_{in}} = \frac{E_{useful}}{E_{total}}$$

**Tables for energy analysis:**

| Position | Height (m) | Velocity (m/s) | E_pot (J) | E_kin (J) | E_total (J) |
|----------|------------|----------------|-----------|-----------|-------------|
| Top      | 20         | 0              | 1962      | 0         | 1962        |
| Middle   | 10         | 14             | 981       | 981       | 1962        |
| Bottom   | 0          | 19.8           | 0         | 1962      | 1962        |

**Sankey diagrams for energy flow:**

Use tables or simplified diagrams to show energy distribution:

| Energy Type | Input (J) | Useful Output (J) | Lost to Friction (J) |
|-------------|-----------|-------------------|----------------------|
| Chemical    | 1000      | -                 | -                    |
| Kinetic     | -         | 700               | -                    |
| Heat        | -         | -                 | 300                  |

**SVG diagrams for energy scenarios:**

Use SVG to show:
- Height vs. energy diagrams for roller coasters or falling objects
- Energy bar charts comparing kinetic and potential energy at different positions
- Spring compression diagrams with energy indicators
- Force-distance diagrams for work calculations
- Power vs. time graphs

Example SVG for energy transformation:
```svg
<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Roller coaster track -->
  <path d="M 50 80 Q 150 80, 200 180 T 350 100 T 450 250" stroke="black" stroke-width="3" fill="none"/>
  <!-- Positions with energy bars -->
  <rect x="40" y="50" width="20" height="80" fill="#ef4444"/>
  <text x="35" y="140" font-size="12">E_pot</text>
  <rect x="190" y="150" width="10" height="40" fill="#ef4444"/>
  <rect x="210" y="150" width="10" height="40" fill="#3b82f6"/>
  <text x="175" y="200" font-size="12">E_pot + E_kin</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Single energy form calculation (only kinetic or only potential), basic work with F parallel to s, simple contexts with round numbers
- **Medium**: Energy conservation between two forms, work with angles, power calculations, basic efficiency, two-step problems
- **Hard**: Three or more energy forms, energy loss to friction, complex conservation scenarios, combined work-power-efficiency, multi-stage transformations

**Include variety in numerical values:**
- Different masses: 0.2 kg, 5 kg, 80 kg, 1500 kg
- Vary velocities: 3 m/s, 15 m/s, 25 m/s, 100 km/h
- Various heights: 2 m, 12 m, 50 m, 0.8 m
- Different forces: 10 N, 85 N, 500 N, 2000 N
- Distances: 5 m, 15 m, 200 m, 1.5 km
- Time intervals: 2 s, 30 s, 5 min, 0.5 h
- Spring constants: 100 N/m, 500 N/m, 5000 N/m
- Efficiency values: 0.65, 0.8, 0.45, 0.92
- Ensure varied numerical outcomes to prevent answer memorization
