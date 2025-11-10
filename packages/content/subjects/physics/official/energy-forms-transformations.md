---
id: energy-forms-transformations
name: Energy Forms and Transformations
description: 'Different forms of energy and transformations between them'
grade: 7
ages:
  - 12
  - 15
focus: 'Mechanical, thermal, electrical, chemical, nuclear, and radiant energy, energy transformations, energy conservation, efficiency, energy flow diagrams, Sankey diagrams'
difficulty: easy
learning_objectives:
  - Identify different energy forms
  - Analyze energy transformation chains
  - Apply energy conservation principle
  - Calculate efficiency of energy conversions
prerequisites: []
example_tasks:
  - Trace the energy transformations when a battery-powered toy car drives uphill
  - Calculate the efficiency of a light bulb that uses 60 W and produces 5 W of light
  - Identify the energy forms in a hydroelectric power plant from water reservoir to electrical outlet
real_world_context: 'Power plants, electric appliances, vehicles, solar panels, batteries, heating systems, renewable energy, climate impact, energy efficiency in buildings'
---

# Energy Forms and Transformations Tasks

Create physics problems that explore different forms of energy and their transformations. Problems should help students recognize energy in its various forms, trace energy conversion chains, apply conservation of energy, and calculate efficiency of real-world energy systems.

**Vary the problem structure:**
- **Energy form identification**: Present a system or process and ask students to identify all energy forms present (kinetic, potential, thermal, electrical, chemical, nuclear, radiant/light)
- **Energy transformation chains**: Trace complete sequences of energy conversions through multiple steps (e.g., chemical → thermal → kinetic → electrical)
- **Energy conservation analysis**: Apply principle that energy cannot be created or destroyed, only transformed (total energy input = useful energy output + wasted energy)
- **Efficiency calculations** using $\eta = \frac{E_{useful}}{E_{input}} \times 100\%$ or $\eta = \frac{P_{useful}}{P_{input}} \times 100\%$: Determine how much input energy becomes useful output
- **Sankey diagram interpretation**: Present energy flow diagrams showing energy distribution and losses, ask students to analyze or complete them
- **Energy flow diagrams**: Create or complete diagrams showing energy transformations through a device or system
- **Comparative analysis**: Compare different technologies or processes based on their energy efficiency and sustainability
- **Real-world energy calculations**: Calculate energy use, costs, and environmental impact in everyday scenarios

**Vary the content/context:**
- **Household appliances**: Light bulbs (electrical → light + heat), electric heaters, refrigerators, washing machines, kettles, toasters
- **Transportation**: Cars (chemical → thermal → kinetic), electric vehicles (chemical → electrical → kinetic), bicycles (chemical in body → kinetic)
- **Power generation**: Coal/gas plants (chemical → thermal → kinetic → electrical), nuclear plants (nuclear → thermal → kinetic → electrical), hydroelectric (potential → kinetic → electrical), wind turbines (kinetic → electrical), solar panels (radiant → electrical)
- **Renewable energy systems**: Solar water heaters, photovoltaic panels, wind farms, geothermal plants, biomass energy
- **Energy storage**: Batteries (chemical ⇄ electrical), pumped hydro storage (electrical → potential → electrical), flywheels (electrical → kinetic → electrical)
- **Building energy**: Heating systems, insulation effectiveness, passive solar design, heat pumps
- **Human body**: Food energy (chemical) → kinetic energy in sports, thermal energy production
- **Natural phenomena**: Photosynthesis (radiant → chemical), water cycle (solar → kinetic → potential)

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 14): Simple two-step energy transformations, basic efficiency calculations with whole numbers, identifying 2-3 energy forms in common devices, straightforward Sankey diagrams
- **For middle ages** ({{age}} 14-15): Multi-step transformation chains with 4-5 steps, efficiency calculations with decimals and percentages, comparing multiple devices, more complex energy flow diagrams
- **For older ages** ({{age}} >= 15): Complex systems with parallel energy paths, combined efficiency calculations for multi-stage processes, critical analysis of sustainability, detailed Sankey diagrams with multiple branches

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for efficiency: $\eta = \frac{E_{useful}}{E_{input}} \times 100\%$ or $\eta = \frac{P_{useful}}{P_{input}} \times 100\%$
- Block for energy conservation:

$$E_{input} = E_{useful} + E_{wasted}$$

$$E_{before} = E_{after}$$

**Tables for energy analysis:**

| Device | Energy Input | Useful Output | Wasted Energy | Efficiency (%) |
|--------|--------------|---------------|---------------|----------------|
| LED bulb | 10 W electrical | 8 W light | 2 W heat | 80% |
| Incandescent | 60 W electrical | 5 W light | 55 W heat | 8.3% |

**Sankey diagrams using tables or descriptions:**

Example: A coal power plant with 100 J input:

| Energy Stage | Amount (J) | Energy Form | Notes |
|--------------|-----------|-------------|-------|
| Coal chemical energy | 100 | Chemical | Input |
| Boiler losses | 10 | Thermal | Lost to environment |
| Steam turbine input | 90 | Thermal | High-pressure steam |
| Turbine losses | 25 | Thermal | Friction and cooling |
| Generator input | 65 | Kinetic | Rotating turbine |
| Generator losses | 5 | Thermal | Electrical resistance |
| Electrical output | 60 | Electrical | Useful output |
| Overall efficiency | 60% | - | 60 J useful / 100 J input |

**Energy transformation chains:**

Present in flowchart style:
```
Hydroelectric Dam:
Water at height → Falling water → Turbine rotation → Generator → Electricity
(Potential) → (Kinetic) → (Kinetic) → (Electrical) → (Electrical output)
```

**SVG diagrams for energy visualizations:**

Use SVG to show:
- Energy form icons and transformation arrows
- Bar charts comparing energy input and useful output
- Proportional rectangles showing energy distribution (Sankey-style)
- Before/after energy comparisons
- Efficiency comparisons between different technologies

Example SVG for energy transformation:
```svg
<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Energy transformation chain -->
  <rect x="20" y="70" width="100" height="60" fill="#fbbf24" stroke="black" stroke-width="2"/>
  <text x="40" y="105" font-size="14">Chemical</text>
  <text x="50" y="125" font-size="12">100 J</text>

  <path d="M 120 100 L 180 100" stroke="black" stroke-width="2" marker-end="url(#arrowhead)"/>

  <rect x="180" y="70" width="100" height="60" fill="#ef4444" stroke="black" stroke-width="2"/>
  <text x="205" y="105" font-size="14">Thermal</text>
  <text x="220" y="125" font-size="12">90 J</text>

  <path d="M 280 100 L 340 100" stroke="black" stroke-width="2" marker-end="url(#arrowhead)"/>

  <rect x="340" y="70" width="100" height="60" fill="#3b82f6" stroke="black" stroke-width="2"/>
  <text x="360" y="105" font-size="14">Kinetic</text>
  <text x="380" y="125" font-size="12">65 J</text>

  <path d="M 440 100 L 500 100" stroke="black" stroke-width="2" marker-end="url(#arrowhead)"/>

  <rect x="500" y="70" width="80" height="60" fill="#8b5cf6" stroke="black" stroke-width="2"/>
  <text x="510" y="105" font-size="14">Electrical</text>
  <text x="525" y="125" font-size="12">60 J</text>

  <!-- Losses -->
  <text x="150" y="60" font-size="11" fill="#666">-10 J</text>
  <text x="310" y="60" font-size="11" fill="#666">-25 J</text>
  <text x="470" y="60" font-size="11" fill="#666">-5 J</text>

  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="black"/>
    </marker>
  </defs>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Identify 2-3 energy forms, simple two-step transformations (battery → light bulb), basic efficiency with round numbers (50%, 75%), single-path energy flow
- **Medium**: Identify 4-5 energy forms, multi-step chains with 3-4 transformations, efficiency calculations with realistic values (23.5%, 87%), interpret Sankey diagrams with 2-3 branches
- **Hard**: Complex systems with multiple parallel paths, efficiency calculations for multi-stage processes, create Sankey diagrams from descriptions, compare and evaluate different energy technologies, sustainability analysis

**Include variety in numerical values:**
- Power values: 5 W, 40 W, 100 W, 1.5 kW, 10 kW, 500 MW
- Energy values: 10 J, 500 J, 2 kJ, 50 kJ, 1 MJ, 100 MWh
- Efficiency values: 15%, 35%, 60%, 78%, 92%, 98%
- Time periods: 10 s, 1 min, 1 hour, 1 day, 1 year
- Costs: €0.10, €1.50, €25, €200, €5000
- Environmental impact: CO₂ emissions (100 g, 5 kg, 500 kg)
- Ensure varied contexts and values to prevent pattern recognition

**Energy forms glossary for reference:**
- **Kinetic energy**: Energy of motion (moving vehicles, wind, flowing water)
- **Potential energy**: Stored energy due to position (height, compressed springs, stretched rubber bands)
- **Thermal energy**: Heat energy (hot water, steam, friction)
- **Electrical energy**: Energy from electric charges (batteries, power lines, electrical appliances)
- **Chemical energy**: Energy stored in chemical bonds (food, fuel, batteries)
- **Nuclear energy**: Energy from atomic nuclei (nuclear reactors, sun)
- **Radiant energy**: Light and electromagnetic radiation (sunlight, lamps, lasers)
