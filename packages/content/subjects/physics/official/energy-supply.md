---
id: energy-supply
name: Energy Supply
description: 'Energy sources, power generation, and sustainable energy systems'
grade: 11
ages:
  - 16
  - 17
  - 18
focus: 'Fossil fuels, nuclear energy, renewable energy (solar, wind, hydro, biomass), power plants, energy efficiency, energy storage, grid systems, climate impact, sustainability, future energy scenarios'
difficulty: hard
learning_objectives:
  - Compare renewable and non-renewable energy sources
  - Understand power generation technologies
  - Evaluate sustainability of energy systems
  - Analyze societal impact of energy choices
prerequisites:
  - energy-forms-transformations
  - laws-of-thermodynamics
  - electromagnetism
example_tasks:
  - Compare the lifecycle CO₂ emissions of a coal plant vs. a wind farm producing the same annual energy
  - Calculate how many solar panels are needed to power a household with 4000 kWh annual consumption
  - Analyze the capacity factor of a wind turbine that produces 8760 MWh per year with a 5 MW rating
real_world_context: 'Climate change mitigation, energy policy, electricity markets, renewable energy transition, carbon neutrality, energy security, smart grids, sector coupling, decentralized energy'
---

# Energy Supply Tasks

Create physics problems that explore energy sources, power generation technologies, and sustainable energy systems. Problems should help students compare different energy technologies, understand the physics of power generation, evaluate sustainability and environmental impact, and analyze complex energy system challenges facing society.

**Vary the problem structure:**
- **Energy source comparison**: Compare renewable vs. non-renewable sources based on multiple criteria (efficiency, capacity factor, land use, costs, emissions, availability)
- **Power plant analysis**: Analyze specific power generation technologies (thermal efficiency, fuel consumption, power output, environmental impact)
- **Capacity and capacity factor**: Calculate rated capacity vs. actual energy production over time, understand intermittency of renewable sources
- **Energy system design**: Design energy systems to meet specific demands (household, building, community) considering constraints
- **Lifecycle analysis**: Evaluate total environmental impact including construction, operation, and decommissioning
- **Cost-benefit analysis**: Compare economic aspects (capital costs, operating costs, levelized cost of energy, payback time)
- **Grid integration**: Analyze challenges of integrating variable renewable energy (storage needs, backup power, grid stability)
- **Energy storage systems**: Calculate storage requirements, compare different storage technologies (batteries, pumped hydro, hydrogen)
- **Future scenarios**: Project energy needs and model transition pathways to sustainable energy systems
- **Critical evaluation**: Assess limitations, trade-offs, and challenges of different energy technologies

**Vary the content/context:**
- **Fossil fuel power plants**: Coal, natural gas, oil - thermal efficiency (30-45%), CO₂ emissions (800-1000 g/kWh), baseload vs. peak power, CCS technology
- **Nuclear power plants**: Fission reactors, thermal efficiency (33-37%), low emissions during operation, nuclear waste, safety considerations, baseload power
- **Hydroelectric power**: Dam reservoirs, run-of-river, pumped storage - high efficiency (85-90%), environmental impact, capacity factors (30-60%)
- **Wind energy**: Onshore and offshore wind farms, turbine power curves, capacity factors (25-45%), intermittency, wind resource assessment
- **Solar photovoltaic**: Crystalline silicon vs. thin-film, efficiency (15-22%), capacity factor (10-25%), area requirements, degradation over time
- **Solar thermal**: Concentrated solar power (CSP), thermal storage, capacity factors (25-75% with storage), dispatchability
- **Biomass and biogas**: Energy crops, waste-to-energy, cogeneration, carbon neutrality questions, land use competition
- **Geothermal**: High-temperature and low-temperature systems, heat pumps, baseload renewable energy
- **Energy storage**: Lithium-ion batteries, flow batteries, pumped hydro, compressed air, hydrogen, thermal storage
- **Smart grids**: Demand-side management, load balancing, distributed generation, virtual power plants
- **Sector coupling**: Power-to-heat, power-to-gas, electromobility, integrated energy systems

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 17): Straightforward comparisons with 2-3 criteria, basic efficiency and emission calculations, single technology analysis, clear sustainability rankings
- **For middle ages** ({{age}} 17): Multi-criteria comparisons, capacity factor calculations, simple system design problems, cost calculations with present values
- **For older ages** ({{age}} >= 18): Complex system modeling with multiple technologies, lifecycle analysis, economic optimization, policy evaluation, trade-off analysis with competing objectives

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for key metrics: Capacity factor = $\frac{E_{actual}}{P_{rated} \times t} \times 100\%$
- Block for important calculations:

$$\eta_{thermal} = \frac{W_{electrical}}{Q_{fuel}} = \frac{P_{out}}{P_{fuel}}$$

$$\text{CO}_2 \text{ emissions} = E_{consumed} \times \text{emission factor (g/kWh)}$$

$$\text{LCOE} = \frac{\text{Capital cost} + \sum \frac{\text{Operating cost}_t}{(1+r)^t}}{\sum \frac{\text{Energy output}_t}{(1+r)^t}}$$

**Tables for comparative analysis:**

| Energy Source | Efficiency (%) | Capacity Factor (%) | CO₂ (g/kWh) | LCOE (€/MWh) | Land Use (m²/MW) |
|---------------|----------------|---------------------|-------------|--------------|------------------|
| Coal | 38 | 75 | 820 | 60 | 40000 |
| Nuclear | 33 | 90 | 12 | 120 | 10000 |
| Wind (onshore) | 95* | 30 | 11 | 55 | 250000 |
| Solar PV | 20* | 18 | 45 | 50 | 80000 |
| Hydro | 90 | 45 | 24 | 70 | variable |

*conversion efficiency; overall system efficiency

**Charts for energy scenarios:**

Present data in tables that can be visualized:

| Year | Coal (TWh) | Nuclear (TWh) | Renewables (TWh) | Total Demand (TWh) | CO₂ (Mt) |
|------|-----------|---------------|------------------|-------------------|---------|
| 2020 | 240 | 60 | 200 | 500 | 196 |
| 2030 | 120 | 50 | 380 | 550 | 99 |
| 2040 | 20 | 30 | 550 | 600 | 17 |
| 2050 | 0 | 0 | 650 | 650 | 0 |

**Energy mix diagrams using text:**

Describe energy mix compositions:
```
Germany 2023 Energy Mix (Total: 510 TWh)
- Renewables: 255 TWh (50%)
  - Wind: 142 TWh (28%)
  - Solar: 61 TWh (12%)
  - Biomass: 42 TWh (8%)
  - Hydro: 10 TWh (2%)
- Fossil fuels: 230 TWh (45%)
  - Coal: 137 TWh (27%)
  - Natural gas: 93 TWh (18%)
- Nuclear: 25 TWh (5%)
```

**SVG diagrams for power system concepts:**

Use SVG to show:
- Power plant efficiency diagrams with energy flows
- Wind turbine power curves (power vs. wind speed)
- Solar irradiance and output over day/year
- Load curves and generation profiles
- Energy storage charge/discharge cycles
- Grid integration with multiple sources

Example SVG for power plant efficiency:
```svg
<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Coal plant efficiency diagram -->
  <rect x="50" y="100" width="120" height="80" fill="#fbbf24" stroke="black" stroke-width="2"/>
  <text x="80" y="135" font-size="14" font-weight="bold">Coal Input</text>
  <text x="85" y="155" font-size="16">100 MJ/s</text>

  <!-- Boiler -->
  <rect x="200" y="100" width="100" height="80" fill="#ef4444" stroke="black" stroke-width="2"/>
  <text x="225" y="135" font-size="12">Boiler</text>
  <text x="220" y="155" font-size="14">Steam 90 MJ/s</text>

  <!-- Turbine + Generator -->
  <rect x="330" y="100" width="120" height="80" fill="#3b82f6" stroke="black" stroke-width="2"/>
  <text x="345" y="135" font-size="12">Turbine + Gen</text>
  <text x="350" y="155" font-size="14">Electricity 38 MJ/s</text>

  <!-- Losses -->
  <text x="180" y="90" font-size="12" fill="#666">Stack loss: 10 MJ/s</text>
  <text x="340" y="90" font-size="12" fill="#666">Condenser loss: 52 MJ/s</text>

  <!-- Efficiency label -->
  <text x="180" y="240" font-size="16" font-weight="bold">Overall efficiency: 38%</text>

  <!-- Arrows -->
  <path d="M 170 140 L 200 140" stroke="black" stroke-width="3" marker-end="url(#arrow)"/>
  <path d="M 300 140 L 330 140" stroke="black" stroke-width="3" marker-end="url(#arrow)"/>

  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="black"/>
    </marker>
  </defs>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Medium**: Single-technology analysis, basic efficiency and emissions calculations, straightforward comparisons with 2-3 energy sources, capacity factor calculations, simple cost comparisons
- **Hard**: Multi-technology system design, lifecycle analysis with multiple stages, economic optimization problems, complex trade-off analysis (cost vs. emissions vs. reliability), grid integration with storage, policy scenario modeling

**Include variety in numerical values and scenarios:**
- Power plant sizes: 10 MW, 500 MW, 2 GW, 5 GW
- Efficiency ranges: Nuclear 33%, Coal 38%, Combined-cycle gas 58%, Wind 45%, Solar PV 20%
- Capacity factors: Nuclear 90%, Coal 75%, Wind 30%, Solar 18%, Hydro 45%
- Energy costs: LCOE 40-150 €/MWh depending on technology
- Emission factors: Coal 820 g/kWh, Gas 490 g/kWh, Nuclear 12 g/kWh, Wind 11 g/kWh, Solar 45 g/kWh (lifecycle)
- Household consumption: 2500-5000 kWh/year
- Industrial consumption: 100 GWh to several TWh per year
- Storage capacities: 10 kWh (home battery), 10 MWh (grid battery), 10 GWh (pumped hydro)
- Time scales: daily, seasonal, annual production and consumption patterns

**Key concepts to integrate:**
- **Baseload vs. peak power**: Different roles of dispatchable and variable generation
- **Capacity factor**: Ratio of actual output to theoretical maximum output
- **Levelized Cost of Energy (LCOE)**: Total lifecycle cost per unit of energy produced
- **Thermal efficiency**: Electrical output divided by fuel energy input (Carnot limit considerations)
- **Intermittency and variability**: Challenges of solar and wind generation
- **Energy storage**: Need for balancing supply and demand with variable renewables
- **Grid stability**: Frequency regulation, voltage control, inertia
- **Sector coupling**: Integration of electricity, heat, and transport sectors
- **Decarbonization pathways**: Strategies for achieving climate neutrality
- **Energy security**: Reliability, independence, geopolitical considerations

**Encourage critical thinking:**
- Trade-offs between cost, sustainability, reliability, and public acceptance
- Realistic limitations and challenges of energy transition
- Role of technology, policy, and societal behavior change
- Regional differences in energy resources and optimal solutions
- Time scales for infrastructure development and technology deployment
