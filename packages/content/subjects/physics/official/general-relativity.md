---
id: general-relativity
name: General Relativity
description: 'Gravitation as spacetime curvature and cosmological applications'
grade: 12
ages:
  - 17
  - 18
focus: 'Equivalence principle, spacetime curvature, gravitational redshift, gravitational lensing, black holes (basic concepts), cosmology, expansion of universe, Big Bang (qualitative)'
difficulty: hard
learning_objectives:
  - Understand equivalence principle
  - Recognize gravity as spacetime curvature (qualitative)
  - Apply to cosmological phenomena
  - Understand gravitational time dilation
prerequisites: []
example_tasks:
  - Explain how the equivalence principle relates gravity to acceleration
  - Describe how massive objects curve spacetime and affect light paths
  - Calculate gravitational time dilation near a massive object compared to far away
real_world_context: 'GPS satellite corrections, gravitational lensing observations, black hole imaging (Event Horizon Telescope), gravitational waves (LIGO), cosmology and universe expansion'
---

# General Relativity Tasks

Create physics problems that explore gravity as spacetime curvature and its cosmological consequences. Problems should help students understand the equivalence principle, how mass curves spacetime, gravitational effects on time and light, and applications to extreme objects like black holes and the expanding universe.

**Vary the problem structure:**
- **Equivalence principle scenarios**: Analyze situations where gravity and acceleration are indistinguishable (elevator experiments, rocket acceleration vs planetary surface), explain why they produce identical effects
- **Gravitational time dilation** using $\frac{\Delta t_{\infty}}{\Delta t} = \sqrt{1 - \frac{2GM}{rc^2}} = \sqrt{1 - \frac{r_s}{r}}$: Calculate time differences between clocks at different gravitational potentials (Earth surface vs satellite, near black hole vs far away)
- **Gravitational redshift calculations**: Determine frequency/wavelength shift of light escaping gravitational field using $\frac{\Delta f}{f} = \frac{GM}{rc^2}$ or $z = \frac{\Delta \lambda}{\lambda}$
- **Schwarzschild radius** using $r_s = \frac{2GM}{c^2}$: Calculate event horizon radius for black holes of various masses (stellar, supermassive), determine what radius a given mass would need to be compressed to form a black hole
- **Gravitational lensing**: Explain how light bends around massive objects, calculate deflection angles qualitatively, understand multiple images and Einstein rings
- **Orbital dynamics near massive objects**: Analyze Mercury's perihelion precession, understand differences from Newtonian predictions, explore orbital stability near black holes
- **Cosmological applications**: Understand expanding universe, Hubble's law $v = H_0 d$, Big Bang model, cosmic microwave background radiation
- **Spacetime curvature interpretation**: Use rubber sheet analogy to explain mass curving spacetime, relate geodesics to "straightest possible paths" in curved spacetime

**Vary the content/context:**
- **Equivalence principle**: Gravity indistinguishable from acceleration in small regions, free fall removes gravitational effects locally, predicts gravitational time dilation and light bending
- **Spacetime curvature**: Mass-energy curves spacetime geometry, objects follow geodesics (curved paths appear "straight" in curved space), geometry determines motion rather than force
- **Gravitational time dilation**: Clocks run slower in stronger gravitational fields, affects GPS satellites (+45 μs/day relative to ground), extreme near black holes
- **Gravitational redshift**: Light loses energy climbing out of gravitational well, wavelength increases (redshifted), frequency decreases, confirmed with Pound-Rebka experiment
- **Black holes**: Schwarzschild radius defines event horizon, nothing escapes from within, infinite time dilation at horizon, singularity at center, stellar vs supermassive types
- **Gravitational lensing**: Light follows curved spacetime near massive objects, galaxies and galaxy clusters act as lenses, Einstein rings when alignment is perfect, dark matter detection
- **Gravitational waves**: Ripples in spacetime from accelerating masses, detected by LIGO from merging black holes/neutron stars, travel at speed of light
- **Cosmology**: Universe expansion, Hubble's law, Big Bang ~13.8 billion years ago, cosmic microwave background, dark energy accelerating expansion

**Vary the complexity based on age:**
- **For age 17**: Qualitative understanding of equivalence principle, spacetime curvature concept using analogies, basic gravitational time dilation without complex calculations, Schwarzschild radius for simple masses
- **For age 18**: Quantitative gravitational time dilation and redshift calculations for moderate fields (Earth, Sun), Schwarzschild radius for various objects, understanding gravitational lensing qualitatively, GPS corrections
- **For age 19**: Complex calculations with strong fields near black holes, precise time dilation factors, gravitational wave concepts, cosmological parameters, relating observations to theory, understanding experimental tests of general relativity

**Use appropriate formats:**

**LaTeX for formulas:**
- Schwarzschild radius (event horizon): $r_s = \frac{2GM}{c^2}$
- Gravitational time dilation: $\frac{\Delta t_{\infty}}{\Delta t} = \sqrt{1 - \frac{2GM}{rc^2}} = \sqrt{1 - \frac{r_s}{r}}$
- Gravitational redshift (weak field): $\frac{\Delta f}{f} = -\frac{GM}{rc^2}$ or $z = \frac{\Delta \lambda}{\lambda} = \frac{GM}{rc^2}$
- Light deflection angle: $\alpha = \frac{4GM}{c^2 b}$ (where $b$ is impact parameter)
- Hubble's law: $v = H_0 d$ where $H_0 \approx 70$ km/s/Mpc
- Einstein field equations (qualitative): $G_{\mu\nu} = \frac{8\pi G}{c^4}T_{\mu\nu}$ (geometry = mass-energy)

**Tables for black hole properties:**

| Object | Mass (kg) | Mass (M☉) | Schwarzschild radius |
|--------|-----------|-----------|---------------------|
| Earth | $6.0 \times 10^{24}$ | $3 \times 10^{-6}$ | 9 mm |
| Sun | $2.0 \times 10^{30}$ | 1 | 3.0 km |
| Stellar BH | $6.0 \times 10^{30}$ | 3 | 8.9 km |
| Sgr A* (Milky Way) | $8.2 \times 10^{36}$ | $4.1 \times 10^6$ | 12 million km |

**GPS time corrections:**

| Effect | Time change | Direction |
|--------|-------------|-----------|
| Special relativity (velocity) | -7 μs/day | Slower |
| General relativity (altitude) | +45 μs/day | Faster |
| Net effect | +38 μs/day | Faster in orbit |

**SVG diagrams for spacetime curvature:**

Use SVG to visualize:
- Rubber sheet analogy with mass creating depression
- Light path bending near massive object
- Spacetime grid distorted by mass
- Gravitational lensing showing multiple light paths
- Event horizon of black hole with light cones tipping
- Expanding universe with galaxies moving apart

Example SVG for gravitational lensing:
```svg
<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="500" height="300" fill="#0a0a1a"/>

  <!-- Distant galaxy (source) -->
  <circle cx="450" cy="150" r="8" fill="#fbbf24"/>
  <text x="455" y="140" fill="white" font-size="12">Distant</text>
  <text x="455" y="155" fill="white" font-size="12">Galaxy</text>

  <!-- Massive galaxy cluster (lens) -->
  <circle cx="250" cy="150" r="30" fill="#8b5cf6" opacity="0.6"/>
  <circle cx="250" cy="150" r="15" fill="#8b5cf6"/>
  <text x="220" y="200" fill="white" font-size="12">Massive Cluster</text>

  <!-- Observer on Earth -->
  <circle cx="50" cy="150" r="12" fill="#3b82f6"/>
  <text x="25" y="180" fill="white" font-size="12">Observer</text>

  <!-- Light paths (curved by gravity) -->
  <!-- Upper path -->
  <path d="M 450 150 Q 350 100, 250 120 Q 150 130, 50 150"
        fill="none" stroke="#fbbf24" stroke-width="2" opacity="0.7"/>
  <!-- Lower path -->
  <path d="M 450 150 Q 350 200, 250 180 Q 150 170, 50 150"
        fill="none" stroke="#fbbf24" stroke-width="2" opacity="0.7"/>
  <!-- Straight path (what we'd expect without gravity) -->
  <line x1="450" y1="150" x2="250" y2="150" stroke="#666" stroke-width="1" stroke-dasharray="5,5"/>
  <line x1="250" y1="150" x2="50" y2="150" stroke="#666" stroke-width="1" stroke-dasharray="5,5"/>

  <!-- Multiple images visible to observer -->
  <circle cx="50" cy="130" r="3" fill="#fbbf24"/>
  <circle cx="50" cy="170" r="3" fill="#fbbf24"/>

  <!-- Title -->
  <text x="150" y="30" fill="white" font-size="18" font-weight="bold">Gravitational Lensing</text>
  <text x="120" y="280" fill="white" font-size="12">Light bends around massive object, creating multiple images</text>
</svg>
```

Example SVG for spacetime curvature:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Title -->
  <text x="100" y="30" font-size="18" font-weight="bold">Mass Curves Spacetime</text>

  <!-- Flat spacetime grid (background) -->
  <g opacity="0.3">
    <line x1="50" y1="80" x2="350" y2="80" stroke="#666" stroke-width="1"/>
    <line x1="50" y1="100" x2="350" y2="100" stroke="#666" stroke-width="1"/>
  </g>

  <!-- Curved spacetime grid around mass -->
  <!-- Center lines curve downward -->
  <path d="M 50 120 Q 200 180, 350 120" fill="none" stroke="#3b82f6" stroke-width="2"/>
  <path d="M 50 140 Q 200 220, 350 140" fill="none" stroke="#3b82f6" stroke-width="2"/>
  <path d="M 50 160 Q 200 240, 350 160" fill="none" stroke="#3b82f6" stroke-width="2"/>

  <!-- Outer lines curve less -->
  <path d="M 50 180 Q 200 215, 350 180" fill="none" stroke="#3b82f6" stroke-width="1"/>

  <!-- Central mass -->
  <circle cx="200" cy="250" r="25" fill="#ef4444"/>
  <text x="185" y="258" fill="white" font-size="16" font-weight="bold">M</text>

  <!-- Annotation -->
  <text x="80" y="280" font-size="12">Spacetime grid curved by massive object</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Qualitative explanations of equivalence principle and spacetime curvature, simple Schwarzschild radius calculations for given masses, conceptual understanding of time dilation and gravitational lensing
- **Medium**: Quantitative time dilation and redshift calculations in moderate gravitational fields, comparing clock rates at different altitudes, GPS corrections, Schwarzschild radius for various objects, understanding observational evidence
- **Hard**: Strong-field calculations near black holes, precise time dilation factors approaching event horizon, gravitational wave concepts, cosmological calculations with Hubble's law, analyzing multiple effects simultaneously

**Include variety in contexts and numerical values:**
- **Time dilation contexts**: GPS satellites vs ground, mountain top vs sea level, neutron star surface vs infinity, near black hole event horizon
- **Black hole masses**: 3 M☉ (stellar), 10 M☉, 10⁶ M☉ (intermediate), 10⁹ M☉ (supermassive), primordial black holes
- **Schwarzschild radii**: Earth (9 mm), Sun (3 km), stellar BH (9-30 km), galactic center BH (millions of km)
- **Distances for time dilation**: Earth radius $6.4 \times 10^6$ m, GPS altitude $2.0 \times 10^7$ m, various radii from $r_s$ to $10r_s$ for black holes
- **Gravitational lensing scenarios**: Galaxy clusters, individual galaxies, stars (microlensing), Einstein rings and arcs
- **Cosmological scales**: Distances in Mpc, velocities from Hubble's law (100-10000 km/s), lookback times in billions of years
- **Observational evidence**: 1919 solar eclipse (light bending), Mercury's perihelion precession (43"/century), Pound-Rebka experiment (gravitational redshift), LIGO detections (gravitational waves)
- **Extreme environments**: Neutron stars (1.4 M☉, 10 km radius), black hole mergers, galactic centers, early universe conditions
- Ensure different objects, scenarios, and numerical values for variety
