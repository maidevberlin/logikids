---
id: temperature-heat
name: Temperature and Heat
description: 'Thermal phenomena, particle model of matter, temperature, heat, and internal energy'
grade: 9
ages:
  - 14
  - 15
  - 16
focus: 'Temperature measurement, Celsius and Kelvin scales, particle model, kinetic energy of particles, internal energy, thermal equilibrium, heat capacity, specific heat'
difficulty: medium
learning_objectives:
  - Distinguish between temperature and heat
  - Apply particle model to explain thermal phenomena
  - Understand absolute temperature and Kelvin scale
  - Analyze heat capacity and temperature changes
prerequisites:
  - mechanical-energy
example_tasks:
  - Convert 25°C to Kelvin and explain what temperature measures at particle level
  - Calculate the heat required to raise 2 kg of water from 20°C to 100°C
  - Explain why metal feels colder than wood at the same temperature using the particle model
real_world_context: 'Cooking and food preparation, body temperature regulation, weather and climate, heating systems, thermal comfort in buildings, refrigeration and air conditioning'
---

# Temperature and Heat Tasks

Create physics problems that explore thermal phenomena, the distinction between temperature and heat, and the particle model of matter. Problems should help students understand temperature scales, internal energy, thermal equilibrium, and heat capacity calculations.

**Vary the problem structure:**
- **Temperature scale conversions**: Convert between Celsius and Kelvin using $T(K) = T(°C) + 273.15$, explain physical meaning of absolute zero, discuss why Kelvin has no negative values
- **Heat capacity calculations** using $Q = m \cdot c \cdot \Delta T$: Calculate heat energy required to change temperature of various substances (water, metal, air) given mass, specific heat, and temperature change
- **Specific heat comparisons**: Analyze why different materials heat up at different rates, compare specific heat values, explain implications for cooking, building materials, climate
- **Thermal equilibrium problems**: Determine final temperature when hot and cold objects are brought into contact, apply energy conservation $Q_{lost} = Q_{gained}$
- **Mixing temperatures**: Calculate final temperature when mixing hot and cold water or other liquids, use $m_1 c_1 \Delta T_1 = m_2 c_2 \Delta T_2$
- **Internal energy and particle model**: Explain temperature as average kinetic energy of particles, relate temperature increase to faster particle motion, discuss why absolute zero means particles stop moving
- **Heat vs. temperature distinctions**: Compare situations where large heat transfer causes small temperature change (large mass/high heat capacity) vs. small heat causing large temperature change (small mass/low heat capacity)
- **Thermal equilibrium concept**: Analyze why objects reach common temperature, explain heat flow direction (hot to cold), predict equilibration times based on thermal properties

**Vary the content/context:**
- **Cooking and kitchen**: Heating water for pasta, why pots are metal but handles are plastic, cooling hot soup, refrigerator operation, oven temperature control
- **Weather and climate**: Daily temperature variations, seasonal changes, why coastal regions have moderate climates (water's high heat capacity), heat islands in cities
- **Human body**: Body temperature regulation (37°C), fever, hypothermia, sweating and cooling, why we feel cold in wind
- **Buildings and heating**: Radiators, central heating, insulation materials, thermal mass in construction, energy-efficient building design
- **Everyday materials**: Why metal feels colder than wood at room temperature (heat conduction), hot summer surfaces (asphalt, metal slides), warm blankets
- **Industry and technology**: Cooling systems for computers and engines, industrial furnaces, temperature measurement in manufacturing

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 15): Simple temperature conversions (round values like 0°C, 100°C, 27°C), basic heat capacity calculations with water (c = 4200 J/(kg·K)), conceptual particle model explanations, qualitative thermal equilibrium
- **For middle ages** ({{age}} 15-16): Mixed material thermal equilibrium, calculations with different specific heats, quantitative mixing problems, internal energy comparisons, realistic temperature ranges
- **For older ages** ({{age}} >= 16): Complex multi-material equilibrium, combined heat capacity and phase transitions, detailed particle model applications, energy efficiency calculations for heating systems

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for temperature conversion: $T(K) = T(°C) + 273.15$, heat capacity: $Q = mc\Delta T$
- Block for thermal equilibrium:

$$Q_{lost} = Q_{gained}$$

$$m_1 c_1 (T_1 - T_f) = m_2 c_2 (T_f - T_2)$$

$$E_{internal} = \frac{3}{2}NkT$$

**Tables for specific heat values:**

| Material | Specific Heat c (J/(kg·K)) |
|----------|---------------------------|
| Water    | 4200                      |
| Aluminum | 900                       |
| Iron     | 450                       |
| Copper   | 380                       |
| Air      | 1000                      |
| Sand     | 800                       |

**Tables for temperature comparisons:**

| Object | Initial T (°C) | Final T (°C) | ΔT (K) | Heat Q (kJ) |
|--------|----------------|--------------|--------|-------------|
| Water  | 20             | 80           | 60     | 252         |
| Metal  | 20             | 80           | 60     | 27          |

**Particle model diagrams:**

Use text-based or simplified representations:

```
Cold (slow particles):  o  o  o  o  o
                        o  o  o  o  o

Hot (fast particles):   O→ O→ O→ O→ O→
                        O→ O→ O→ O→ O→
```

**SVG diagrams for thermal concepts:**

Use SVG to show:
- Temperature scales comparison (Celsius vs. Kelvin with key reference points)
- Heat flow arrows showing direction from hot to cold
- Particle speed distributions at different temperatures
- Energy bar charts comparing internal energy at different temperatures
- Thermal equilibrium process over time (temperature vs. time graphs)

Example SVG for temperature scales:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Celsius scale -->
  <line x1="100" y1="50" x2="100" y2="250" stroke="black" stroke-width="2"/>
  <line x1="90" y1="250" x2="110" y2="250" stroke="black" stroke-width="2"/>
  <text x="120" y="255" font-size="14">0°C (freezing)</text>
  <line x1="90" y1="150" x2="110" y2="150" stroke="black" stroke-width="2"/>
  <text x="120" y="155" font-size="14">100°C (boiling)</text>
  <text x="70" y="30" font-size="16" font-weight="bold">Celsius</text>

  <!-- Kelvin scale -->
  <line x1="300" y1="50" x2="300" y2="250" stroke="black" stroke-width="2"/>
  <line x1="290" y1="250" x2="310" y2="250" stroke="black" stroke-width="2"/>
  <text x="140" y="255" font-size="14">273K</text>
  <line x1="290" y1="150" x2="310" y2="150" stroke="black" stroke-width="2"/>
  <text x="140" y="155" font-size="14">373K</text>
  <text x="270" y="30" font-size="16" font-weight="bold">Kelvin</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Simple temperature conversions, basic Q = mcΔT calculations with water only, qualitative particle model descriptions, identifying heat flow direction
- **Medium**: Thermal equilibrium with different materials, calculations with various specific heats, quantitative mixing problems, internal energy concepts
- **Hard**: Multi-material equilibrium systems, combined specific heat and efficiency calculations, detailed particle model explanations including kinetic theory, calorimetry experiments

**Include variety in numerical values:**
- Temperatures: -20°C, 0°C, 25°C, 80°C, 100°C, 200°C (and Kelvin equivalents: 253K, 273K, 298K, 353K, 373K, 473K)
- Masses: 0.1 kg, 0.5 kg, 2 kg, 10 kg, 50 kg
- Specific heats: 380 J/(kg·K) for copper, 450 J/(kg·K) for iron, 900 J/(kg·K) for aluminum, 4200 J/(kg·K) for water
- Temperature changes: 5 K, 20 K, 50 K, 100 K
- Heat quantities: 500 J, 2 kJ, 50 kJ, 200 kJ, 1 MJ
- Ensure varied contexts and numerical outcomes to develop conceptual understanding
