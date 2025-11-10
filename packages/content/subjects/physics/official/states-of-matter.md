---
id: states-of-matter
name: States of Matter
description: 'Phase transitions, particle arrangements in different states, and energy considerations'
grade: 9
ages:
  - 14
  - 16
focus: 'Solid, liquid, gas states, melting and boiling, phase transitions, latent heat, gas pressure, thermal expansion'
difficulty: medium
learning_objectives:
  - Explain states of matter using particle model
  - Describe phase transitions and energy changes
  - Understand melting, boiling, condensation, and sublimation
  - Analyze pressure-temperature relationships in gases
prerequisites:
  - temperature-heat
example_tasks:
  - Calculate the energy required to melt 500g of ice at 0°C
  - Explain why water boils at lower temperatures at high altitude
  - Use the particle model to explain why gases are compressible but liquids are not
real_world_context: 'Ice melting and freezing, water boiling for cooking, steam engines, pressure cookers, weather phenomena (clouds, fog, rain, snow), dry ice sublimation, refrigeration cycles'
---

# States of Matter Tasks

Create physics problems that explore the three states of matter, phase transitions, and the energy involved in changing states. Problems should help students understand particle arrangements in solids, liquids, and gases, calculate latent heat during phase transitions, and explain pressure-temperature relationships.

**Vary the problem structure:**
- **Latent heat of fusion** using $Q = m \cdot L_f$: Calculate energy required to melt ice at 0°C without temperature change, understand why temperature stays constant during melting
- **Latent heat of vaporization** using $Q = m \cdot L_v$: Calculate energy to boil water at 100°C, compare with energy to heat water from 0°C to 100°C, understand large energy requirement for vaporization
- **Complete heating curves**: Analyze temperature vs. energy graphs showing all phases (solid → liquid → gas), identify plateau regions representing phase transitions, calculate total energy for complete transitions
- **Particle model explanations**: Describe particle arrangements and motion in solids (fixed positions, vibration), liquids (close but mobile), and gases (far apart, fast motion), explain property differences
- **Phase transition identification**: Classify processes as melting, freezing, vaporization, condensation, sublimation, or deposition, provide everyday examples of each
- **Pressure-temperature relationships**: Analyze why boiling point decreases at high altitude, explain pressure cookers, understand vapor pressure
- **Thermal expansion**: Calculate volume or length changes with temperature for solids and liquids, explain expansion joints in bridges, thermometer operation
- **Gas pressure and particle collisions**: Relate gas pressure to particle collisions with container walls, explain pressure increase with temperature or decreased volume

**Vary the content/context:**
- **Water cycle**: Evaporation from oceans, condensation into clouds, precipitation, ice formation, sublimation from snow
- **Cooking**: Boiling water, steaming vegetables, melting butter, freezing ice cream, pressure cookers increasing boiling point, ice melting in drinks
- **Weather phenomena**: Fog formation (condensation), frost (deposition), snow melting, humidity, dew point
- **Industrial processes**: Distillation, refrigeration cycles, air conditioning, steam power generation, dry ice for cooling
- **Everyday observations**: Ice cubes melting, windows fogging, puddles evaporating, breath visible in cold air, boiling kettles
- **Materials engineering**: Thermal expansion in construction, bimetallic strips in thermostats, expansion gaps in rail tracks and bridges

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 15): Simple latent heat calculations with ice or water, qualitative particle model descriptions, identifying phase transitions in everyday contexts, basic boiling point concepts
- **For middle ages** ({{age}} 15-16): Complete heating curves with multiple phase transitions, combined specific heat and latent heat calculations, pressure effects on boiling point, thermal expansion calculations
- **For older ages** ({{age}} >= 16): Complex multi-stage heating/cooling problems, detailed particle model explanations including intermolecular forces, quantitative gas laws (qualitative intro), energy efficiency in phase transition applications

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for latent heat: $Q_{fusion} = m \cdot L_f$, $Q_{vaporization} = m \cdot L_v$
- Block for complete heating:

$$Q_{total} = m \cdot c_{ice} \cdot \Delta T_1 + m \cdot L_f + m \cdot c_{water} \cdot \Delta T_2 + m \cdot L_v$$

$$\frac{V_2}{V_1} = 1 + \beta \cdot \Delta T$$

**Tables for latent heat values:**

| Substance | L_fusion (kJ/kg) | L_vaporization (kJ/kg) | Melting Point (°C) | Boiling Point (°C) |
|-----------|------------------|------------------------|--------------------|--------------------|
| Water     | 334              | 2260                   | 0                  | 100                |
| Aluminum  | 397              | 10500                  | 660                | 2470               |
| Iron      | 247              | 6090                   | 1535               | 2750               |
| Lead      | 23               | 858                    | 327                | 1750               |

**Heating curve tables:**

| Phase           | Temperature (°C) | Energy Added (kJ) | State       |
|-----------------|------------------|-------------------|-------------|
| Ice heating     | -20 to 0         | 42                | Solid       |
| Ice melting     | 0 (constant)     | 167               | Phase trans |
| Water heating   | 0 to 100         | 420               | Liquid      |
| Water boiling   | 100 (constant)   | 1130              | Phase trans |
| Steam heating   | 100 to 120       | 40                | Gas         |

**Particle model diagrams:**

```
SOLID (ice):              LIQUID (water):         GAS (steam):
  o-o-o-o                   o  o  o                 o       o
  | | | |                  o  o  o                    o   o
  o-o-o-o                 o  o  o                  o    o
  | | | |                  o  o  o                      o
  o-o-o-o                 o  o  o                 o       o

Fixed positions,        Close together,          Far apart,
vibrate in place        move freely              rapid motion
```

**SVG diagrams for phase transitions:**

Use SVG to show:
- Heating curves (temperature vs. energy) with plateaus for phase transitions
- Particle arrangements at different states
- Phase transition arrows (solid ↔ liquid ↔ gas) with process names
- Pressure-temperature phase diagrams (simplified)
- Thermal expansion demonstrations

Example SVG for heating curve:
```svg
<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Axes -->
  <line x1="50" y1="250" x2="450" y2="250" stroke="black" stroke-width="2"/>
  <line x1="50" y1="250" x2="50" y2="50" stroke="black" stroke-width="2"/>
  <text x="240" y="280" font-size="14">Energy (kJ)</text>
  <text x="10" y="150" font-size="14">Temp (°C)</text>

  <!-- Heating curve -->
  <path d="M 60 230 L 120 200 L 200 200 L 280 100 L 360 100 L 420 80"
        stroke="#ef4444" stroke-width="3" fill="none"/>

  <!-- Phase labels -->
  <text x="70" y="220" font-size="12" fill="#666">Ice</text>
  <text x="140" y="190" font-size="12" fill="#666">Melting</text>
  <text x="220" y="140" font-size="12" fill="#666">Water</text>
  <text x="300" y="90" font-size="12" fill="#666">Boiling</text>
  <text x="380" y="70" font-size="12" fill="#666">Steam</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Simple latent heat calculations (melting ice or boiling water), qualitative phase transition descriptions, identifying states in everyday situations, basic particle model drawings
- **Medium**: Combined specific heat and latent heat problems, complete heating curves, pressure effects on boiling/melting points, thermal expansion basics, quantitative particle model explanations
- **Hard**: Multi-stage heating/cooling with all phases, efficiency calculations for refrigeration cycles, detailed pressure-temperature phase diagrams, quantitative gas behavior, intermolecular forces and phase transitions

**Include variety in numerical values:**
- Masses: 50 g, 200 g, 0.5 kg, 2 kg, 10 kg
- Latent heat of fusion (water): 334 kJ/kg or 334 J/g
- Latent heat of vaporization (water): 2260 kJ/kg or 2260 J/g
- Temperature ranges: -20°C to 0°C (ice), 0°C to 100°C (water), 100°C to 120°C (steam)
- Total energy values: 5 kJ, 50 kJ, 200 kJ, 1000 kJ
- Boiling points at different pressures: 100°C (sea level), 90°C (high altitude), 120°C (pressure cooker)
- Thermal expansion coefficients: Aluminum β ≈ 69×10⁻⁶/K, Steel β ≈ 36×10⁻⁶/K
- Ensure varied contexts showing all phase transitions in different applications
