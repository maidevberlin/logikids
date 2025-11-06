---
id: sound-acoustics
name: Sound and Acoustics
description: 'Sound generation, propagation, and properties including pitch, loudness, and timbre'
grade: 7
ages:
  - 12
  - 13
  - 14
focus: 'Sound generation, sound waves, sound propagation, speed of sound, pitch (frequency), loudness (amplitude), timbre, echo, sound absorption and reflection, hearing, noise protection'
difficulty: easy
learning_objectives:
  - Explain sound as mechanical wave
  - Understand sound propagation in different media
  - Distinguish pitch, loudness, and timbre
  - Apply concepts to hearing and acoustics
prerequisites: []
example_tasks:
  - Calculate how long it takes for sound to travel 1 km in air (speed of sound: 340 m/s).
  - Explain why you see lightning before you hear thunder.
  - A sound wave has frequency 440 Hz. What musical note is this (A4)?
real_world_context: 'Musical instruments, concert halls, noise protection, hearing and ear structure, sonar, ultrasound imaging, sound insulation, loudspeakers, room acoustics'
---

# Sound and Acoustics Tasks

Create physics problems that explore sound generation, propagation, and properties. Problems should help students understand sound as a mechanical wave, analyze sound propagation in different media, distinguish between pitch (frequency), loudness (amplitude), and timbre, and apply acoustic concepts to everyday situations.

**Vary the problem structure:**
- **Sound propagation and speed**: Calculate time for sound to travel given distances using $v_{sound} = \frac{s}{t}$; typical speed in air: 340 m/s, in water: 1500 m/s, in steel: 5000 m/s
- **Echo calculations**: Determine distance to reflecting surface from echo time; sound travels to surface and back, so $d = \frac{v \cdot t}{2}$
- **Frequency and pitch**: Relate frequency (Hz) to pitch; higher frequency = higher pitch. Human hearing range: 20 Hz - 20,000 Hz. Musical notes: A4 = 440 Hz, middle C = 262 Hz
- **Wavelength calculations** using $\lambda = \frac{v}{f}$: Calculate wavelength from frequency and speed, or frequency from wavelength
- **Amplitude and loudness**: Understand that larger amplitude = louder sound; sound intensity and decibel scale (qualitative for this age)
- **Timbre and overtones**: Explain why different instruments sound different even at same pitch (qualitative, waveform complexity)
- **Sound absorption and reflection**: Analyze acoustic properties of materials (hard surfaces reflect, soft materials absorb)
- **Hearing and ear structure**: Relate sound waves to ear anatomy (eardrum vibrations, ossicles, cochlea)
- **Ultrasound and infrasound**: Sounds outside human hearing range; applications in medicine (ultrasound), animal communication (bats, whales)

**Vary the content/context:**
- **Musical acoustics**: Instruments (strings, wind, percussion), tuning, musical scales, concert pitch A440 Hz, harmonics
- **Environmental sound**: Thunder and lightning distance calculation, sound in nature, animal communication
- **Architectural acoustics**: Concert halls, theaters, echo problems, sound insulation, room design
- **Technology**: Loudspeakers, microphones, sound recording, sonar (ships, submarines), ultrasound imaging
- **Safety and health**: Noise pollution, hearing protection, safe sound levels, ear damage from loud sounds
- **Everyday phenomena**: Echoes in mountains/tunnels, sound in water (swimming), sound through walls, telephones

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 13): Qualitative understanding of sound as vibration, simple speed-distance-time calculations with whole numbers, basic frequency concepts (high/low pitch), echo with simple numbers, sound vs. light speed comparison
- **For middle ages** ({{age}} 13-14): Quantitative speed calculations in different media, wavelength-frequency relationships, echo distance calculations with decimals, human hearing range, musical frequency analysis
- **For older ages** ({{age}} >= 14): Complex wavelength calculations, multiple echo reflections, sound intensity comparisons, detailed wave analysis, combined problems with different media, sound refraction and diffraction (qualitative)

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline: Speed of sound $v = \frac{s}{t}$, wavelength $\lambda = \frac{v}{f}$, frequency $f = \frac{1}{T}$
- Block for fundamental wave equations:

$$v = \lambda \cdot f$$

$$\lambda = \frac{v}{f} \quad \text{where } v = 340 \text{ m/s (air)}, 1500 \text{ m/s (water)}$$

Echo distance:
$$d = \frac{v \cdot t_{echo}}{2}$$

**Tables for acoustic data:**

| Medium | Speed of Sound (m/s) | Temperature Dependence |
|--------|---------------------|------------------------|
| Air (20°C) | 340 | Increases with temperature |
| Water | 1500 | Slightly increases with temperature |
| Steel | 5000 | Minimal temperature dependence |
| Aluminum | 6400 | Minimal temperature dependence |

| Sound Type | Frequency Range | Example |
|------------|-----------------|---------|
| Infrasound | < 20 Hz | Earthquakes, elephant calls |
| Human hearing | 20 Hz - 20 kHz | Speech, music |
| Ultrasound | > 20 kHz | Bat echolocation, medical imaging |

| Musical Note | Frequency (Hz) |
|--------------|----------------|
| Middle C (C4) | 262 |
| A4 (Concert pitch) | 440 |
| A5 | 880 |

**SVG diagrams for sound visualization:**

Use SVG to show:
- Sound waves as longitudinal waves (compressions and rarefactions)
- Wave properties: amplitude (loudness), frequency (pitch), wavelength
- Sound propagation from source in all directions
- Echo reflection from surfaces
- Comparison of waveforms for different sounds (pitch and timbre)
- Ear anatomy showing sound wave path to eardrum

Example SVG for sound wave propagation:
```svg
<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="black" />
    </marker>
  </defs>

  <!-- Sound source (bell) -->
  <circle cx="100" cy="150" r="20" fill="#fbbf24" stroke="black" stroke-width="2"/>
  <text x="85" y="155" font-size="14" font-weight="bold">🔔</text>

  <!-- Sound waves (concentric circles) -->
  <circle cx="100" cy="150" r="40" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.8"/>
  <circle cx="100" cy="150" r="70" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.6"/>
  <circle cx="100" cy="150" r="100" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.4"/>
  <circle cx="100" cy="150" r="130" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.2"/>

  <!-- Direction arrows -->
  <line x1="100" y1="150" x2="200" y2="150" stroke="red" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="205" y="155" font-size="12">v = 340 m/s</text>

  <!-- Observer (ear) -->
  <circle cx="350" cy="150" r="25" fill="#fef3c7" stroke="black" stroke-width="2"/>
  <text x="340" y="160" font-size="20">👂</text>

  <!-- Label -->
  <text x="150" y="280" font-size="16" font-weight="bold">Sound propagates as spherical waves</text>
</svg>
```

Example SVG for wave properties:
```svg
<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <!-- High pitch (high frequency) -->
  <text x="10" y="80" font-size="14" font-weight="bold">High Pitch (f = 880 Hz)</text>
  <path d="M 50 100 Q 65 70, 80 100 T 110 100 T 140 100 T 170 100 T 200 100 T 230 100 T 260 100 T 290 100 T 320 100"
        fill="none" stroke="#3b82f6" stroke-width="3"/>

  <!-- Low pitch (low frequency) -->
  <text x="10" y="180" font-size="14" font-weight="bold">Low Pitch (f = 220 Hz)</text>
  <path d="M 50 200 Q 80 170, 110 200 T 170 200 T 230 200 T 290 200"
        fill="none" stroke="#10b981" stroke-width="3"/>

  <!-- Loud sound (large amplitude) -->
  <text x="10" y="280" font-size="14" font-weight="bold">Loud Sound (large amplitude)</text>
  <path d="M 50 300 Q 65 250, 80 300 T 110 300 T 140 300 T 170 300 T 200 300 T 230 300 T 260 300 T 290 300 T 320 300"
        fill="none" stroke="#ef4444" stroke-width="3"/>

  <!-- Quiet sound (small amplitude) -->
  <text x="10" y="360" font-size="14" font-weight="bold">Quiet Sound (small amplitude)</text>
  <path d="M 50 380 Q 65 370, 80 380 T 110 380 T 140 380 T 170 380 T 200 380 T 230 380 T 260 380 T 290 380 T 320 380"
        fill="none" stroke="#f59e0b" stroke-width="3"/>

  <!-- Labels -->
  <text x="350" y="100" font-size="13">Short wavelength</text>
  <text x="350" y="200" font-size="13">Long wavelength</text>
  <text x="350" y="300" font-size="13">Large oscillation</text>
  <text x="350" y="380" font-size="13">Small oscillation</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Simple speed calculations with whole numbers ($s = v \cdot t$), qualitative sound properties (loud/quiet, high/low), basic echo problems with straightforward numbers, sound vs. light comparison
- **Medium**: Speed in different media, wavelength-frequency calculations, echo distance with decimal values, musical frequency analysis, hearing range applications, unit conversions (m/s to km/h)
- **Hard**: Multiple reflections and echoes, combined calculations with different media, sound refraction scenarios, complex real-world problems (sonar depth finding), frequency and wavelength in different media

**Include variety in numerical values:**
- Distances: 10 m, 50 m, 340 m, 1 km, 3.4 km, 10 km
- Times: 0.1 s, 0.5 s, 1 s, 3 s, 5 s, 10 s
- Frequencies: 100 Hz, 262 Hz (C4), 440 Hz (A4), 1000 Hz, 10 kHz, 20 kHz
- Speed of sound: 340 m/s (air, 20°C), 330 m/s (air, 0°C), 1500 m/s (water), 5000 m/s (steel)
- Wavelengths: 0.017 m (20 kHz in air), 0.77 m (440 Hz), 17 m (20 Hz)
- Temperature effects: Sound speed increases by ~0.6 m/s per °C in air
- Use realistic scenarios: thunder-lightning (3 s ≈ 1 km), concert hall dimensions (20-50 m), echo in tunnel
- Ensure varied calculations to reinforce understanding of wave properties and sound behavior
