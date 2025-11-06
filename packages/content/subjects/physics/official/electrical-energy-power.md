---
id: electrical-energy-power
name: Electrical Energy and Power
description: 'Electrical energy, power, and efficiency in electrical systems'
grade: 9
ages:
  - 14
  - 16
focus: 'Electrical work and energy, electrical power (P=U·I), energy conversion in resistors, efficiency, power consumption, electrical safety, energy costs'
difficulty: medium
learning_objectives:
  - Calculate electrical energy and power
  - Analyze energy transformations in electrical components
  - Determine efficiency of electrical devices
  - Understand environmental impact of electricity use
prerequisites:
  - basic-electricity
example_tasks:
  - A 60 W lamp operates for 3 hours. How much energy does it consume?
  - Calculate the power of a heater that draws 10 A from a 230 V outlet
  - An electric motor converts 800 J of electrical energy into 650 J of mechanical work. What is its efficiency?
real_world_context: 'Household energy consumption, electricity bills, appliance ratings, energy efficiency labels, power plants, renewable energy, climate impact'
---

# Electrical Energy and Power Tasks

Create physics problems that explore electrical energy consumption, power ratings, efficiency of electrical devices, and energy costs. Problems should help students understand energy transformations in electrical systems, calculate power and energy usage, and make connections to environmental sustainability and energy economics.

**Vary the problem structure:**
- **Power calculations** using $P = U \cdot I$: Calculate power when voltage and current are given for appliances, motors, or heating elements
- **Power from resistance** using $P = \frac{U^2}{R}$ or $P = R \cdot I^2$: Calculate power dissipated in resistors when resistance and either voltage or current are known
- **Energy calculations** using $W = P \cdot t$: Calculate energy consumed by devices operating for a given time period (convert hours to seconds when needed)
- **Energy from power rating**: Given device power rating (in watts or kilowatts) and operating time, calculate total energy consumption in joules or kilowatt-hours (kWh)
- **Efficiency calculations** using $\eta = \frac{W_{useful}}{W_{input}} \cdot 100\%$ or $\eta = \frac{P_{useful}}{P_{input}} \cdot 100\%$: Determine efficiency of motors, lamps, or other devices converting electrical energy to other forms
- **Energy cost calculations**: Calculate electricity costs using energy consumption (kWh) and price per kWh, analyze monthly or annual costs for household appliances
- **Comparing appliances**: Compare power consumption and efficiency of different devices (LED vs. incandescent lamps, old vs. new refrigerators, etc.)
- **Energy transformations**: Analyze energy conversion chains in electrical devices (electrical → light + heat in lamps, electrical → kinetic + heat in motors, electrical → thermal in heaters)
- **Circuit power analysis**: Calculate total power consumption in circuits with multiple components in series or parallel
- **Environmental impact**: Connect energy consumption to CO₂ emissions or compare renewable vs. fossil fuel electricity sources

**Vary the content/context:**
- **Household appliances**: Refrigerators, washing machines, dishwashers, ovens, coffee makers, hair dryers, vacuum cleaners
- **Lighting**: Incandescent bulbs (40-100 W), energy-saving lamps (11-23 W), LED bulbs (5-15 W), comparing efficiency and lifespan
- **Heating and cooling**: Electric heaters, space heaters, air conditioners, heat pumps, electric water heaters
- **Entertainment devices**: TVs, computers, gaming consoles, stereo systems, chargers for phones and laptops
- **Motors and tools**: Electric drills, pumps, fans, electric vehicles, escalators, elevators
- **Energy bills**: Monthly electricity consumption, reading electricity meters, understanding kWh charges, time-of-use pricing
- **Sustainability**: Energy-efficient appliances (A+++ labels), standby power consumption, solar panels, energy-saving tips

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 15): Simple power calculations with $P = U \cdot I$, energy from $W = P \cdot t$ with time in hours, straightforward efficiency calculations with given input and output energies, basic cost calculations with kWh
- **For middle ages** ({{age}} 15): Multiple calculation steps, use different power formulas ($P = U \cdot I$, $P = R \cdot I^2$, $P = \frac{U^2}{R}$), convert between joules and kWh, compare multiple appliances, calculate yearly energy costs
- **For older ages** ({{age}} >= 16): Complex multi-step problems, optimize energy usage scenarios, analyze power distribution in complex circuits, calculate environmental impact (CO₂ emissions), evaluate economic viability of energy-saving investments

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for definitions: Power $P = U \cdot I$, energy $W = P \cdot t$, efficiency $\eta = \frac{W_{useful}}{W_{input}}$
- Block for power formulas:

$$P = U \cdot I$$

$$P = R \cdot I^2 = \frac{U^2}{R}$$

$$W = P \cdot t = U \cdot I \cdot t$$

$$\eta = \frac{P_{useful}}{P_{input}} \cdot 100\% = \frac{W_{useful}}{W_{input}} \cdot 100\%$$

- Conversion: $1 \text{ kWh} = 3.6 \times 10^6 \text{ J} = 3.6 \text{ MJ}$

**Tables for appliance data:**

| Appliance         | Power (W) | Daily Use (h) | Daily Energy (Wh) | Monthly Cost (€) |
|-------------------|-----------|---------------|-------------------|------------------|
| LED Lamp          | 10        | 5             | 50                | 0.45             |
| Refrigerator      | 150       | 24            | 3600              | 10.80            |
| Washing Machine   | 2000      | 0.5           | 1000              | 9.00             |

**Energy efficiency comparison:**

| Lamp Type        | Power (W) | Luminous Flux (lm) | Efficiency (lm/W) | Lifespan (h) |
|------------------|-----------|--------------------|--------------------|--------------|
| Incandescent     | 60        | 730                | 12                 | 1000         |
| CFL              | 15        | 900                | 60                 | 10000        |
| LED              | 9         | 806                | 90                 | 25000        |

**SVG diagrams for energy flow:**

Use SVG to show:
- Sankey diagrams showing energy input and output (useful energy + waste heat)
- Power consumption timelines for appliances throughout a day
- Comparison bar charts for different appliances' power ratings
- Energy transformation diagrams showing electrical → other forms
- Cost comparison visualizations

Example SVG for energy flow (Sankey):
```svg
<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Input energy -->
  <rect x="20" y="70" width="80" height="60" fill="#3b82f6" stroke="black" stroke-width="2"/>
  <text x="30" y="105" font-size="14" fill="white">1000 W</text>
  <text x="35" y="120" font-size="12" fill="white">Electrical</text>
  <!-- Useful output -->
  <rect x="150" y="30" width="100" height="40" fill="#10b981" stroke="black" stroke-width="2"/>
  <text x="165" y="55" font-size="12" fill="white">700 W Light</text>
  <!-- Waste heat -->
  <rect x="150" y="120" width="100" height="40" fill="#ef4444" stroke="black" stroke-width="2"/>
  <text x="160" y="145" font-size="12" fill="white">300 W Heat</text>
  <!-- Arrows -->
  <path d="M 100 90 L 150 50" fill="none" stroke="black" stroke-width="2"/>
  <path d="M 100 110 L 150 140" fill="none" stroke="black" stroke-width="2"/>
  <!-- Efficiency label -->
  <text x="150" y="190" font-size="14">Efficiency: 70%</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Direct application of $P = U \cdot I$ or $W = P \cdot t$, all values given clearly, simple efficiency with input/output energies provided, single-step cost calculations
- **Medium**: Two-step problems (calculate power first, then energy or cost), use $P = R \cdot I^2$ or $P = \frac{U^2}{R}$, convert between J and kWh, compare 2-3 appliances, calculate monthly/yearly costs
- **Hard**: Multi-step problems combining circuit analysis with energy calculations, optimize energy usage across multiple devices, calculate payback time for energy-efficient appliances, analyze complete household energy budgets, environmental impact assessment

**Include variety in numerical values:**
- Different voltages: 12 V (car), 230 V (household EU), 120 V (household US)
- Vary currents: 0.5 A, 2 A, 5 A, 10 A, 15 A
- Power ratings: 5 W (LED), 40-100 W (bulbs), 500-2000 W (heaters), 150-250 W (refrigerators), 1000-3000 W (ovens, kettles)
- Operating times: 30 min, 2 h, 5 h, 24 h (continuous), 8 h per day, 1 month, 1 year
- Resistances: 10 Ω, 25 Ω, 50 Ω, 100 Ω, 500 Ω
- Efficiency values: 30% (incandescent), 70% (motor), 85% (power supply), 95% (LED), 98% (transformer)
- Energy costs: €0.25-0.35 per kWh (typical German prices)
- Ensure different numerical answers each time to prevent memorization
