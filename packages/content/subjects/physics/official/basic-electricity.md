---
id: basic-electricity
name: Basic Electricity
description: 'Basic concepts of electric circuits - current, voltage, resistance, and simple circuits'
grade: 7
ages:
  - 12
  - 14
focus: 'Electric current, voltage, resistance, Ohm''s law, series circuits, parallel circuits, conductors and insulators, short circuits, household electrical installations, circuit diagrams'
difficulty: medium
learning_objectives:
  - Build and analyze simple electric circuits
  - Measure current, voltage, and resistance
  - Apply Ohm's law
  - Understand series and parallel circuits
prerequisites: []
example_tasks:
  - A lamp with 12 Ω resistance is connected to a 6 V battery. What current flows through it?
  - Draw a circuit diagram showing two lamps in series with a battery and a switch
  - Which materials conduct electricity well and which are insulators?
real_world_context: 'Household wiring, flashlights, electrical safety, circuit design, measuring instruments, everyday electrical devices'
---

# Basic Electricity Tasks

Create physics problems that explore fundamental electrical concepts including current, voltage, resistance, and circuit configurations. Problems should help students build and analyze simple circuits, apply Ohm's law, and understand electrical safety.

**Vary the problem structure:**
- **Ohm's law calculations** using $U = R \cdot I$: Calculate voltage, current, or resistance when two quantities are given for simple circuits with resistors, lamps, or heating elements
- **Series circuit analysis**: Analyze circuits with components in series, understanding that current is constant throughout and voltages add up ($U_{total} = U_1 + U_2 + ...$)
- **Parallel circuit analysis**: Analyze circuits with components in parallel, understanding that voltage is constant across branches and currents add up ($I_{total} = I_1 + I_2 + ...$)
- **Resistance calculations in series** using $R_{total} = R_1 + R_2 + ...$: Calculate total resistance when resistors are connected in series
- **Resistance calculations in parallel** using $\frac{1}{R_{total}} = \frac{1}{R_1} + \frac{1}{R_2} + ...$: Calculate total resistance for simple parallel configurations (especially for younger students, use two identical resistors: $R_{total} = \frac{R}{2}$)
- **Circuit diagram drawing**: Given a description of a circuit (battery, switch, lamp, motor), ask students to draw the correct circuit diagram using standard symbols
- **Circuit diagram interpretation**: Show a circuit diagram and ask students to identify components, trace current path, or predict what happens when switch is closed
- **Current and voltage measurements**: Describe where to connect ammeter (in series) and voltmeter (in parallel) to measure current and voltage
- **Conductors and insulators**: Identify which materials conduct electricity (metals, graphite) and which are insulators (plastic, rubber, glass, wood)
- **Electrical safety**: Recognize dangerous situations (short circuits, water near electricity, damaged cables) and safety measures

**Vary the content/context:**
- **Household applications**: Room lighting, kitchen appliances, power outlets, fuse boxes, light switches
- **Portable devices**: Flashlights, battery-powered toys, remote controls, LED headlamps
- **School experiments**: Simple circuits with batteries and lamps, measuring current and voltage, testing conductors and insulators
- **Safety situations**: Wet hands and electricity, damaged cables, overloaded outlets, fuses and circuit breakers
- **Measurement instruments**: Ammeters measuring current in amperes (A), voltmeters measuring voltage in volts (V), multimeters
- **Everyday materials**: Copper wires (good conductor), aluminum foil (conductor), plastic coating (insulator), rubber gloves (insulator)

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 13): Simple circuits with one battery and one or two lamps, basic Ohm's law with easy numbers, qualitative understanding of conductors/insulators, drawing simple circuit diagrams, safety awareness
- **For middle ages** ({{age}} 13-14): Calculate with Ohm's law using all three variables (U, R, I), series and parallel circuits with 2-3 components, total resistance in series, interpret circuit diagrams, ammeter and voltmeter placement
- **For older ages** ({{age}} >= 14): Complex circuits combining series and parallel elements, resistance calculations in parallel, multi-step problems requiring multiple applications of Ohm's law, design circuits for specific requirements

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for Ohm's law: $U = R \cdot I$, $I = \frac{U}{R}$, $R = \frac{U}{I}$
- Block for circuit laws:

$$U_{total} = U_1 + U_2 + U_3 \quad \text{(series circuit)}$$

$$I_{total} = I_1 + I_2 + I_3 \quad \text{(parallel circuit)}$$

$$R_{total} = R_1 + R_2 + R_3 \quad \text{(series resistance)}$$

**Tables for circuit data:**

| Component | Voltage (V) | Current (A) | Resistance (Ω) |
|-----------|-------------|-------------|----------------|
| Lamp 1    | 3           | 0.5         | 6              |
| Lamp 2    | 3           | 0.5         | 6              |
| Total     | 6           | 0.5         | 12             |

**SVG diagrams for circuits:**

Use SVG to show:
- Circuit diagrams with standard symbols (battery, resistor, lamp, switch, ammeter, voltmeter)
- Current flow direction with arrows
- Series and parallel configurations
- Measurement instrument connections
- Open and closed switches

Example SVG for simple series circuit:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Wire rectangle -->
  <line x1="50" y1="100" x2="350" y2="100" stroke="black" stroke-width="2"/>
  <line x1="350" y1="100" x2="350" y2="200" stroke="black" stroke-width="2"/>
  <line x1="350" y1="200" x2="50" y2="200" stroke="black" stroke-width="2"/>
  <line x1="50" y1="200" x2="50" y2="100" stroke="black" stroke-width="2"/>
  <!-- Battery (left side) -->
  <line x1="50" y1="120" x2="50" y2="180" stroke="black" stroke-width="4"/>
  <line x1="60" y1="130" x2="60" y2="170" stroke="black" stroke-width="2"/>
  <text x="35" y="155" font-size="14">+</text>
  <!-- Lamp (top) -->
  <circle cx="200" cy="100" r="15" fill="none" stroke="black" stroke-width="2"/>
  <line x1="190" y1="90" x2="210" y2="110" stroke="black" stroke-width="2"/>
  <line x1="210" y1="90" x2="190" y2="110" stroke="black" stroke-width="2"/>
  <!-- Switch (right side) -->
  <circle cx="350" cy="150" r="4" fill="black"/>
  <line x1="350" y1="150" x2="320" y2="135" stroke="black" stroke-width="2"/>
  <text x="310" y="175" font-size="12">Switch</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Single Ohm's law calculation with easy numbers (multiples of 2, 3, 5), simple series circuits with 1-2 components, identify conductors/insulators, draw basic circuit with battery and lamp
- **Medium**: Calculate any variable in Ohm's law, series circuits with 3 components, simple parallel circuits (2 identical resistors), total resistance in series, interpret circuit diagrams with multiple components
- **Hard**: Complex circuits combining series and parallel, calculate resistance in parallel circuits, multi-step problems (calculate individual currents and voltages), design circuits meeting specifications, troubleshoot circuit problems

**Include variety in numerical values:**
- Different voltages: 1.5 V (battery), 3 V, 4.5 V, 6 V, 9 V, 12 V, 230 V (household, mention with safety context)
- Vary currents: 0.1 A, 0.25 A, 0.5 A, 1 A, 2 A, 50 mA, 200 mA
- Different resistances: 2 Ω, 5 Ω, 10 Ω, 20 Ω, 50 Ω, 100 Ω, 1 kΩ
- Number of components: 1-2 lamps/resistors (easy), 2-3 (medium), 3-4 (hard)
- Circuit configurations: series only, parallel only, or combined series-parallel
- Ensure different numerical answers each time to prevent memorization
