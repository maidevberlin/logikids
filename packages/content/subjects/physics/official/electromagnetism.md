---
id: electromagnetism
name: Electromagnetism
description: 'Interaction between electricity and magnetism - electromagnets, motors, induction, generators, transformers'
grade: 9
ages:
  - 14
  - 17
focus: 'Magnetic field of straight conductor and solenoid, electromagnets, force on current in magnetic field, Lorentz force, electric motor, electromagnetic induction, Lenz''s law, generator, transformer, alternating current'
difficulty: hard
learning_objectives:
  - Explain magnetic field of current-carrying conductors
  - Understand force on conductor in magnetic field (Lorentz force)
  - Apply electromagnetic induction
  - Analyze motors, generators, and transformers
prerequisites:
  - basic-electricity
  - magnetism
example_tasks:
  - Determine the direction of the magnetic field around a current-carrying wire using the right-hand rule
  - Calculate the force on a 20 cm conductor carrying 5 A perpendicular to a 0.5 T magnetic field
  - A coil with 100 turns experiences a magnetic flux change from 0.02 Wb to 0.08 Wb in 0.1 s. Calculate the induced voltage
real_world_context: 'Electric motors in appliances and vehicles, generators in power plants, transformers in power distribution, induction cooktops, wireless charging, speakers, electromagnetic brakes'
---

# Electromagnetism Tasks

Create physics problems that explore the interaction between electricity and magnetism: magnetic fields produced by electric currents, forces on current-carrying conductors in magnetic fields, electromagnetic induction, and applications in motors, generators, and transformers. Problems should help students understand the fundamental connection between electricity and magnetism and analyze electromagnetic devices.

**Vary the problem structure:**
- **Magnetic field of straight conductor**: Describe or draw the circular magnetic field around a current-carrying straight wire, apply right-hand rule (thumb = current direction, fingers curl = field direction)
- **Magnetic field of solenoid**: Explain that a coil (solenoid) produces a magnetic field similar to a bar magnet with N and S poles, apply right-hand rule for coils (fingers = current direction, thumb = N pole)
- **Electromagnets**: Analyze electromagnets (coil wrapped around iron core), understand that field strength increases with current and number of turns, explain why iron core strengthens the field
- **Lorentz force direction** using right-hand rule: Given current direction and magnetic field direction, determine force direction (FBI rule: F = Force, B = field, I = current, all perpendicular)
- **Lorentz force magnitude** using $F = B \cdot I \cdot L \cdot \sin\alpha$ (often perpendicular: $F = B \cdot I \cdot L$): Calculate force on a conductor of length L carrying current I in magnetic field of strength B
- **Electric motor principle**: Explain how a current-carrying coil in a magnetic field experiences torque and rotates, understand role of commutator to reverse current and maintain rotation
- **Electromagnetic induction** using Faraday's law $U_{ind} = -N \cdot \frac{\Delta\Phi}{\Delta t}$: Calculate induced voltage when magnetic flux through a coil changes (moving magnet into/out of coil, changing field strength, rotating coil)
- **Lenz's law**: Determine direction of induced current (induced current creates field opposing the change that caused it), understand energy conservation in induction
- **Generator principle**: Explain how rotating coil in magnetic field generates alternating voltage, understand generator converts mechanical energy to electrical energy
- **Transformer calculations** using $\frac{U_1}{U_2} = \frac{N_1}{N_2}$ and $U_1 \cdot I_1 = U_2 \cdot I_2$ (ideal transformer): Calculate output voltage/current given turns ratio, understand step-up vs. step-down transformers
- **Alternating current (AC)**: Understand AC changes direction periodically (50 Hz in Europe, 60 Hz in US), explain why transformers only work with AC, not DC
- **Energy and power in induction**: Apply energy conservation to generators and transformers, calculate efficiency accounting for energy losses

**Vary the content/context:**
- **Magnetic field demonstration**: Compass needles around current-carrying wire, iron filings pattern around solenoid, electromagnet lifting iron objects
- **Electromagnets**: Electromagnetic cranes lifting scrap metal, doorbell mechanisms, relay switches, electromagnetic locks, circuit breakers
- **Electric motors**: Motors in household appliances (fans, washing machines, vacuum cleaners, food processors), power tools (drills, saws), electric vehicles, trains, elevator motors
- **Generators**: Bicycle dynamos, hydroelectric power plants (water drives turbine), wind turbines, fossil fuel power plants (steam drives turbine), hand-crank generators
- **Transformers**: Power distribution (high voltage transmission, step-down to household 230V), phone chargers, laptop power supplies, doorbell transformers (230V to 12V)
- **Induction applications**: Induction cooktops heating metal pans via eddy currents, wireless charging for phones, metal detectors, inductive sensors, eddy current brakes
- **Speakers**: Voice coil (conductor) moves in magnetic field when current flows, producing sound vibrations
- **Electromagnetic brakes**: Eddy current brakes in trains and amusement park rides (moving conductor experiences force in field)
- **Particle accelerators**: Charged particles accelerated and steered using electric and magnetic fields

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 15): Qualitative understanding of magnetic field around current-carrying wire and solenoid, right-hand rule for determining field direction, basic electromagnet function, simple induction (moving magnet near coil), motor and generator principles (qualitative), transformer turns ratio
- **For middle ages** ({{age}} 15-16): Calculate Lorentz force $F = B \cdot I \cdot L$ for perpendicular cases, quantitative induction calculations using $U_{ind} = N \cdot \frac{\Delta\Phi}{\Delta t}$, transformer calculations with voltage and current, apply Lenz's law to determine induced current direction, basic motor/generator analysis
- **For older ages** ({{age}} >= 17): Complex problems with non-perpendicular angles ($F = B \cdot I \cdot L \cdot \sin\alpha$), magnetic flux calculations $\Phi = B \cdot A \cdot \cos\alpha$, rotating coils in fields (sinusoidal voltage generation), transformer efficiency with power losses, eddy currents and their effects, self-induction and inductance

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for basic laws: Lorentz force $F = B \cdot I \cdot L$, Faraday's law $U_{ind} = -N \cdot \frac{\Delta\Phi}{\Delta t}$
- Block for electromagnetic equations:

$$F = B \cdot I \cdot L \cdot \sin\alpha$$

$$U_{ind} = -N \cdot \frac{\Delta\Phi}{\Delta t}$$

$$\Phi = B \cdot A \cdot \cos\alpha$$

- Transformer equations:

$$\frac{U_1}{U_2} = \frac{N_1}{N_2}$$

$$P_1 = P_2 \quad \Rightarrow \quad U_1 \cdot I_1 = U_2 \cdot I_2 \quad \text{(ideal transformer)}$$

**Tables for electromagnetic devices:**

| Device        | Energy Conversion           | Input             | Output            |
|---------------|-----------------------------|-------------------|-------------------|
| Motor         | Electrical → Mechanical     | Electric current  | Rotation, motion  |
| Generator     | Mechanical → Electrical     | Rotation, motion  | Electric voltage  |
| Transformer   | Electrical → Electrical     | AC voltage (primary) | AC voltage (secondary) |

**Transformer comparison:**

| Type         | Turns Ratio | Voltage Change | Current Change | Application           |
|--------------|-------------|----------------|----------------|-----------------------|
| Step-up      | N₂ > N₁     | Increases      | Decreases      | Power transmission    |
| Step-down    | N₂ < N₁     | Decreases      | Increases      | Household supply, chargers |

**Field strength comparison:**

| Location              | Magnetic Flux Density (T) |
|-----------------------|---------------------------|
| Earth's field         | 0.00005                   |
| Refrigerator magnet   | 0.001 - 0.01              |
| Loudspeaker magnet    | 0.1 - 1                   |
| MRI machine           | 1.5 - 3                   |
| Strong electromagnet  | 10 - 20                   |

**SVG diagrams for electromagnetism:**

Use SVG to show:
- Circular magnetic field lines around straight current-carrying wire
- Magnetic field of solenoid showing N and S poles
- Right-hand rule illustrations for wire, coil, and force
- Current-carrying conductor in magnetic field with force vector
- Simple motor with coil, magnets, and commutator
- Magnet moving into coil with induced current direction
- Generator with rotating coil in magnetic field
- Transformer with primary and secondary coils on iron core
- Eddy current patterns in moving conductor

Example SVG for magnetic field around straight conductor:
```svg
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Current-carrying wire (cross-section, current into page) -->
  <circle cx="150" cy="150" r="15" fill="#6b7280" stroke="black" stroke-width="2"/>
  <!-- X symbol (current into page) -->
  <line x1="140" y1="140" x2="160" y2="160" stroke="white" stroke-width="3"/>
  <line x1="140" y1="160" x2="160" y2="140" stroke="white" stroke-width="3"/>
  <!-- Circular field lines (counterclockwise when current into page) -->
  <circle cx="150" cy="150" r="40" fill="none" stroke="#10b981" stroke-width="2"/>
  <circle cx="150" cy="150" r="70" fill="none" stroke="#10b981" stroke-width="2"/>
  <circle cx="150" cy="150" r="100" fill="none" stroke="#10b981" stroke-width="2"/>
  <!-- Field direction arrows (counterclockwise) -->
  <polygon points="150,110 145,115 155,115" fill="#10b981"/>
  <polygon points="190,150 185,145 185,155" fill="#10b981"/>
  <polygon points="150,190 145,185 155,185" fill="#10b981"/>
  <polygon points="110,150 115,145 115,155" fill="#10b981"/>
  <!-- Labels -->
  <text x="120" y="20" font-size="14">Magnetic Field Lines</text>
  <text x="110" y="290" font-size="12">Current into page (⊗)</text>
</svg>
```

Example SVG for solenoid:
```svg
<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
  <!-- Solenoid coil -->
  <ellipse cx="100" cy="125" rx="15" ry="40" fill="none" stroke="#3b82f6" stroke-width="3"/>
  <line x1="100" y1="85" x2="300" y2="85" stroke="#3b82f6" stroke-width="3"/>
  <line x1="100" y1="165" x2="300" y2="165" stroke="#3b82f6" stroke-width="3"/>
  <!-- Coil loops -->
  <ellipse cx="140" cy="125" rx="8" ry="40" fill="none" stroke="#3b82f6" stroke-width="2"/>
  <ellipse cx="180" cy="125" rx="8" ry="40" fill="none" stroke="#3b82f6" stroke-width="2"/>
  <ellipse cx="220" cy="125" rx="8" ry="40" fill="none" stroke="#3b82f6" stroke-width="2"/>
  <ellipse cx="260" cy="125" rx="8" ry="40" fill="none" stroke="#3b82f6" stroke-width="2"/>
  <ellipse cx="300" cy="125" rx="15" ry="40" fill="none" stroke="#3b82f6" stroke-width="3"/>
  <!-- Field lines -->
  <path d="M 80 125 L 40 125 Q 20 125 20 80 Q 20 30 200 20 Q 380 30 380 80 Q 380 125 320 125"
        fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#arrowem)"/>
  <path d="M 80 125 L 30 125 Q 10 125 10 105 Q 10 200 200 230 Q 390 200 390 105 Q 390 125 320 125"
        fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#arrowem)"/>
  <!-- Poles -->
  <text x="315" y="115" font-size="20" font-weight="bold" fill="#ef4444">N</text>
  <text x="75" y="115" font-size="20" font-weight="bold" fill="#3b82f6">S</text>
  <text x="150" y="240" font-size="14">Magnetic Field of Solenoid</text>
  <defs>
    <marker id="arrowem" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#10b981"/>
    </marker>
  </defs>
</svg>
```

Example SVG for Lorentz force:
```svg
<svg viewBox="0 0 350 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Magnetic field (into page) -->
  <text x="50" y="80" font-size="14">Magnetic Field B (into page)</text>
  <circle cx="100" cy="120" r="3" fill="black"/>
  <line x1="97" y1="117" x2="103" y2="123" stroke="black" stroke-width="1"/>
  <line x1="97" y1="123" x2="103" y2="117" stroke="black" stroke-width="1"/>
  <!-- Similar X marks for field -->
  <circle cx="150" cy="120" r="3" fill="black"/>
  <line x1="147" y1="117" x2="153" y2="123" stroke="black" stroke-width="1"/>
  <circle cx="200" cy="120" r="3" fill="black"/>
  <line x1="197" y1="117" x2="203" y2="123" stroke="black" stroke-width="1"/>
  <!-- Conductor (wire) -->
  <line x1="50" y1="180" x2="300" y2="180" stroke="#ef4444" stroke-width="5"/>
  <text x="120" y="210" font-size="14">Current I (rightward)</text>
  <!-- Current arrow -->
  <polygon points="250,180 240,175 240,185" fill="#ef4444"/>
  <!-- Force arrow (upward) -->
  <line x1="175" y1="180" x2="175" y2="100" stroke="#10b981" stroke-width="4" marker-end="url(#arrowf)"/>
  <text x="180" y="140" font-size="16" font-weight="bold" fill="#10b981">F</text>
  <text x="100" y="280" font-size="14">Force F = B · I · L (upward)</text>
  <defs>
    <marker id="arrowf" markerWidth="12" markerHeight="12" refX="10" refY="3" orient="auto">
      <polygon points="0 0, 12 3, 0 6" fill="#10b981"/>
    </marker>
  </defs>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Qualitative understanding of magnetic field around wire and coil, apply right-hand rule to determine directions, basic electromagnet function, understand motor and generator convert between electrical and mechanical energy, simple transformer turns ratio
- **Medium**: Calculate Lorentz force for perpendicular cases ($F = B \cdot I \cdot L$), induced voltage from flux change ($U = N \cdot \Delta\Phi/\Delta t$), transformer voltage and current calculations, apply Lenz's law, analyze simple motor/generator operation
- **Hard**: Non-perpendicular angles with sine factor, calculate magnetic flux with area and angle, rotating coil problems (sinusoidal AC generation), transformer efficiency and power losses, analyze eddy currents, complex motor/generator problems, self-induction

**Include variety in numerical values:**
- Currents: 0.5 A, 2 A, 5 A, 10 A, 50 A (strong electromagnets), 0.1 A (small coils)
- Magnetic field strengths: 0.01 T, 0.05 T, 0.1 T, 0.5 T, 1 T, 2 T
- Conductor lengths: 5 cm, 10 cm, 20 cm, 50 cm, 1 m, 2 m
- Number of coil turns: 10, 50, 100, 200, 500, 1000
- Flux changes: 0.01 Wb to 0.05 Wb, 0.1 Wb to 0.4 Wb, 0.02 Wb to 0.08 Wb
- Time intervals: 0.01 s, 0.05 s, 0.1 s, 0.5 s, 1 s, 2 s
- Transformer turns: Primary 100/1000/5000 turns, Secondary 20/500/10000 turns
- Voltages: 6 V, 12 V, 230 V (household), 400 V (three-phase), 10 kV, 110 kV (transmission)
- Frequencies: 50 Hz (Europe), 60 Hz (US), variable frequencies for motors
- Ensure different numerical answers each time to prevent memorization
