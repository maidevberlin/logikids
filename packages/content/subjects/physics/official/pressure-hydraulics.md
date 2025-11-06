---
id: pressure-hydraulics
name: Pressure and Hydraulics
description: 'Pressure in fluids and gases, hydrostatic pressure, buoyancy, and hydraulic systems'
grade: 7
ages:
  - 12
  - 13
  - 14
focus: 'Pressure definition (p=F/A), hydrostatic pressure, air pressure, barometers, buoyancy force, Archimedes'' principle, hydraulics, Pascal''s principle'
difficulty: easy
learning_objectives:
  - Define and calculate pressure
  - Understand hydrostatic pressure in liquids
  - Apply Archimedes' principle for buoyancy
  - Explain hydraulic systems in technology
prerequisites: []
example_tasks:
  - A force of 200 N acts on an area of 0.04 m². Calculate the pressure.
  - Calculate the pressure at 10 m depth in water (density: 1000 kg/m³).
  - A 500 g wooden block floats in water. What is the buoyant force acting on it?
real_world_context: 'Diving and swimming, hydraulic brakes and lifts, ship buoyancy, weather forecasting, syringes, pneumatic tools'
---

# Druck und Hydraulik Tasks

Create physics problems that explore pressure in fluids and gases, hydrostatic pressure, buoyancy, and hydraulic systems. Problems should help students understand pressure as force per area, analyze pressure in liquids at different depths, apply Archimedes' principle, and understand hydraulic applications in technology.

**Vary the problem structure:**
- **Basic pressure calculations** using $p = \frac{F}{A}$: Calculate pressure when force acts on a given area, or find force/area when pressure is known (shoes on floor, knife blade, table legs)
- **Hydrostatic pressure** using $p = \rho \cdot g \cdot h$: Determine pressure at various depths in water, swimming pools, lakes, or oceans; calculate depth from known pressure
- **Total pressure in liquids**: Combine atmospheric pressure with hydrostatic pressure $p_{total} = p_{atm} + \rho \cdot g \cdot h$; understand pressure increases with depth
- **Buoyancy force calculations** using $F_A = \rho_{fluid} \cdot V_{displaced} \cdot g$: Calculate buoyant force on submerged or floating objects, relate to Archimedes' principle
- **Floating vs. sinking**: Compare object density to fluid density; object floats if $\rho_{object} < \rho_{fluid}$, sinks if $\rho_{object} > \rho_{fluid}$
- **Pascal's principle in hydraulics**: Analyze hydraulic systems where pressure is transmitted through fluid; calculate force multiplication using $\frac{F_1}{A_1} = \frac{F_2}{A_2}$
- **Pressure units conversion**: Convert between Pa, kPa, bar, and atmospheric pressure (1 atm = 101,325 Pa ≈ 1 bar = 100,000 Pa)
- **Air pressure applications**: Analyze atmospheric pressure effects (barometers, weather, drinking straws, vacuum pumps)

**Vary the content/context:**
- **Everyday pressure**: Standing on surfaces (shoes vs. high heels), cutting with knives, thumbtacks, nails, pressure of objects on tables
- **Water and diving**: Swimming pool pressure, diving depths, submarine pressure, scuba diving safety, dam water pressure
- **Floating and sinking**: Ships, boats, icebergs, hot air balloons, submarines adjusting buoyancy, life jackets
- **Hydraulic systems**: Car brakes, hydraulic lifts, excavators, hydraulic presses, bicycle pumps
- **Weather and atmosphere**: Barometers, atmospheric pressure at different altitudes, weather forecasting, tire pressure
- **Medical applications**: Blood pressure, syringes, infusion systems, breathing and lung pressure

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 13): Simple pressure calculations $p = F/A$ with whole numbers, qualitative understanding of pressure increasing with depth, basic buoyancy (floating vs. sinking), conceptual understanding of hydraulics
- **For middle ages** ({{age}} 13-14): Hydrostatic pressure calculations, combine atmospheric and hydrostatic pressure, quantitative buoyancy calculations using Archimedes' principle, basic hydraulic force calculations
- **For older ages** ({{age}} >= 14): Complex pressure scenarios with multiple factors, detailed hydraulic systems with force multiplication, pressure units conversions, combined buoyancy and weight analysis, pressure differences in U-tube systems

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for definitions: Pressure $p = \frac{F}{A}$, hydrostatic $p = \rho \cdot g \cdot h$, buoyancy $F_A = \rho_{fluid} \cdot V \cdot g$
- Block for Pascal's principle and combined equations:

$$p = \frac{F}{A} = \frac{N}{m^2} = Pa$$

$$p_{hydrostatic} = \rho \cdot g \cdot h$$

$$F_{buoyancy} = \rho_{water} \cdot V_{displaced} \cdot g$$

For hydraulics:
$$\frac{F_1}{A_1} = \frac{F_2}{A_2} \quad \Rightarrow \quad F_2 = F_1 \cdot \frac{A_2}{A_1}$$

**Tables for pressure data:**

| Depth (m) | Hydrostatic Pressure (kPa) | Atmospheric Pressure (kPa) | Total Pressure (kPa) |
|-----------|----------------------------|----------------------------|----------------------|
| 0         | 0                          | 101.3                      | 101.3                |
| 5         | 49.1                       | 101.3                      | 150.4                |
| 10        | 98.1                       | 101.3                      | 199.4                |

| Object          | Density (kg/m³) | Water Density (kg/m³) | Floats/Sinks |
|-----------------|-----------------|----------------------|--------------|
| Ice             | 917             | 1000                 | Floats       |
| Wood (oak)      | 750             | 1000                 | Floats       |
| Iron            | 7870            | 1000                 | Sinks        |

**SVG diagrams for pressure visualization:**

Use SVG to show:
- Pressure on surfaces with force arrows distributed over area
- Water container with pressure increasing with depth (longer arrows deeper)
- Floating object with buoyancy force upward and weight downward
- Hydraulic system with two pistons of different areas
- Pressure gauges at different depths
- U-tube manometer showing pressure differences

Example SVG for hydrostatic pressure:
```svg
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Water container -->
  <rect x="100" y="100" width="200" height="250" fill="#3b82f6" fill-opacity="0.3" stroke="black" stroke-width="3"/>
  <line x1="100" y1="100" x2="300" y2="100" stroke="black" stroke-width="2"/>
  <text x="180" y="85" font-size="14">Water</text>

  <!-- Pressure arrows at different depths -->
  <!-- At 1/4 depth -->
  <line x1="200" y1="160" x2="270" y2="160" stroke="red" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="275" y="165" font-size="12">p₁</text>

  <!-- At 1/2 depth -->
  <line x1="200" y1="225" x2="290" y2="225" stroke="red" stroke-width="3" marker-end="url(#arrow)"/>
  <text x="295" y="230" font-size="12">p₂</text>

  <!-- At 3/4 depth -->
  <line x1="200" y1="290" x2="310" y2="290" stroke="red" stroke-width="4" marker-end="url(#arrow)"/>
  <text x="315" y="295" font-size="12">p₃</text>

  <!-- Depth markers -->
  <line x1="90" y1="100" x2="90" y2="160" stroke="black" stroke-width="1" marker-end="url(#arrow)"/>
  <text x="65" y="135" font-size="12">h₁</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Simple pressure calculations $p = F/A$ with straightforward numbers, qualitative buoyancy (will it float?), basic hydrostatic pressure at one depth, single-step problems
- **Medium**: Hydrostatic pressure with unit conversions, quantitative buoyancy calculations, compare pressures at different depths, simple hydraulic force calculations, two-step problems
- **Hard**: Combined atmospheric and hydrostatic pressure, complex buoyancy with partial submersion, hydraulic systems with force multiplication and work considerations, pressure in connected vessels, multi-step reasoning

**Include variety in numerical values:**
- Different forces: 50 N, 500 N, 2000 N, 80 N
- Vary areas: 0.01 m², 2 m², 0.0001 m² (1 cm²), 0.5 m²
- Various depths: 2 m, 10 m, 50 m, 100 m, 0.5 m
- Different densities: 1000 kg/m³ (water), 1025 kg/m³ (seawater), 13,600 kg/m³ (mercury), 917 kg/m³ (ice), 750 kg/m³ (wood)
- Volumes: 0.001 m³ (1 liter), 0.5 m³, 0.0001 m³ (100 cm³)
- Hydraulic piston areas: 0.01 m², 0.1 m², ratio 1:10, 1:50
- Atmospheric pressure: 101,325 Pa, 101.3 kPa, 1.013 bar, 1 atm
- Use realistic values: water density 1000 kg/m³, g = 9.81 m/s² (or simplified 10 m/s² for younger students)
- Ensure varied calculations to reinforce concept understanding rather than memorization
