---
id: electric-charge-field
name: Electric Charge and Field
description: 'Electric charge, Coulomb''s law, electric fields, and electrical potential'
grade: 9
ages:
  - 14
  - 17
focus: 'Electric charge, elementary charge, Coulomb''s law, electric field, field lines, electric potential, voltage as potential difference, capacitor, energy in electric fields'
difficulty: hard
learning_objectives:
  - Understand electric charge and elementary charge
  - Apply field concept to describe electric interactions
  - Calculate electric field strength and potential
  - Analyze charged particle motion in electric fields
prerequisites:
  - basic-electricity
example_tasks:
  - Two point charges of +2 μC and -3 μC are 10 cm apart. Calculate the force between them using Coulomb's law
  - Draw the electric field lines around a positive point charge
  - An electron enters a uniform electric field. Describe its motion and calculate the acceleration
real_world_context: 'Static electricity, lightning, capacitors in electronics, particle accelerators, electrostatic precipitators, touch screens, electrostatic spray painting'
---

# Electric Charge and Field Tasks

Create physics problems that explore electric charge, Coulomb force interactions, electric field concepts, and electrical potential. Problems should help students understand the field model of electrical interactions, visualize electric fields, and apply quantitative calculations to charged particles in electric fields.

**Vary the problem structure:**
- **Coulomb's law calculations** using $F = k \cdot \frac{|q_1 \cdot q_2|}{r^2}$ with $k = 9 \times 10^9 \frac{\text{N·m}^2}{\text{C}^2}$: Calculate electrostatic force between point charges, determine whether force is attractive or repulsive based on charge signs
- **Electric field strength** using $E = \frac{F}{q}$ or $E = k \cdot \frac{|Q|}{r^2}$: Calculate field strength at a point near a point charge, or determine the force a field exerts on a test charge
- **Electric field between parallel plates** using $E = \frac{U}{d}$: Calculate uniform field strength between capacitor plates given voltage and plate separation
- **Force on charges in fields**: Given field strength and charge, calculate force using $F = q \cdot E$, determine acceleration using $F = m \cdot a$ (especially for electrons and protons)
- **Electric potential** using $U = E \cdot d$: Calculate potential difference when moving through a uniform electric field, understand voltage as work per charge
- **Work and energy in electric fields** using $W = q \cdot U$: Calculate work done moving a charge through a potential difference, or energy gained/lost by charged particles
- **Capacitor calculations** using $C = \frac{Q}{U}$: Calculate capacitance, stored charge, or voltage for capacitors; energy stored using $W = \frac{1}{2} \cdot C \cdot U^2$
- **Field line diagrams**: Draw field line patterns for point charges (positive/negative), dipoles (two opposite charges), parallel plates; identify regions of strong/weak field
- **Charge quantization**: Calculate number of elementary charges using $Q = n \cdot e$ with $e = 1.6 \times 10^{-19}$ C
- **Particle motion in fields**: Analyze motion of electrons, protons, or ions in uniform electric fields (deflection in cathode ray tubes, particle accelerators)

**Vary the content/context:**
- **Static electricity**: Rubbing balloons on hair, charged plastic rods attracting paper, sparks from doorknobs, clothes clinging from dryer
- **Natural phenomena**: Lightning formation, thunder, electric fields in atmosphere, St. Elmo's fire
- **Capacitors in technology**: Energy storage in camera flashes, power supplies, touchscreens, defibrillators, capacitor banks
- **Particle physics**: Electron beams in cathode ray tubes (old TVs/monitors), particle accelerators, mass spectrometers, electron microscopes
- **Industrial applications**: Electrostatic precipitators for air cleaning, electrostatic spray painting, photocopiers, laser printers
- **Atomic scale**: Electric force holding electrons in atoms, comparing electric force to gravitational force at atomic distances
- **Laboratory setups**: Millikan oil drop experiment, Van de Graaff generator, parallel plate capacitors, field mapping with grass seeds in oil

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 15): Qualitative understanding of charge (like charges repel, unlike attract), simple Coulomb's law calculations with clear numbers, drawing basic field line patterns, concept of electric field as force per charge, field between parallel plates
- **For middle ages** ({{age}} 15-16): Quantitative Coulomb force calculations with scientific notation, calculate field strength and force on charges, relate voltage to field and distance ($U = E \cdot d$), basic capacitor problems ($C = Q/U$), particle acceleration in fields
- **For older ages** ({{age}} >= 17): Complex multi-step problems, combine field and force calculations with kinematics (projectile motion of charged particles in fields), energy considerations ($W = q \cdot U$), capacitor energy ($W = \frac{1}{2} C U^2$), field superposition from multiple charges

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for basic laws: Coulomb's law $F = k \cdot \frac{|q_1 \cdot q_2|}{r^2}$, field strength $E = \frac{F}{q}$, elementary charge $e = 1.6 \times 10^{-19}$ C
- Block for field equations:

$$E = k \cdot \frac{|Q|}{r^2} \quad \text{(point charge)}$$

$$E = \frac{U}{d} \quad \text{(parallel plates)}$$

$$F = q \cdot E$$

$$W = q \cdot U = q \cdot E \cdot d$$

- Capacitor equations:

$$C = \frac{Q}{U}$$

$$W = \frac{1}{2} \cdot Q \cdot U = \frac{1}{2} \cdot C \cdot U^2 = \frac{Q^2}{2C}$$

**Tables for particle properties:**

| Particle | Charge (C)              | Mass (kg)               |
|----------|-------------------------|-------------------------|
| Electron | $-1.6 \times 10^{-19}$  | $9.1 \times 10^{-31}$   |
| Proton   | $+1.6 \times 10^{-19}$  | $1.67 \times 10^{-27}$  |
| Alpha    | $+3.2 \times 10^{-19}$  | $6.64 \times 10^{-27}$  |

**Comparison table for forces:**

| Distance | Electric Force (two protons) | Gravitational Force | Ratio F_e/F_g |
|----------|------------------------------|---------------------|---------------|
| 1 nm     | 2.3 × 10⁻¹⁰ N                | 1.9 × 10⁻⁴⁶ N       | 10³⁶          |

**SVG diagrams for electric fields:**

Use SVG to show:
- Field line patterns radiating from positive charges, converging to negative charges
- Dipole field patterns (two opposite charges)
- Uniform field between parallel plates with equally spaced parallel lines
- Test charge in a field with force vector
- Equipotential surfaces perpendicular to field lines
- Charged particle trajectories in electric fields

Example SVG for field lines around point charges:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Positive charge -->
  <circle cx="100" cy="150" r="20" fill="#ef4444" stroke="black" stroke-width="2"/>
  <text x="92" y="158" font-size="20" fill="white">+</text>
  <!-- Negative charge -->
  <circle cx="300" cy="150" r="20" fill="#3b82f6" stroke="black" stroke-width="2"/>
  <text x="295" y="158" font-size="20" fill="white">−</text>
  <!-- Field lines from + to − -->
  <path d="M 120 150 L 280 150" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 115 130 Q 200 120 285 140" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 115 170 Q 200 180 285 160" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 110 110 Q 200 90 290 130" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 110 190 Q 200 210 290 170" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#arrowhead)"/>
  <!-- Arrow marker definition -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#10b981"/>
    </marker>
  </defs>
  <text x="150" y="30" font-size="16">Electric Field Lines (Dipole)</text>
</svg>
```

Example SVG for parallel plate capacitor:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Left plate (positive) -->
  <rect x="80" y="50" width="20" height="200" fill="#ef4444" stroke="black" stroke-width="2"/>
  <text x="65" y="160" font-size="24">+</text>
  <!-- Right plate (negative) -->
  <rect x="300" y="50" width="20" height="200" fill="#3b82f6" stroke="black" stroke-width="2"/>
  <text x="330" y="160" font-size="24">−</text>
  <!-- Uniform field lines -->
  <line x1="110" y1="80" x2="290" y2="80" stroke="#10b981" stroke-width="2" marker-end="url(#arrow2)"/>
  <line x1="110" y1="120" x2="290" y2="120" stroke="#10b981" stroke-width="2" marker-end="url(#arrow2)"/>
  <line x1="110" y1="160" x2="290" y2="160" stroke="#10b981" stroke-width="2" marker-end="url(#arrow2)"/>
  <line x1="110" y1="200" x2="290" y2="200" stroke="#10b981" stroke-width="2" marker-end="url(#arrow2)"/>
  <line x1="110" y1="240" x2="290" y2="240" stroke="#10b981" stroke-width="2" marker-end="url(#arrow2)"/>
  <!-- Labels -->
  <text x="170" y="280" font-size="14">Uniform Electric Field</text>
  <text x="180" y="30" font-size="14">E = U/d</text>
  <defs>
    <marker id="arrow2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#10b981"/>
    </marker>
  </defs>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Simple Coulomb's law with clear numbers (avoid very small/large exponents), qualitative field concepts, draw basic field patterns, understand attractive vs. repulsive forces, calculate force on charge in given field
- **Medium**: Full Coulomb calculations with scientific notation, calculate field strength from charges, determine force and acceleration of electrons/protons in fields, $E = U/d$ for parallel plates, basic capacitor calculations
- **Hard**: Multi-step problems combining electrostatics with kinematics (particle trajectories), energy calculations in fields, capacitor energy storage, field superposition from multiple charges, compare electric and gravitational forces, complex field patterns

**Include variety in numerical values:**
- Charges: $±1$ μC, $±5$ μC, $±10$ μC, $±2$ nC, $±50$ nC, number of elementary charges ($10^{12}$ electrons)
- Distances: 1 cm, 5 cm, 10 cm, 50 cm, 1 mm (small scale), 1 m
- Voltages: 10 V, 50 V, 100 V, 500 V, 1 kV, 10 kV, 230 V (household)
- Field strengths: $100$ N/C, $1000$ N/C, $10^4$ N/C, $10^6$ N/C (strong fields)
- Plate separations: 1 mm, 5 mm, 1 cm, 2 cm, 5 cm
- Capacitances: 1 μF, 10 μF, 100 μF, 1000 μF, 1 nF, 10 nF
- Ensure different numerical answers each time to prevent memorization
