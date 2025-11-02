---
id: waves
name: Waves
description: 'Explore sound, light, and wave phenomena in our world'
grade: 7
ages:
  - 12
  - 16
focus: 'Wave properties, sound, light, and wave behavior'
difficulty: medium
learning_objectives:
  - 'Understand wave properties (frequency, wavelength, amplitude)'
  - Explain how sound waves travel and create hearing
  - 'Describe light behavior (reflection, refraction, dispersion)'
  - Calculate wave speed using frequency and wavelength
  - Understand electromagnetic spectrum basics
  - Recognize wave patterns in everyday phenomena
prerequisites: []
example_tasks:
  - 'If a wave has frequency 50 Hz and wavelength 2m, what is its speed?'
  - Why do we see rainbows after rain? Explain light refraction
  - How does a musical instrument create different pitches?
real_world_context: 'Music and instruments, communication technology, optics, medical imaging'
---

# Wave Tasks

Create physics problems that explore wave properties, sound, light, and wave phenomena through real-world applications. Problems should help students understand wave behavior, calculate wave characteristics, and connect wave concepts to everyday experiences.

**Vary the problem structure:**
- **Wave speed calculations** using $v = f \lambda$: Given frequency and wavelength, calculate wave speed for sound waves, water waves, or light waves; vary which quantity is unknown
- **Frequency and wavelength relationships**: Explore inverse relationship between frequency and wavelength for waves traveling at constant speed; include musical notes, radio waves, or colors of light
- **Sound wave scenarios**: Calculate distance to lightning using speed of sound ($v = 343 \text{ m/s}$), analyze echo timing, determine sound intensity and loudness
- **Light behavior problems**: Explain reflection in mirrors, refraction through glass/water, dispersion creating rainbows; use ray diagrams and Snell's law for older students
- **Musical instrument analysis**: How string length/tension affects pitch, how wind instruments create different frequencies, relationship between frequency and musical notes
- **Electromagnetic spectrum exploration**: Compare different wave types (radio, microwave, visible, UV, X-ray), relate frequency to energy, identify applications
- **Wave interference patterns**: Describe constructive/destructive interference in sound (noise cancellation), light (thin films), or water waves
- **Doppler effect scenarios**: Explain pitch changes when sound sources move (ambulance siren, race car), calculate apparent frequency changes

**Vary the content/context:**
- **Music and instruments**: Guitar strings vibrating, drum frequencies, organ pipes, tuning forks, concert hall acoustics
- **Communication technology**: Radio waves, WiFi signals, cell phone frequencies, satellite communication, fiber optic light transmission
- **Nature phenomena**: Ocean waves, earthquakes (seismic waves), thunder and lightning, rainbows, mirages
- **Medical applications**: Ultrasound imaging, X-rays, hearing tests, sound therapy
- **Everyday observations**: Echoes in tunnels, seeing yourself in mirrors, light bending in water, colors from prisms or CDs
- **Technology**: Microwave ovens, TV broadcasts, radar, sonar, laser light shows

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 14): Use basic $v = f \lambda$ calculations with whole numbers, conceptual explanations of reflection/refraction, simple wave drawings, focus on observable phenomena
- **For middle ages** ({{age}} 14-15): Include unit conversions (Hz to kHz, m to cm), multi-step calculations, ray diagrams, electromagnetic spectrum organization
- **For older ages** ({{age}} >= 16): Apply Snell's law $n_1 \sin(\theta_1) = n_2 \sin(\theta_2)$, calculate energy $E = hf$, analyze interference patterns, wave equation derivations

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for equations: $v = f \lambda$, $f = \frac{1}{T}$, $E = hf$
- Block for emphasis or derivations:

$$v = f \lambda$$

$$\text{where } v = \text{speed (m/s)}, f = \text{frequency (Hz)}, \lambda = \text{wavelength (m)}$$

**Tables for comparing wave types:**

| Wave Type | Frequency Range | Wavelength | Application |
|-----------|----------------|------------|-------------|
| Radio     | 3 kHz - 300 GHz | 1 mm - 100 km | Broadcasting |
| Visible   | 400-790 THz    | 380-700 nm | Vision |
| X-ray     | 30 PHz - 30 EHz | 0.01-10 nm | Medical imaging |

**Tables for sound/music data:**

| Note | Frequency (Hz) | Wavelength (m) | Speed (m/s) |
|------|---------------|----------------|-------------|
| A4   | 440           | ?              | 343         |
| C5   | 523           | ?              | 343         |

**SVG diagrams for wave visualization:**

Use SVG to show:
- Transverse waves with wavelength and amplitude labeled
- Longitudinal sound waves showing compressions and rarefactions
- Light ray diagrams showing reflection and refraction
- Wave interference patterns
- Electromagnetic spectrum with wave types

Example SVG for a wave diagram:
```svg
<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Wave path -->
  <path d="M 0,100 Q 50,50 100,100 T 200,100 T 300,100 T 400,100"
        stroke="#3b82f6" stroke-width="2" fill="none"/>
  <!-- Wavelength arrow -->
  <line x1="0" y1="150" x2="200" y2="150" stroke="red" stroke-width="2"
        marker-end="url(#arrowhead)"/>
  <text x="80" y="170" fill="red">λ = wavelength</text>
  <!-- Amplitude arrow -->
  <line x1="350" y1="100" x2="350" y2="50" stroke="green" stroke-width="2"
        marker-end="url(#arrowhead)"/>
  <text x="355" y="75" fill="green">A</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Direct calculation with $v = f \lambda$, identify wave types, describe basic wave properties, simple observations
- **Medium**: Choose correct formula, perform unit conversions, explain phenomena using wave concepts, interpret diagrams
- **Hard**: Multi-step calculations, apply multiple wave concepts, derive relationships, analyze complex scenarios, use advanced formulas

**Include variety in numerical values:**
- Vary frequencies: 20 Hz (low sound), 440 Hz (musical A), 5 GHz (WiFi), 500 THz (green light)
- Change wavelengths: 1 mm, 50 cm, 2 m, 100 m
- Different wave speeds: 343 m/s (sound in air), 1500 m/s (sound in water), 3×10⁸ m/s (light)
- Various time intervals: 0.002 s, 2.5 s, 10 minutes
- Ensure different answers each time by varying input values

