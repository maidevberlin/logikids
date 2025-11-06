---
id: color-spectrum
name: Color and Spectrum
description: 'Color, dispersion, spectra, and color perception'
grade: 8
ages:
  - 13
  - 14
  - 15
focus: 'Dispersion, prism, spectrum, rainbow, color mixing, color perception, RGB and CMY, continuous and line spectra, spectroscopy, photon energy and color'
difficulty: easy
learning_objectives:
  - Explain white light dispersion
  - Understand color mixing (additive and subtractive)
  - Analyze emission and absorption spectra
  - Relate color to wavelength/frequency
prerequisites:
  - light-propagation
  - refraction
example_tasks:
  - Explain why a prism separates white light into a rainbow spectrum
  - What colors combine to make yellow light in RGB color mixing?
  - Describe the difference between a continuous spectrum and a line spectrum
real_world_context: 'Rainbows, prism experiments, color displays (TV, phones), color printing, spectroscopy in astronomy, identifying elements by spectra, LED colors'
---

# Color and Spectrum Tasks

Create physics problems that explore the nature of color, light dispersion, and spectroscopy. Problems should help students understand how white light is composed of different colors, how color mixing works, and how spectra reveal information about light sources and materials.

**Vary the problem structure:**
- **Dispersion and prisms**: Explain how prisms separate white light into spectrum due to wavelength-dependent refraction (violet bends most, red bends least)
- **Wavelength and color**: Relate visible spectrum wavelengths to colors (violet ~400 nm, red ~700 nm), understand frequency-wavelength relationship $c = \lambda f$
- **Rainbow formation**: Explain rainbow as dispersion in water droplets with internal reflection, describe primary and secondary rainbows, Alexander's dark band
- **Additive color mixing (RGB)**: Red + Green = Yellow, Red + Blue = Magenta, Green + Blue = Cyan, Red + Green + Blue = White
- **Subtractive color mixing (CMY)**: Cyan absorbs red, Magenta absorbs green, Yellow absorbs blue, explain color filters and pigments
- **Continuous spectra**: Identify continuous spectra from hot solid objects (incandescent bulbs, sun), explain blackbody radiation
- **Line emission spectra**: Analyze discrete spectral lines from gas discharge lamps (neon, sodium, mercury), relate to atomic energy levels
- **Line absorption spectra**: Explain dark lines in continuous spectrum when light passes through cool gas, Fraunhofer lines in solar spectrum
- **Spectroscopy applications**: Use spectra to identify elements (each element has unique spectral fingerprint), analyze starlight to determine composition
- **Photon energy and color**: Relate photon energy to frequency $E = hf$ or wavelength $E = \frac{hc}{\lambda}$, understand that blue photons have more energy than red

**Vary the content/context:**
- **Natural phenomena**: Rainbows, blue sky (Rayleigh scattering), red sunsets, aurora colors, atmospheric optics
- **Light sources**: Incandescent bulbs (continuous spectrum), fluorescent lamps (line spectrum), LEDs (narrow spectrum), sunlight
- **Color displays**: RGB screens (phones, TVs, monitors), color mixing in pixels, color calibration
- **Color printing**: CMYK printing, how ink colors combine, color separation in printing
- **Spectroscopy**: Astronomical spectroscopy, identifying elements in stars, forensic analysis, quality control
- **Art and design**: Color theory, complementary colors, color perception, optical illusions with color
- **Gemstones and filters**: How colored filters work, why rubies are red, color in crystals and glass

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 14): Focus on qualitative color mixing, prism experiments, identify spectrum colors, basic rainbow explanation, RGB and CMY concepts without detailed physics
- **For middle ages** ({{age}} 14-15): Introduce wavelength ranges for colors, explain dispersion mechanism, distinguish continuous vs. line spectra, analyze simple spectroscopy applications
- **For older ages** ({{age}} >= 16): Quantitative wavelength-frequency calculations, photon energy calculations using $E = hf$, detailed spectroscopy analysis, relate spectra to atomic energy levels

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for relationships: Speed of light $c = \lambda f$, photon energy $E = hf = \frac{hc}{\lambda}$
- Block for color relationships:

$$c = \lambda \cdot f$$

$$E_{\text{photon}} = h \cdot f = \frac{h \cdot c}{\lambda}$$

where $c = 3 \times 10^8 \frac{m}{s}$ (speed of light), $h = 6.626 \times 10^{-34}$ J·s (Planck constant), $\lambda$ is wavelength, $f$ is frequency, $E$ is photon energy.

**Visible spectrum wavelength ranges:**
- Violet: 380-450 nm
- Blue: 450-495 nm
- Green: 495-570 nm
- Yellow: 570-590 nm
- Orange: 590-620 nm
- Red: 620-750 nm

**Color mixing relationships:**

**Additive (RGB - light):**
- Red + Green = Yellow
- Red + Blue = Magenta
- Green + Blue = Cyan
- Red + Green + Blue = White
- No light = Black

**Subtractive (CMY - pigments):**
- Cyan + Magenta = Blue
- Cyan + Yellow = Green
- Magenta + Yellow = Red
- Cyan + Magenta + Yellow = Black
- No pigment = White

**Tables for spectral data:**

| Color  | Wavelength Range (nm) | Frequency Range (THz) | Photon Energy (eV) |
|--------|----------------------|-----------------------|-------------------|
| Violet | 380-450              | 670-790               | 2.75-3.26         |
| Blue   | 450-495              | 610-670               | 2.50-2.75         |
| Green  | 495-570              | 530-610               | 2.18-2.50         |
| Yellow | 570-590              | 510-530               | 2.10-2.18         |
| Orange | 590-620              | 480-510               | 2.00-2.10         |
| Red    | 620-750              | 400-480               | 1.65-2.00         |

**SVG diagrams for color and spectrum visualization:**

Use SVG to show:
- Prism dispersion with white light entering and spectrum (ROYGBIV) exiting
- Rainbow with primary and secondary arcs, angle measurements
- RGB color mixing with overlapping colored circles showing combined colors
- CMY subtractive mixing showing filter combinations
- Continuous spectrum as gradient bar with wavelength labels
- Line emission spectrum showing discrete colored lines on dark background
- Absorption spectrum showing dark lines in continuous spectrum
- Atomic energy level diagram with transitions corresponding to spectral lines

Example SVG for prism dispersion:
```svg
<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Incoming white light -->
  <line x1="50" y1="150" x2="180" y2="150" stroke="white" stroke-width="8"/>
  <text x="80" y="135" font-size="12" fill="black">White light</text>

  <!-- Prism -->
  <polygon points="200,150 280,100 280,200" fill="none" stroke="#64748b" stroke-width="3" fill-opacity="0.2"/>
  <text x="220" y="160" font-size="11" fill="#64748b">Prism</text>

  <!-- Dispersed spectrum -->
  <line x1="280" y1="100" x2="450" y2="50" stroke="#8b5cf6" stroke-width="3"/>
  <text x="455" y="55" font-size="11" fill="#8b5cf6">Violet</text>

  <line x1="280" y1="120" x2="450" y2="85" stroke="#3b82f6" stroke-width="3"/>
  <text x="455" y="90" font-size="11" fill="#3b82f6">Blue</text>

  <line x1="280" y1="140" x2="450" y2="120" stroke="#10b981" stroke-width="3"/>
  <text x="455" y="125" font-size="11" fill="#10b981">Green</text>

  <line x1="280" y1="160" x2="450" y2="155" stroke="#fbbf24" stroke-width="3"/>
  <text x="455" y="160" font-size="11" fill="#fbbf24">Yellow</text>

  <line x1="280" y1="180" x2="450" y2="190" stroke="#f97316" stroke-width="3"/>
  <text x="455" y="195" font-size="11" fill="#f97316">Orange</text>

  <line x1="280" y1="200" x2="450" y2="225" stroke="#ef4444" stroke-width="3"/>
  <text x="455" y="230" font-size="11" fill="#ef4444">Red</text>

  <!-- Wavelength labels -->
  <text x="370" y="40" font-size="9" fill="#8b5cf6">~400 nm</text>
  <text x="370" y="240" font-size="9" fill="#ef4444">~700 nm</text>

  <!-- Explanation -->
  <text x="150" y="280" font-size="12" font-style="italic">Different wavelengths refract by different amounts</text>
</svg>
```

Example SVG for RGB additive color mixing:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Define opacity for blending -->
  </defs>

  <!-- Red circle -->
  <circle cx="150" cy="120" r="60" fill="#ef4444" opacity="0.6"/>
  <text x="120" y="80" font-size="14" font-weight="bold" fill="#ef4444">Red</text>

  <!-- Green circle -->
  <circle cx="250" cy="120" r="60" fill="#10b981" opacity="0.6"/>
  <text x="260" y="80" font-size="14" font-weight="bold" fill="#10b981">Green</text>

  <!-- Blue circle -->
  <circle cx="200" cy="200" r="60" fill="#3b82f6" opacity="0.6"/>
  <text x="185" y="270" font-size="14" font-weight="bold" fill="#3b82f6">Blue</text>

  <!-- Mixed color labels -->
  <text x="180" y="100" font-size="11">Yellow</text>
  <text x="230" y="160" font-size="11">Cyan</text>
  <text x="130" y="160" font-size="11">Magenta</text>
  <text x="190" y="155" font-size="11" font-weight="bold">White</text>

  <!-- Title -->
  <text x="110" y="25" font-size="16" font-weight="bold">Additive Color Mixing (RGB)</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Identify colors in spectrum, describe prism experiment, basic color mixing (RGB and CMY), explain rainbow qualitatively, recognize continuous vs. line spectra
- **Medium**: Relate wavelengths to colors quantitatively, explain dispersion mechanism, analyze simple spectroscopy, calculate frequency from wavelength using $c = \lambda f$
- **Hard**: Calculate photon energies using $E = hf$, analyze complex spectra to identify elements, explain spectroscopy applications in astronomy, relate spectra to atomic energy level transitions

**Include variety in numerical values:**
- Different wavelengths: 450 nm, 550 nm, 650 nm, 480 nm, 620 nm
- Vary frequencies: 5.0 × 10¹⁴ Hz, 6.0 × 10¹⁴ Hz, 4.5 × 10¹⁴ Hz
- Photon energies: 2.0 eV, 2.5 eV, 3.0 eV (when using energy calculations)
- Prism angles: 60°, 45°, 30°
- Refractive index variations: red n=1.51, violet n=1.53 in glass
- Ensure different numerical answers each time to prevent memorization
