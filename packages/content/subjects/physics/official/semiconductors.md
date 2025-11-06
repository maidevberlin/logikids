---
id: semiconductors
name: Semiconductors
description: 'Properties of semiconductors, doping, and semiconductor devices (diode, transistor)'
grade: 10
ages:
  - 15
  - 17
focus: 'Conductors, insulators, and semiconductors, intrinsic semiconductors, doping (n-type, p-type), p-n junction, diode characteristic curve, LED, transistor (npn, pnp), transistor as switch and amplifier'
difficulty: hard
learning_objectives:
  - Understand intrinsic and doped semiconductors
  - Explain p-n junction and diode function
  - Understand transistor as switch and amplifier
  - Recognize applications in electronics
prerequisites:
  - basic-electricity
  - electric-charge-field
example_tasks:
  - Explain why silicon behaves as a semiconductor at room temperature while copper conducts electricity well
  - A silicon diode has a forward voltage of 0.7 V. Calculate the current through a 330 Ω resistor when connected in series with a 5 V battery
  - Design a transistor switch circuit that turns on an LED when the base voltage exceeds 2 V
real_world_context: 'Computer processors, memory chips, solar cells, LEDs, sensors, amplifiers in audio equipment, power supplies, smartphones, digital cameras, electric vehicle battery management'
---

# Semiconductors Tasks

Create physics problems that explore semiconductor physics and devices: electrical properties of semiconductors, doping mechanisms, p-n junctions, diodes, transistors, and their applications in modern electronics. Problems should help students understand the fundamental principles underlying all digital and analog electronic devices.

**Vary the problem structure:**
- **Conductors vs. semiconductors vs. insulators**: Compare electrical conductivity, explain using band theory (valence band, conduction band, band gap), understand temperature dependence of semiconductor conductivity
- **Intrinsic semiconductors**: Explain silicon and germanium atomic structure (4 valence electrons), describe covalent bonding in crystal lattice, understand electron-hole pair generation at room temperature
- **Doping (n-type)**: Explain adding group-5 elements (phosphorus, arsenic) creates excess electrons (free charge carriers), understand majority carriers (electrons) vs. minority carriers (holes)
- **Doping (p-type)**: Explain adding group-3 elements (boron, aluminum) creates electron deficiencies (holes), understand majority carriers (holes) vs. minority carriers (electrons)
- **P-n junction formation**: Describe diffusion of carriers across junction, formation of depletion zone, built-in potential barrier, understand why current doesn't flow without external voltage
- **Diode forward bias**: Apply positive voltage to p-side reduces barrier, allows current flow, calculate voltage drop (~0.7 V for silicon, ~0.3 V for germanium), analyze I-V characteristic curve
- **Diode reverse bias**: Apply positive voltage to n-side increases barrier, blocks current (except tiny reverse current), understand breakdown voltage
- **Diode applications**: Analyze rectifier circuits (AC to DC conversion), protection circuits (prevent reverse polarity), voltage regulation with Zener diodes
- **LED (Light Emitting Diode)**: Explain electron-hole recombination releases photons, relate photon energy to LED color ($E = h \cdot f$, $\lambda = c/f$), calculate wavelength for given energy
- **Transistor structure (npn and pnp)**: Describe three layers (emitter, base, collector), explain how small base current controls large collector current
- **Transistor as switch**: Design circuits where transistor switches ON/OFF based on base voltage, calculate base resistor to achieve saturation, understand digital logic applications
- **Transistor as amplifier**: Calculate current gain ($\beta = I_C/I_B$), design simple amplifier circuits, understand voltage amplification in common-emitter configuration
- **Semiconductor materials**: Compare silicon (most common), germanium (obsolete), gallium arsenide (high-speed applications), silicon carbide (high power/temperature)

**Vary the content/context:**
- **Computer chips**: Processors with billions of transistors, memory (RAM, SSD) using transistor arrays, integrated circuits, Moore's Law (transistor density doubling)
- **Power electronics**: Rectifiers in power supplies, MOSFET transistors for efficient switching, inverters for solar systems and electric vehicles, voltage regulators
- **Optoelectronics**: Solar cells (photovoltaic effect in p-n junction), LEDs in lighting and displays, photodiodes in cameras and sensors, laser diodes in fiber optic communication
- **Sensors**: Temperature sensors (thermistors), light sensors (photodiodes, phototransistors), proximity sensors, pressure sensors
- **Audio electronics**: Amplifiers in speakers and headphones, transistor amplification stages, operational amplifiers (op-amps), signal processing
- **Display technology**: LED displays, OLED screens (organic LEDs), LCD backlighting, seven-segment displays
- **Automotive electronics**: Engine control units, battery management systems in electric vehicles, LED headlights, sensors (temperature, speed, pressure)
- **Communication devices**: Smartphones (processors, memory, sensors, displays), radio frequency (RF) amplifiers, signal modulation/demodulation
- **Medical devices**: Heart rate monitors, pulse oximeters (LED + photodiode), medical imaging sensors, implantable electronics
- **Renewable energy**: Solar cell arrays, maximum power point tracking (MPPT) controllers, battery charge controllers

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 16): Qualitative understanding of conductors/insulators/semiconductors, basic doping concept (adding impurities changes conductivity), simple diode function (allows current one direction), LED produces light, transistor acts as electronic switch, recognize semiconductor applications in everyday devices
- **For middle ages** ({{age}} 16): Understand n-type and p-type doping in detail, analyze p-n junction and depletion zone, calculate current in diode circuits using forward voltage, design simple transistor switch circuits, calculate LED photon energy and wavelength, analyze basic amplifier circuits
- **For older ages** ({{age}} >= 17): Band theory explanation of semiconductors (band gap energy), detailed p-n junction physics (built-in potential, Fermi levels), diode equation $I = I_S(e^{qV/(kT)} - 1)$, transistor beta calculations and amplifier design, temperature effects on semiconductor properties, advanced applications (MOSFET, field-effect transistors)

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for basic laws: Ohm's law in diode circuit $V = V_D + I \cdot R$, photon energy $E = h \cdot f$
- Block for semiconductor equations:

$$I = I_S \left( e^{\frac{qV}{kT}} - 1 \right) \quad \text{(diode equation)}$$

$$E = h \cdot f = \frac{h \cdot c}{\lambda}$$

$$\beta = \frac{I_C}{I_B} \quad \text{(transistor current gain)}$$

$$E_{gap} = \frac{h \cdot c}{\lambda_{max}}$$

- Power dissipation:

$$P = V \cdot I$$

**Tables for semiconductor materials:**

| Material         | Band Gap (eV) | Applications                           |
|------------------|---------------|----------------------------------------|
| Silicon (Si)     | 1.12          | Computer chips, solar cells           |
| Germanium (Ge)   | 0.66          | Historical (mostly obsolete)          |
| Gallium Arsenide | 1.43          | High-speed electronics, LEDs          |
| Silicon Carbide  | 3.26          | High-power, high-temperature devices  |

**Diode characteristics:**

| Diode Type | Forward Voltage | Typical Current | Application          |
|------------|----------------|-----------------|----------------------|
| Silicon    | 0.6 - 0.7 V    | mA to A         | Rectifiers, general  |
| Germanium  | 0.2 - 0.3 V    | mA to A         | Low-voltage circuits |
| LED        | 1.8 - 3.3 V    | 10 - 20 mA      | Lighting, displays   |
| Zener      | Varies         | mA              | Voltage regulation   |

**LED colors and photon energy:**

| LED Color | Wavelength (nm) | Photon Energy (eV) | Forward Voltage (V) |
|-----------|----------------|--------------------|---------------------|
| Infrared  | 940            | 1.3                | 1.2 - 1.5           |
| Red       | 660            | 1.9                | 1.8 - 2.0           |
| Yellow    | 590            | 2.1                | 2.0 - 2.2           |
| Green     | 530            | 2.3                | 2.2 - 3.0           |
| Blue      | 470            | 2.6                | 3.0 - 3.4           |

**Transistor types:**

| Type | Layers | Current Control              | Majority Application   |
|------|--------|------------------------------|------------------------|
| NPN  | n-p-n  | Small base current controls  | Signal amplification   |
| PNP  | p-n-p  | Small base current controls  | Complementary circuits |

**SVG diagrams for semiconductors:**

Use SVG to show:
- Crystal lattice structure of silicon (covalent bonds)
- N-type doping (extra electron from phosphorus)
- P-type doping (hole from boron)
- P-n junction with depletion zone
- Diode symbol and forward/reverse bias
- Diode I-V characteristic curve
- LED structure and light emission
- Transistor structure (emitter, base, collector)
- Transistor as switch circuit diagram
- Simple amplifier circuit
- Band diagrams (valence band, conduction band, band gap)

Example SVG for p-n junction:
```svg
<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <!-- P-type region -->
  <rect x="50" y="80" width="200" height="140" fill="#ef9a9a" stroke="black" stroke-width="2"/>
  <text x="100" y="110" font-size="20" font-weight="bold">P-type</text>
  <text x="80" y="135" font-size="14">Holes (+)</text>
  <!-- Holes representation -->
  <circle cx="90" cy="160" r="8" fill="white" stroke="red" stroke-width="2"/>
  <circle cx="130" cy="160" r="8" fill="white" stroke="red" stroke-width="2"/>
  <circle cx="170" cy="160" r="8" fill="white" stroke="red" stroke-width="2"/>
  <circle cx="110" cy="190" r="8" fill="white" stroke="red" stroke-width="2"/>
  <circle cx="150" cy="190" r="8" fill="white" stroke="red" stroke-width="2"/>

  <!-- Depletion zone -->
  <rect x="250" y="80" width="50" height="140" fill="#ffd54f" stroke="black" stroke-width="2"/>
  <text x="253" y="245" font-size="12">Depletion</text>
  <text x="263" y="260" font-size="12">Zone</text>

  <!-- N-type region -->
  <rect x="300" y="80" width="150" height="140" fill="#90caf9" stroke="black" stroke-width="2"/>
  <text x="320" y="110" font-size="20" font-weight="bold">N-type</text>
  <text x="320" y="135" font-size="14">Electrons (-)</text>
  <!-- Electrons representation -->
  <circle cx="330" cy="160" r="8" fill="#1976d2"/>
  <circle cx="370" cy="160" r="8" fill="#1976d2"/>
  <circle cx="410" cy="160" r="8" fill="#1976d2"/>
  <circle cx="350" cy="190" r="8" fill="#1976d2"/>
  <circle cx="390" cy="190" r="8" fill="#1976d2"/>

  <!-- Junction line -->
  <line x1="275" y1="80" x2="275" y2="220" stroke="black" stroke-width="3" stroke-dasharray="5,5"/>

  <!-- Labels -->
  <text x="180" y="40" font-size="18" font-weight="bold">P-N Junction</text>
  <text x="120" y="280" font-size="12">Acceptor atoms</text>
  <text x="320" y="280" font-size="12">Donor atoms</text>
</svg>
```

Example SVG for diode I-V curve:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Axes -->
  <line x1="200" y1="50" x2="200" y2="270" stroke="black" stroke-width="2" marker-end="url(#arrow)"/>
  <line x1="50" y1="200" x2="370" y2="200" stroke="black" stroke-width="2" marker-end="url(#arrow)"/>

  <!-- Axis labels -->
  <text x="375" y="205" font-size="14">V (Volts)</text>
  <text x="205" y="45" font-size="14">I (mA)</text>

  <!-- Voltage markers -->
  <line x1="280" y1="195" x2="280" y2="205" stroke="black" stroke-width="1"/>
  <text x="270" y="220" font-size="12">0.7V</text>
  <line x1="120" y1="195" x2="120" y2="205" stroke="black" stroke-width="1"/>
  <text x="105" y="220" font-size="12">-5V</text>

  <!-- I-V characteristic curve -->
  <!-- Reverse bias (flat near zero) -->
  <path d="M 50 200 L 195 200" stroke="#ef4444" stroke-width="3" fill="none"/>
  <!-- Forward bias (exponential rise) -->
  <path d="M 200 200 Q 260 200 280 150 Q 300 100 320 70 Q 340 50 360 40"
        stroke="#ef4444" stroke-width="3" fill="none"/>

  <!-- Forward region label -->
  <text x="290" y="120" font-size="12" fill="#ef4444">Forward bias</text>
  <!-- Reverse region label -->
  <text x="70" y="180" font-size="12" fill="#ef4444">Reverse bias</text>

  <!-- Title -->
  <text x="120" y="25" font-size="16" font-weight="bold">Diode I-V Characteristic</text>

  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="black"/>
    </marker>
  </defs>
</svg>
```

Example SVG for transistor switch circuit:
```svg
<svg viewBox="0 0 400 350" xmlns="http://www.w3.org/2000/svg">
  <!-- Battery -->
  <line x1="50" y1="80" x2="100" y2="80" stroke="black" stroke-width="2"/>
  <line x1="75" y1="70" x2="75" y2="90" stroke="black" stroke-width="3"/>
  <text x="30" y="85" font-size="14">+9V</text>

  <!-- LED -->
  <line x1="100" y1="80" x2="200" y2="80" stroke="black" stroke-width="2"/>
  <circle cx="200" cy="80" r="15" fill="none" stroke="#ef4444" stroke-width="2"/>
  <polygon points="195,75 195,85 205,80" fill="#ef4444"/>
  <text x="210" y="85" font-size="12">LED</text>

  <!-- Resistor (for LED) -->
  <line x1="200" y1="95" x2="200" y2="120" stroke="black" stroke-width="2"/>
  <rect x="190" y="120" width="20" height="40" fill="none" stroke="black" stroke-width="2"/>
  <text x="205" y="145" font-size="10">330Ω</text>

  <!-- To collector -->
  <line x1="200" y1="160" x2="200" y2="200" stroke="black" stroke-width="2"/>

  <!-- Transistor symbol (NPN) -->
  <!-- Vertical line (collector-emitter) -->
  <line x1="200" y1="200" x2="200" y2="260" stroke="black" stroke-width="3"/>
  <!-- Base line -->
  <line x1="120" y1="230" x2="200" y2="230" stroke="black" stroke-width="2"/>
  <!-- Collector arrow -->
  <line x1="200" y1="200" x2="240" y2="180" stroke="black" stroke-width="3"/>
  <text x="245" y="180" font-size="12">C</text>
  <!-- Emitter arrow -->
  <line x1="200" y1="260" x2="240" y2="280" stroke="black" stroke-width="3"/>
  <polygon points="240,280 235,270 230,280" fill="black"/>
  <text x="245" y="285" font-size="12">E</text>
  <!-- Base -->
  <text x="100" y="235" font-size="12">B</text>

  <!-- Base resistor -->
  <rect x="80" y="220" width="30" height="20" fill="none" stroke="black" stroke-width="2"/>
  <text x="75" y="255" font-size="10">10kΩ</text>

  <!-- Input signal -->
  <line x1="30" y1="230" x2="80" y2="230" stroke="black" stroke-width="2"/>
  <text x="10" y="225" font-size="12">Input</text>
  <text x="15" y="240" font-size="12">(0-5V)</text>

  <!-- Ground connections -->
  <line x1="240" y1="280" x2="240" y2="300" stroke="black" stroke-width="2"/>
  <line x1="220" y1="300" x2="260" y2="300" stroke="black" stroke-width="3"/>
  <line x1="225" y1="305" x2="255" y2="305" stroke="black" stroke-width="2"/>
  <line x1="230" y1="310" x2="250" y2="310" stroke="black" stroke-width="1"/>
  <text x="265" y="305" font-size="12">GND</text>

  <!-- Title -->
  <text x="100" y="30" font-size="16" font-weight="bold">Transistor Switch Circuit</text>
  <text x="80" y="335" font-size="11">When input > 0.7V, transistor conducts, LED turns ON</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Qualitative understanding of semiconductors vs. conductors/insulators, basic doping concept (n-type has extra electrons, p-type has holes), simple diode function (conducts one direction only), LED produces light when forward biased, transistor acts as switch
- **Medium**: Explain doping mechanisms in detail, analyze p-n junction formation and depletion zone, calculate current in diode circuits (using 0.7 V forward drop), design transistor switch circuits with base resistor calculations, relate LED color to photon energy
- **Hard**: Band theory and band gap energy, detailed diode equation and I-V characteristics, calculate transistor current gain and design amplifier circuits, analyze temperature effects on semiconductors, advanced applications (MOSFET, power electronics)

**Include variety in numerical values:**
- Voltages: 1.5 V, 3 V, 5 V, 9 V, 12 V (batteries), 0.6-0.7 V (silicon diode forward), 1.8-3.3 V (LED forward)
- Currents: 5 mA, 10 mA, 20 mA (LEDs), 50 mA, 100 mA, 1 A, 5 A (power diodes)
- Resistors: 100 Ω, 220 Ω, 330 Ω, 470 Ω, 1 kΩ, 2.2 kΩ, 10 kΩ, 47 kΩ, 100 kΩ
- LED wavelengths: 470 nm (blue), 530 nm (green), 590 nm (yellow), 660 nm (red), 940 nm (infrared)
- Transistor beta (current gain): 50, 100, 150, 200, 250
- Power dissipation: 0.1 W, 0.25 W, 0.5 W, 1 W, 5 W
- Band gap energies: 0.66 eV (Ge), 1.12 eV (Si), 1.43 eV (GaAs), 3.26 eV (SiC)
- Doping concentrations: 10¹⁵ to 10¹⁹ atoms/cm³
- Ensure different numerical answers each time to prevent memorization
