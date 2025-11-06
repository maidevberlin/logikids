---
id: photovoltaics
name: Photovoltaics
description: 'Solar cells, photovoltaic systems, and applications'
grade: 8
ages:
  - 13
  - 14
  - 15
  - 16
  - 17
focus: 'Photoelectric effect in semiconductors, solar cell structure, I-V characteristic curve, fill factor, efficiency, series and parallel connection of solar cells, photovoltaic system components (inverter, storage), applications, environmental factors'
difficulty: medium
learning_objectives:
  - Understand solar cell function and characteristics
  - Analyze I-V curves and maximum power point
  - Design simple photovoltaic systems
  - Evaluate energy contribution of solar power
prerequisites:
  - basic-electricity
  - energy-forms-transformations
example_tasks:
  - Calculate the power output of a solar panel at its maximum power point given its I-V curve
  - Design a solar system for a household consuming 3500 kWh/year in a location with 1000 kWh/m² annual irradiation
  - Compare series vs. parallel connection of solar cells and their impact on system voltage and current
real_world_context: 'Rooftop solar installations, solar farms, off-grid systems, portable solar chargers, solar-powered devices, space satellites, renewable energy transition, energy independence'
---

# Photovoltaics Tasks

Create physics problems that explore solar cells, photovoltaic systems, and their applications. Problems should help students understand the physics of solar energy conversion, analyze characteristic curves, design practical PV systems, and evaluate the contribution of solar power to sustainable energy supply.

**Vary the problem structure:**
- **Solar cell fundamentals**: Explain photoelectric effect in semiconductors, p-n junction function, electron-hole pair generation, and current flow
- **I-V characteristic analysis**: Interpret current-voltage curves of solar cells, identify open-circuit voltage ($U_{OC}$), short-circuit current ($I_{SC}$), and maximum power point (MPP)
- **Power calculations**: Calculate power output $P = U \times I$ at different operating points on I-V curve, find maximum power point
- **Fill factor calculations**: Determine fill factor $FF = \frac{P_{MPP}}{U_{OC} \times I_{SC}}$ as quality metric for solar cells
- **Efficiency calculations**: Calculate efficiency $\eta = \frac{P_{electrical}}{P_{solar}} = \frac{P_{out}}{A \times E_{irr}}$ where $A$ is area and $E_{irr}$ is irradiance
- **Series and parallel connections**: Analyze how connecting multiple solar cells/modules affects system voltage, current, and power
- **System sizing**: Design PV systems based on energy demand, location (solar irradiation), panel specifications, and available area
- **Real-world performance**: Account for temperature effects, shading, orientation, tilt angle, seasonal variations, and other practical factors
- **Energy yield estimation**: Calculate daily, monthly, or annual energy production based on irradiation data and system parameters
- **Economic analysis**: Calculate system costs, payback time, and lifetime energy production

**Vary the content/context:**
- **Residential rooftop systems**: Home installations (3-10 kWp), net metering, self-consumption optimization, battery storage integration
- **Commercial installations**: Business roofs, carports, agricultural buildings (50-500 kWp)
- **Solar farms**: Utility-scale ground-mounted systems (1-100 MWp), land use, grid connection
- **Off-grid systems**: Remote cabins, camping, emergency power - battery storage essential
- **Portable applications**: Solar chargers for phones, laptops, power banks, backpacking equipment
- **Transportation**: Solar panels on boats, RVs, electric vehicle charging stations
- **Space applications**: Satellites, Mars rovers, space stations - no atmosphere, different irradiance
- **Innovative applications**: Solar roads, building-integrated PV (BIPV), floating solar farms, agrivoltaics
- **Developing regions**: Rural electrification, water pumping, lighting, medical equipment

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 15): Basic power calculations ($P = U \times I$), simple efficiency calculations, straightforward I-V curve reading, series/parallel connections with 2-3 cells, basic system sizing with given parameters
- **For middle ages** ({{age}} 15-16): Fill factor calculations, maximum power point optimization, realistic efficiency analysis with losses, system design with multiple constraints, temperature effects, shading analysis
- **For older ages** ({{age}} >= 17): Complex system optimization, detailed energy yield modeling with seasonal variations, economic analysis with LCOE, comparative technology analysis (mono vs. poly vs. thin-film), advanced topics like MPP tracking

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for basic relations: Power $P = U \times I$, Efficiency $\eta = \frac{P_{out}}{P_{in}}$
- Block for characteristic formulas:

$$FF = \frac{P_{MPP}}{U_{OC} \times I_{SC}} = \frac{U_{MPP} \times I_{MPP}}{U_{OC} \times I_{SC}}$$

$$\eta = \frac{P_{electrical}}{P_{solar}} = \frac{U_{MPP} \times I_{MPP}}{A \times E_{irr}} \times 100\%$$

$$E_{annual} = P_{rated} \times t_{annual} \times PR$$

where $PR$ is the performance ratio (typically 0.75-0.85)

**Tables for solar cell/module specifications:**

| Parameter | Symbol | Value | Unit |
|-----------|--------|-------|------|
| Open-circuit voltage | $U_{OC}$ | 45.5 | V |
| Short-circuit current | $I_{SC}$ | 9.8 | A |
| Voltage at MPP | $U_{MPP}$ | 37.2 | V |
| Current at MPP | $I_{MPP}$ | 9.2 | A |
| Maximum power | $P_{MPP}$ | 342 | W |
| Fill factor | $FF$ | 0.767 | - |
| Efficiency | $\eta$ | 20.5 | % |
| Panel area | $A$ | 1.67 | m² |

**Tables for system design:**

| Component | Quantity | Specification | Total Power/Capacity |
|-----------|----------|---------------|---------------------|
| Solar modules | 12 | 350 W each | 4.2 kWp |
| Inverter | 1 | 4000 W | 4 kW |
| Battery storage | 1 | 10 kWh | 10 kWh |
| Annual energy production | - | - | 4200 kWh |
| Household consumption | - | - | 3800 kWh |

**I-V characteristic curves - described or in tables:**

Present I-V curve data points for students to analyze:

| Voltage (V) | Current (A) | Power (W) |
|-------------|-------------|-----------|
| 0 | 9.8 | 0 |
| 10 | 9.7 | 97 |
| 20 | 9.6 | 192 |
| 30 | 9.4 | 282 |
| 37.2 | 9.2 | 342 |
| 40 | 8.5 | 340 |
| 43 | 6.8 | 292 |
| 45.5 | 0 | 0 |

**Effect of irradiance and temperature:**

| Irradiance (W/m²) | $U_{OC}$ (V) | $I_{SC}$ (A) | $P_{MPP}$ (W) |
|-------------------|-------------|-------------|--------------|
| 1000 (STC) | 45.5 | 9.8 | 342 |
| 800 | 44.8 | 7.8 | 274 |
| 600 | 44.2 | 5.9 | 206 |
| 400 | 43.5 | 3.9 | 137 |
| 200 | 42.8 | 2.0 | 68 |

Temperature effect (at 1000 W/m²):
- At 25°C (STC): $U_{OC}$ = 45.5 V, $P_{MPP}$ = 342 W
- At 45°C: $U_{OC}$ = 41.5 V, $P_{MPP}$ = 318 W
- At 65°C: $U_{OC}$ = 37.5 V, $P_{MPP}$ = 294 W

**SVG diagrams for PV systems:**

Use SVG to show:
- I-V and P-V characteristic curves with MPP marked
- Solar cell structure (p-n junction, electron flow)
- Series and parallel connection diagrams
- Complete PV system schematic (panels → inverter → grid/battery → load)
- Shadow effects on module strings
- Optimal tilt angle and orientation diagrams

Example SVG for I-V curve:
```svg
<svg viewBox="0 0 500 350" xmlns="http://www.w3.org/2000/svg">
  <!-- Axes -->
  <line x1="50" y1="300" x2="450" y2="300" stroke="black" stroke-width="2"/>
  <line x1="50" y1="300" x2="50" y2="50" stroke="black" stroke-width="2"/>

  <!-- Labels -->
  <text x="250" y="335" font-size="14" text-anchor="middle">Voltage (V)</text>
  <text x="25" y="175" font-size="14" text-anchor="middle" transform="rotate(-90 25 175)">Current (A)</text>

  <!-- I-V curve -->
  <path d="M 50 60 L 200 62 L 300 70 L 380 100 L 420 180 L 435 300"
        stroke="#3b82f6" stroke-width="3" fill="none"/>

  <!-- P-V curve -->
  <path d="M 50 300 L 150 190 L 270 120 L 380 130 L 435 280"
        stroke="#ef4444" stroke-width="3" fill="none" stroke-dasharray="5,5"/>

  <!-- MPP point -->
  <circle cx="270" cy="95" r="6" fill="#10b981"/>
  <text x="285" y="90" font-size="12" font-weight="bold">MPP</text>
  <text x="280" y="105" font-size="10">342 W</text>

  <!-- Key points -->
  <circle cx="50" cy="60" r="4" fill="#3b82f6"/>
  <text x="60" y="55" font-size="11">I_SC = 9.8 A</text>

  <circle cx="435" cy="300" r="4" fill="#3b82f6"/>
  <text x="360" y="315" font-size="11">U_OC = 45.5 V</text>

  <!-- Legend -->
  <line x1="70" y1="25" x2="100" y2="25" stroke="#3b82f6" stroke-width="3"/>
  <text x="110" y="30" font-size="12">I-V curve</text>

  <line x1="200" y1="25" x2="230" y2="25" stroke="#ef4444" stroke-width="3" stroke-dasharray="5,5"/>
  <text x="240" y="30" font-size="12">P-V curve</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Basic power calculations at given operating points, reading I-V curves for standard values, simple efficiency calculations, series/parallel of 2-3 cells with identical specifications
- **Medium**: Fill factor calculations, MPP identification and optimization, realistic system sizing with multiple factors, temperature and irradiance effects, shading analysis, energy yield estimation
- **Hard**: Complex system optimization with constraints, economic analysis with NPV/LCOE, comparison of different technologies, detailed performance modeling with seasonal variations, advanced topics like bypass diodes and module mismatch

**Include variety in numerical values:**
- Cell/module voltages: Single cell 0.5-0.6 V, 36-cell module 18-20 V, 60-cell module 30-37 V, 72-cell module 37-45 V
- Currents: Small modules 2-6 A, standard modules 8-11 A, high-power modules 12-14 A
- Module power: 100 W (portable), 250-300 W (older), 350-450 W (current), 500-600 W (high-end)
- Efficiency: Thin-film 10-12%, Polycrystalline 15-17%, Monocrystalline 18-22%, High-efficiency 22-25%
- Fill factor: 0.70-0.85 depending on quality
- System sizes: 3 kWp (small home), 5-8 kWp (typical home), 10-20 kWp (large home), 50-100 kWp (commercial)
- Irradiance: 200-1000 W/m² (varying conditions), standard test conditions (STC) = 1000 W/m², 25°C
- Annual irradiation: Germany 950-1200 kWh/m²/year, Spain 1600-1900 kWh/m²/year, Norway 700-1000 kWh/m²/year
- Performance ratio: 0.70-0.85 accounting for all system losses

**Key concepts to integrate:**
- **Standard Test Conditions (STC)**: 1000 W/m² irradiance, 25°C cell temperature, AM 1.5 spectrum
- **Maximum Power Point (MPP)**: Operating point where $P = U \times I$ is maximized
- **Fill Factor**: Measure of cell/module quality, ratio of actual MPP power to theoretical maximum
- **Series connection**: Voltages add ($U_{total} = U_1 + U_2 + ...$), current stays same - higher system voltage
- **Parallel connection**: Currents add ($I_{total} = I_1 + I_2 + ...$), voltage stays same - higher system current
- **Temperature coefficient**: PV modules lose ~0.4-0.5% power per °C above 25°C
- **Shading effects**: Even partial shading can dramatically reduce output; bypass diodes mitigate this
- **Inverter**: Converts DC from panels to AC for grid/household use, includes MPP tracking
- **Grid-tied vs. off-grid**: Grid-tied can export excess, off-grid requires battery storage
- **Performance ratio (PR)**: Ratio of actual to theoretical energy yield, accounts for all losses (0.75-0.85)

**Real-world considerations:**
- Optimal tilt angle and orientation (south-facing in Northern hemisphere, angle ≈ latitude)
- Seasonal variations in irradiation and day length
- Weather patterns (cloudy vs. sunny regions)
- System losses: cables (1-2%), inverter (2-5%), temperature (5-10%), soiling (2-5%), shading (0-20%)
- Space requirements: ~6-8 m² per kWp for typical modules
- Lifetime: Panels typically guaranteed 25-30 years with 80-85% of original output
