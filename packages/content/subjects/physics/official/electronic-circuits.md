---
id: electronic-circuits
name: Electronic Circuits
description: 'Basic electronic circuits with semiconductors and their applications'
grade: 10
ages:
  - 15
  - 17
focus: 'Diode circuits, rectifier circuits, transistor circuits, transistor amplification factor, logic gates (AND, OR, NOT), digital electronics basics, sensors and actuators'
difficulty: hard
learning_objectives:
  - Build and analyze circuits with diodes and transistors
  - Understand transistor amplification
  - Apply semiconductors to simple applications
  - Understand digital electronics basics
prerequisites:
  - basic-electricity
  - semiconductors
example_tasks:
  - Design a half-wave rectifier using a single diode to convert AC to pulsating DC
  - Calculate the amplification factor of a transistor amplifier where a 0.05 mA base current controls a 10 mA collector current
  - Create a truth table for a two-input AND gate and explain how it can be implemented using diodes or transistors
real_world_context: 'Power supplies and chargers, audio amplifiers, radio circuits, sensor interfaces, motor control, digital logic circuits, microcontrollers, robotics, home automation, communication systems'
---

# Electronic Circuits Tasks

Create physics problems that explore practical electronic circuits using semiconductor devices: diode rectifiers, transistor amplifiers and switches, digital logic gates, and sensor/actuator interfaces. Problems should help students design, analyze, and understand real electronic circuits found in everyday devices.

**Vary the problem structure:**
- **Half-wave rectifier**: Single diode converts AC to pulsating DC (one half-wave passes, other blocked), analyze output waveform, calculate average DC voltage ($V_{avg} = V_{peak}/\pi$ for half-wave)
- **Full-wave rectifier (bridge)**: Four diodes in bridge configuration convert AC to pulsating DC (both half-waves used), calculate average DC voltage ($V_{avg} = 2V_{peak}/\pi$ for full-wave), understand voltage drop across two diodes in series
- **Smoothing capacitor**: Add capacitor parallel to load after rectifier reduces ripple, analyze charging/discharging, understand larger capacitance = smoother DC
- **Voltage regulation with Zener diode**: Zener diode maintains constant voltage despite input variations, design simple voltage regulator circuits, calculate series resistor
- **Diode protection circuits**: Use diodes to protect against reverse polarity, overvoltage protection, flyback diode across inductive loads (motors, relays)
- **Transistor as switch**: Design circuits where transistor switches loads ON/OFF, calculate base resistor for saturation ($I_B = I_C/\beta$), understand switching applications (LED control, relay drivers, motor control)
- **Transistor as amplifier**: Analyze common-emitter amplifier configuration, calculate voltage gain ($A_v = \Delta V_{out}/\Delta V_{in}$), current gain ($\beta = I_C/I_B$), understand biasing and operating point
- **Darlington pair**: Two transistors connected for higher current gain ($\beta_{total} = \beta_1 \times \beta_2$), applications in power amplification
- **Logic gates - AND**: Both inputs HIGH for output HIGH, implement using diodes or transistors, truth table with 4 combinations (00, 01, 10, 11)
- **Logic gates - OR**: At least one input HIGH for output HIGH, implement using diodes or transistors, understand parallel logic
- **Logic gates - NOT (inverter)**: Single input inverted at output (HIGH → LOW, LOW → HIGH), transistor inverter circuit, digital signal inversion
- **Combining logic gates**: NAND (NOT-AND), NOR (NOT-OR), XOR (exclusive OR), analyze complex logic circuits, derive Boolean expressions
- **Sensor circuits - LDR (light dependent resistor)**: Voltage divider with LDR changes voltage based on light level, trigger transistor switch for automatic lighting
- **Sensor circuits - thermistor**: Temperature-dependent resistor in voltage divider, analyze temperature sensing circuits, applications in thermostats
- **Actuator circuits - LED driver**: Current-limiting resistor calculation, multiple LEDs in series/parallel, understand power dissipation
- **Actuator circuits - motor control**: Transistor switch controls motor, flyback diode protects against inductive kickback, PWM (pulse width modulation) for speed control
- **Relay driver circuit**: Transistor switches relay coil, relay contacts control high-power loads, isolation between control and power circuits
- **Oscillator circuits**: RC or LC oscillators generate periodic signals, understand applications in timers, clocks, signal generators
- **Operational amplifier basics**: Inverting and non-inverting amplifier configurations, voltage follower (buffer), comparator circuits

**Vary the content/context:**
- **Power supplies**: Phone chargers (AC to DC conversion), laptop power bricks, USB power adapters, battery chargers, regulated vs. unregulated supplies
- **Audio electronics**: Microphone preamplifiers, headphone amplifiers, speaker amplifiers, audio mixing consoles, guitar effect pedals, intercom systems
- **Radio and communication**: Radio frequency (RF) amplifiers, amplitude modulation (AM) detection, FM receivers, antenna circuits, signal mixing
- **Sensors and measurement**: Temperature sensors (thermistors, LM35), light sensors (photodiodes, LDRs), proximity sensors, pressure sensors, strain gauges, data acquisition
- **Control systems**: Motor speed control (PWM), servo control, stepper motor drivers, relay control circuits, solenoid drivers, home automation switches
- **Digital circuits**: Logic gates in microprocessors, flip-flops and memory, counters and timers (555 timer), shift registers, multiplexers
- **Displays**: LED matrices and seven-segment displays, LCD driver circuits, OLED displays, brightness control
- **Robotics**: Sensor interfaces (ultrasonic, infrared), motor drivers (H-bridge for direction control), microcontroller interfaces, battery management
- **Automotive electronics**: Headlight control circuits, turn signal flashers, ignition systems, sensor networks (speed, temperature, pressure), battery management in electric vehicles
- **Safety circuits**: Smoke detectors, burglar alarms, emergency lighting circuits, fault detection, circuit breakers
- **Communication interfaces**: RS-232 level shifters, I²C and SPI interfaces, USB interfaces, Bluetooth modules, WiFi modules

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 16): Simple diode rectifier (half-wave), basic transistor switch turning LED on/off, understand logic gate truth tables (AND, OR, NOT), simple sensor circuits (LDR + transistor for automatic light), basic relay driver, recognize circuit symbols
- **For middle ages** ({{age}} 16): Design full-wave bridge rectifier with smoothing capacitor, calculate transistor amplifier gain, analyze voltage divider sensor circuits, design motor control with transistor and flyback diode, implement simple logic circuits (2-3 gates), calculate component values for specific applications
- **For older ages** ({{age}} >= 17): Complex amplifier circuits with biasing calculations, multi-stage amplifiers, advanced logic circuits with multiple gates and Boolean algebra, oscillator circuits, op-amp applications, PWM motor speed control, H-bridge motor direction control, analog-to-digital concepts, frequency response analysis

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for basic laws: Ohm's law $V = I \cdot R$, power $P = V \cdot I$, amplification $A = \Delta V_{out}/\Delta V_{in}$
- Block for circuit equations:

$$V_{avg} = \frac{V_{peak}}{\pi} \quad \text{(half-wave rectifier)}$$

$$V_{avg} = \frac{2 \cdot V_{peak}}{\pi} \quad \text{(full-wave rectifier)}$$

$$\beta = \frac{I_C}{I_B} \quad \text{(transistor current gain)}$$

$$I_B = \frac{I_C}{\beta} \quad \text{(base current for saturation)}$$

$$R_{base} = \frac{V_{in} - V_{BE}}{I_B}$$

$$A_v = \frac{\Delta V_{out}}{\Delta V_{in}} \quad \text{(voltage gain)}$$

$$R_{LED} = \frac{V_{supply} - V_{LED}}{I_{LED}}$$

**Tables for logic gates:**

**AND Gate:**
| Input A | Input B | Output |
|---------|---------|--------|
| 0       | 0       | 0      |
| 0       | 1       | 0      |
| 1       | 0       | 0      |
| 1       | 1       | 1      |

**OR Gate:**
| Input A | Input B | Output |
|---------|---------|--------|
| 0       | 0       | 0      |
| 0       | 1       | 1      |
| 1       | 0       | 1      |
| 1       | 1       | 1      |

**NOT Gate:**
| Input | Output |
|-------|--------|
| 0     | 1      |
| 1     | 0      |

**XOR Gate:**
| Input A | Input B | Output |
|---------|---------|--------|
| 0       | 0       | 0      |
| 0       | 1       | 1      |
| 1       | 0       | 1      |
| 1       | 1       | 0      |

**Rectifier comparison:**

| Type       | Diodes | Output Voltage | Efficiency | Ripple | Application         |
|------------|--------|----------------|------------|--------|---------------------|
| Half-wave  | 1      | Vpeak/π        | Low (~40%) | High   | Simple, low-power   |
| Full-wave  | 4      | 2·Vpeak/π      | High (~80%)| Lower  | Most power supplies |

**Common transistor parameters:**

| Parameter | Symbol | Typical Range | Description                  |
|-----------|--------|---------------|------------------------------|
| Current gain | β   | 50 - 300      | IC/IB ratio                  |
| VBE (on)  | VBE    | 0.6 - 0.7 V   | Base-emitter voltage (silicon)|
| VCE (sat) | VCE    | 0.1 - 0.2 V   | Collector-emitter saturation |
| IC (max)  | -      | 100 mA - 10 A | Maximum collector current    |

**SVG diagrams for electronic circuits:**

Use SVG to show:
- Half-wave rectifier circuit (AC input, diode, load resistor, output waveform)
- Full-wave bridge rectifier (AC input, 4 diodes in diamond, load, output waveform)
- Rectifier with smoothing capacitor (charging/discharging waveform)
- Transistor switch circuit (input, base resistor, transistor, load, power supply)
- Common-emitter amplifier (biasing resistors, coupling capacitors, input/output)
- Logic gate circuits (diode logic, transistor logic)
- Sensor interface circuit (voltage divider, transistor comparator)
- Motor driver circuit (transistor, flyback diode, motor)
- Relay driver circuit (transistor, relay coil, contacts, load)
- H-bridge for motor direction control

Example SVG for half-wave rectifier:
```svg
<svg viewBox="0 0 500 350" xmlns="http://www.w3.org/2000/svg">
  <!-- Title -->
  <text x="150" y="25" font-size="16" font-weight="bold">Half-Wave Rectifier</text>

  <!-- AC source -->
  <circle cx="60" cy="150" r="30" fill="none" stroke="black" stroke-width="2"/>
  <text x="45" y="110" font-size="14">AC</text>
  <path d="M 50 145 Q 55 135 60 145 Q 65 155 70 145" stroke="black" stroke-width="2" fill="none"/>

  <!-- Connection wire -->
  <line x1="90" y1="150" x2="140" y2="150" stroke="black" stroke-width="2"/>

  <!-- Diode -->
  <polygon points="140,140 140,160 160,150" fill="#ef4444" stroke="black" stroke-width="2"/>
  <line x1="160" y1="140" x2="160" y2="160" stroke="black" stroke-width="3"/>
  <text x="135" y="130" font-size="12">D</text>

  <!-- Wire to load -->
  <line x1="160" y1="150" x2="220" y2="150" stroke="black" stroke-width="2"/>

  <!-- Load resistor -->
  <rect x="220" y="130" width="30" height="50" fill="none" stroke="black" stroke-width="2"/>
  <line x1="235" y1="125" x2="235" y2="115" stroke="black" stroke-width="2"/>
  <line x1="235" y1="180" x2="235" y2="220" stroke="black" stroke-width="2"/>
  <text x="255" y="160" font-size="12">RL</text>

  <!-- Return wire -->
  <line x1="235" y1="220" x2="60" y2="220" stroke="black" stroke-width="2"/>
  <line x1="60" y1="220" x2="60" y2="180" stroke="black" stroke-width="2"/>

  <!-- Input waveform -->
  <text x="20" y="280" font-size="12" font-weight="bold">Input:</text>
  <path d="M 70 290 Q 80 270 90 290 Q 100 310 110 290 Q 120 270 130 290 Q 140 310 150 290"
        stroke="#3b82f6" stroke-width="2" fill="none"/>

  <!-- Output waveform (half-wave) -->
  <text x="200" y="280" font-size="12" font-weight="bold">Output:</text>
  <path d="M 260 290 Q 270 270 280 290 L 310 290 Q 320 270 330 290 L 360 290"
        stroke="#ef4444" stroke-width="2" fill="none"/>
  <line x1="260" y1="290" x2="360" y2="290" stroke="gray" stroke-width="1" stroke-dasharray="2,2"/>

  <!-- Arrow annotations -->
  <text x="70" y="320" font-size="10">Full AC wave</text>
  <text x="250" y="320" font-size="10">Positive half only</text>
</svg>
```

Example SVG for full-wave bridge rectifier:
```svg
<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Title -->
  <text x="140" y="25" font-size="16" font-weight="bold">Full-Wave Bridge Rectifier</text>

  <!-- AC source -->
  <circle cx="60" cy="200" r="30" fill="none" stroke="black" stroke-width="2"/>
  <path d="M 50 195 Q 55 185 60 195 Q 65 205 70 195" stroke="black" stroke-width="2" fill="none"/>
  <text x="45" y="160" font-size="14">AC</text>

  <!-- Top connection -->
  <line x1="60" y1="170" x2="60" y2="120" stroke="black" stroke-width="2"/>
  <line x1="60" y1="120" x2="150" y2="120" stroke="black" stroke-width="2"/>

  <!-- Bottom connection -->
  <line x1="60" y1="230" x2="60" y2="280" stroke="black" stroke-width="2"/>
  <line x1="60" y1="280" x2="150" y2="280" stroke="black" stroke-width="2"/>

  <!-- Diode bridge (diamond configuration) -->
  <!-- D1 (top) -->
  <polygon points="150,110 150,130 170,120" fill="#ef4444" stroke="black" stroke-width="2"/>
  <line x1="170" y1="110" x2="170" y2="130" stroke="black" stroke-width="2"/>
  <text x="155" y="105" font-size="10">D1</text>

  <!-- D2 (right) -->
  <polygon points="240,120 220,120 230,140" fill="#ef4444" stroke="black" stroke-width="2"/>
  <line x1="220" y1="140" x2="240" y2="140" stroke="black" stroke-width="2"/>
  <text x="245" y="135" font-size="10">D2</text>

  <!-- D3 (bottom) -->
  <polygon points="170,260 170,240 150,250" fill="#ef4444" stroke="black" stroke-width="2"/>
  <line x1="150" y1="240" x2="150" y2="260" stroke="black" stroke-width="2"/>
  <text x="155" y="275" font-size="10">D3</text>

  <!-- D4 (left) -->
  <polygon points="170,200 190,200 180,180" fill="#ef4444" stroke="black" stroke-width="2"/>
  <line x1="170" y1="180" x2="190" y2="180" stroke="black" stroke-width="2"/>
  <text x="145" y="195" font-size="10">D4</text>

  <!-- Bridge internal connections -->
  <line x1="170" y1="120" x2="230" y2="120" stroke="black" stroke-width="2"/>
  <line x1="230" y1="140" x2="230" y2="190" stroke="black" stroke-width="2"/>
  <line x1="150" y1="250" x2="180" y2="250" stroke="black" stroke-width="2"/>
  <line x1="150" y1="120" x2="150" y2="250" stroke="black" stroke-width="2"/>
  <line x1="190" y1="190" x2="230" y2="190" stroke="black" stroke-width="2"/>
  <line x1="170" y1="190" x2="180" y2="190" stroke="black" stroke-width="2"/>
  <line x1="180" y1="180" x2="180" y2="250" stroke="black" stroke-width="2"/>

  <!-- Load resistor (positive side) -->
  <line x1="230" y1="190" x2="280" y2="190" stroke="black" stroke-width="2"/>
  <rect x="280" y="175" width="30" height="50" fill="none" stroke="black" stroke-width="2"/>
  <text x="315" y="205" font-size="12">RL</text>
  <text x="285" y="170" font-size="14" fill="red">+</text>

  <!-- Load resistor (negative side) -->
  <line x1="280" y1="225" x2="280" y2="250" stroke="black" stroke-width="2"/>
  <line x1="180" y1="250" x2="280" y2="250" stroke="black" stroke-width="2"/>
  <text x="285" y="265" font-size="14" fill="blue">-</text>

  <!-- Input waveform -->
  <text x="20" y="330" font-size="12" font-weight="bold">Input:</text>
  <path d="M 70 340 Q 80 320 90 340 Q 100 360 110 340 Q 120 320 130 340 Q 140 360 150 340"
        stroke="#3b82f6" stroke-width="2" fill="none"/>

  <!-- Output waveform (full-wave) -->
  <text x="200" y="330" font-size="12" font-weight="bold">Output:</text>
  <path d="M 260 340 Q 270 320 280 340 Q 290 320 300 340 Q 310 320 320 340 Q 330 320 340 340"
        stroke="#ef4444" stroke-width="2" fill="none"/>
  <line x1="260" y1="340" x2="340" y2="340" stroke="gray" stroke-width="1" stroke-dasharray="2,2"/>

  <!-- Arrow annotations -->
  <text x="70" y="370" font-size="10">AC input</text>
  <text x="245" y="370" font-size="10">Pulsating DC (both halves)</text>
</svg>
```

Example SVG for transistor amplifier:
```svg
<svg viewBox="0 0 450 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Title -->
  <text x="120" y="25" font-size="16" font-weight="bold">Common-Emitter Amplifier</text>

  <!-- Power supply -->
  <line x1="200" y1="50" x2="200" y2="80" stroke="black" stroke-width="2"/>
  <text x="205" y="65" font-size="12">+VCC (9V)</text>

  <!-- Collector resistor RC -->
  <rect x="190" y="80" width="20" height="40" fill="none" stroke="black" stroke-width="2"/>
  <text x="215" y="105" font-size="10">RC</text>
  <line x1="200" y1="120" x2="200" y2="160" stroke="black" stroke-width="2"/>

  <!-- Output coupling capacitor -->
  <line x1="200" y1="160" x2="250" y2="160" stroke="black" stroke-width="2"/>
  <line x1="250" y1="150" x2="250" y2="170" stroke="black" stroke-width="2"/>
  <line x1="255" y1="150" x2="255" y2="170" stroke="black" stroke-width="2"/>
  <text x="248" y="145" font-size="10">C2</text>

  <!-- Output -->
  <line x1="255" y1="160" x2="300" y2="160" stroke="black" stroke-width="2"/>
  <circle cx="300" cy="160" r="5" fill="red"/>
  <text x="305" y="165" font-size="12">Vout</text>

  <!-- Transistor (NPN) -->
  <line x1="200" y1="200" x2="200" y2="260" stroke="black" stroke-width="3"/>
  <!-- Base connection -->
  <line x1="120" y1="230" x2="200" y2="230" stroke="black" stroke-width="2"/>
  <!-- Collector -->
  <line x1="200" y1="200" x2="200" y2="160" stroke="black" stroke-width="2"/>
  <text x="210" y="175" font-size="10">C</text>
  <!-- Emitter -->
  <line x1="200" y1="260" x2="200" y2="290" stroke="black" stroke-width="2"/>
  <polygon points="200,260 195,250 205,250" fill="black"/>
  <text x="210" y="280" font-size="10">E</text>

  <!-- Base resistor RB -->
  <rect x="90" y="220" width="30" height="20" fill="none" stroke="black" stroke-width="2"/>
  <text x="85" y="255" font-size="10">RB</text>
  <text x="210" y="235" font-size="10">B</text>

  <!-- Input coupling capacitor -->
  <line x1="50" y1="230" x2="70" y2="230" stroke="black" stroke-width="2"/>
  <line x1="70" y1="220" x2="70" y2="240" stroke="black" stroke-width="2"/>
  <line x1="75" y1="220" x2="75" y2="240" stroke="black" stroke-width="2"/>
  <line x1="75" y1="230" x2="90" y2="230" stroke="black" stroke-width="2"/>
  <text x="68" y="215" font-size="10">C1</text>

  <!-- Input signal -->
  <circle cx="30" cy="230" r="5" fill="blue"/>
  <text x="5" y="225" font-size="12">Vin</text>
  <line x1="30" y1="230" x2="50" y2="230" stroke="black" stroke-width="2"/>

  <!-- Emitter resistor RE -->
  <rect x="190" y="290" width="20" height="40" fill="none" stroke="black" stroke-width="2"/>
  <text x="215" y="315" font-size="10">RE</text>

  <!-- Ground -->
  <line x1="200" y1="330" x2="200" y2="350" stroke="black" stroke-width="2"/>
  <line x1="180" y1="350" x2="220" y2="350" stroke="black" stroke-width="3"/>
  <line x1="185" y1="355" x2="215" y2="355" stroke="black" stroke-width="2"/>
  <line x1="190" y1="360" x2="210" y2="360" stroke="black" stroke-width="1"/>

  <!-- Annotations -->
  <text x="50" y="380" font-size="11">Small AC signal at base</text>
  <text x="250" y="380" font-size="11">Amplified inverted signal</text>

  <!-- Waveforms -->
  <path d="M 30 270 Q 35 265 40 270 Q 45 275 50 270" stroke="blue" stroke-width="1.5" fill="none"/>
  <path d="M 280 200 Q 285 210 290 200 Q 295 190 300 200 Q 305 210 310 200" stroke="red" stroke-width="1.5" fill="none"/>
</svg>
```

Example SVG for AND gate with diodes:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Title -->
  <text x="130" y="25" font-size="16" font-weight="bold">AND Gate (Diode Logic)</text>

  <!-- Power supply resistor -->
  <line x1="200" y1="50" x2="200" y2="80" stroke="black" stroke-width="2"/>
  <text x="205" y="65" font-size="12">+5V</text>
  <rect x="190" y="80" width="20" height="40" fill="none" stroke="black" stroke-width="2"/>
  <text x="215" y="105" font-size="10">R</text>
  <line x1="200" y1="120" x2="200" y2="150" stroke="black" stroke-width="2"/>

  <!-- Input A -->
  <text x="20" y="135" font-size="12">A</text>
  <line x1="50" y1="130" x2="100" y2="130" stroke="black" stroke-width="2"/>
  <!-- Diode D1 -->
  <polygon points="100,120 100,140 120,130" fill="#ef4444" stroke="black" stroke-width="2"/>
  <line x1="120" y1="120" x2="120" y2="140" stroke="black" stroke-width="2"/>
  <line x1="120" y1="130" x2="200" y2="130" stroke="black" stroke-width="2"/>

  <!-- Input B -->
  <text x="20" y="175" font-size="12">B</text>
  <line x1="50" y1="170" x2="100" y2="170" stroke="black" stroke-width="2"/>
  <!-- Diode D2 -->
  <polygon points="100,160 100,180 120,170" fill="#ef4444" stroke="black" stroke-width="2"/>
  <line x1="120" y1="160" x2="120" y2="180" stroke="black" stroke-width="2"/>
  <line x1="120" y1="170" x2="170" y2="170" stroke="black" stroke-width="2"/>
  <line x1="170" y1="170" x2="170" y2="150" stroke="black" stroke-width="2"/>
  <line x1="170" y1="150" x2="200" y2="150" stroke="black" stroke-width="2"/>

  <!-- Output junction -->
  <circle cx="200" cy="140" r="5" fill="black"/>

  <!-- Output -->
  <line x1="200" y1="140" x2="280" y2="140" stroke="black" stroke-width="2"/>
  <circle cx="280" cy="140" r="5" fill="red"/>
  <text x="290" y="145" font-size="12">Output</text>

  <!-- Truth table -->
  <text x="50" y="230" font-size="12" font-weight="bold">Truth Table:</text>
  <rect x="50" y="240" width="180" height="20" fill="#e5e7eb" stroke="black" stroke-width="1"/>
  <text x="70" y="255" font-size="11" font-weight="bold">A</text>
  <text x="120" y="255" font-size="11" font-weight="bold">B</text>
  <text x="165" y="255" font-size="11" font-weight="bold">Output</text>

  <rect x="50" y="260" width="180" height="15" fill="white" stroke="black" stroke-width="1"/>
  <text x="70" y="272" font-size="10">0</text>
  <text x="120" y="272" font-size="10">0</text>
  <text x="180" y="272" font-size="10">0</text>

  <rect x="50" y="275" width="180" height="15" fill="white" stroke="black" stroke-width="1"/>
  <text x="70" y="287" font-size="10">0</text>
  <text x="120" y="287" font-size="10">1</text>
  <text x="180" y="287" font-size="10">0</text>

  <rect x="50" y="290" width="180" height="15" fill="white" stroke="black" stroke-width="1"/>
  <text x="70" y="302" font-size="10">1</text>
  <text x="120" y="302" font-size="10">0</text>
  <text x="180" y="302" font-size="10">0</text>

  <rect x="50" y="305" width="180" height="15" fill="white" stroke="black" stroke-width="1"/>
  <text x="70" y="317" font-size="10">1</text>
  <text x="120" y="317" font-size="10">1</text>
  <text x="180" y="317" font-size="10">1</text>

  <!-- Note -->
  <text x="250" y="250" font-size="9">Output HIGH only</text>
  <text x="250" y="262" font-size="9">when both inputs</text>
  <text x="250" y="274" font-size="9">are HIGH</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Simple half-wave rectifier (qualitative), transistor switch turning LED on/off, understand logic gate truth tables (AND, OR, NOT), basic sensor circuit (LDR + resistor), identify circuit symbols, understand power supply function
- **Medium**: Calculate rectifier output voltages, design transistor switch with base resistor calculations, build simple logic circuits (2-3 gates), analyze voltage divider sensor circuits, calculate LED current-limiting resistors, motor driver with flyback diode, calculate transistor current gain
- **Hard**: Full-wave bridge rectifier with smoothing capacitor and ripple analysis, design multi-stage amplifier circuits with gain calculations, complex logic circuits with Boolean algebra simplification, oscillator circuits, op-amp applications, PWM motor control, frequency response of amplifiers, impedance matching

**Include variety in numerical values:**
- Supply voltages: 3 V, 5 V, 9 V, 12 V, 15 V (batteries and power supplies), 230 V AC (mains input)
- Peak AC voltages: 10 V, 15 V, 20 V, 311 V (from 230 V RMS)
- DC output voltages: 3.18 V, 6.37 V (after rectification), 5 V (regulated), 12 V (regulated)
- Resistors: 100 Ω, 220 Ω, 330 Ω, 470 Ω, 1 kΩ, 2.2 kΩ, 4.7 kΩ, 10 kΩ, 47 kΩ, 100 kΩ, 1 MΩ
- Capacitors: 100 μF, 470 μF, 1000 μF (electrolytic for smoothing), 0.1 μF, 1 μF, 10 μF (coupling)
- Transistor beta: 50, 100, 150, 200, 250, 300
- Currents: 1 mA, 5 mA, 10 mA, 20 mA, 50 mA, 100 mA, 500 mA, 1 A
- Voltage gains: 5, 10, 20, 50, 100, 200 (amplifiers)
- Frequencies: 50 Hz (Europe mains), 60 Hz (US mains), 1 kHz, 10 kHz (audio), 100 kHz, 1 MHz (RF)
- Power ratings: 0.1 W, 0.25 W, 0.5 W, 1 W, 2 W, 5 W (resistors), 1 W, 5 W, 10 W (loads)
- Logic levels: 0 V (LOW), 5 V (HIGH) for TTL, 0 V (LOW), 3.3 V (HIGH) for CMOS
- Ensure different numerical answers each time to prevent memorization
