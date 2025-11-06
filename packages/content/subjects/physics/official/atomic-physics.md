---
id: atomic-physics
name: Atomic Physics
description: 'Atomic spectra, photon model, and energy level transitions'
grade: 9
ages:
  - 14
  - 17
focus: 'Photon model, Planck constant, photon energy and frequency, discrete spectra, absorption and emission, energy level diagrams, spectral lines, Balmer series'
difficulty: hard
learning_objectives:
  - Apply photon model of light (E = h·f)
  - Explain discrete atomic spectra using energy levels
  - Understand absorption and emission processes
  - Relate photon energy to color/wavelength
prerequisites: []
example_tasks:
  - Calculate the energy of a photon with wavelength 500 nm using E = h·c/λ
  - Explain why atomic spectra consist of discrete lines rather than continuous colors
  - Determine the wavelength of light emitted when an electron transitions from n=3 to n=2 in hydrogen
real_world_context: 'Spectroscopy in astronomy, chemical analysis, lasers, LED technology, fluorescent lighting, understanding star composition'
---

# Atomic Physics Tasks

Create physics problems that explore the quantum nature of light and atomic energy levels. Problems should help students understand photons as light quanta, explain atomic spectra using energy level transitions, and apply the relationship between photon energy, frequency, and wavelength.

**Vary the problem structure:**
- **Photon energy calculations**: Calculate photon energy using $E = h \cdot f$ where Planck's constant $h = 6.626 \times 10^{-34}$ J·s, or using $E = \frac{h \cdot c}{\lambda}$ where $c = 3 \times 10^8$ m/s
- **Wavelength-frequency conversions**: Use $c = \lambda \cdot f$ to convert between wavelength and frequency, then calculate energy
- **Energy level transitions**: Given initial and final energy levels, calculate photon energy emitted or absorbed using $\Delta E = E_{\text{final}} - E_{\text{initial}}$
- **Hydrogen spectrum analysis**: Apply Bohr formula $E_n = -\frac{13.6 \text{ eV}}{n^2}$ to calculate energies of specific transitions (Balmer series, Lyman series)
- **Color and wavelength**: Relate photon wavelength to visible color (violet ~400 nm, red ~700 nm) and explain why different transitions produce different colors
- **Emission vs absorption**: Explain processes - emission occurs when electron drops to lower level (releases photon), absorption when electron jumps to higher level (absorbs photon)
- **Spectral line interpretation**: Analyze emission spectra (bright lines on dark background) or absorption spectra (dark lines on continuous spectrum) to identify elements
- **Photon momentum**: Calculate photon momentum using $p = \frac{h}{\lambda} = \frac{E}{c}$ (for advanced students)

**Vary the content/context:**
- **Visible light colors**: Violet (400 nm), blue (450 nm), green (550 nm), yellow (580 nm), orange (610 nm), red (700 nm)
- **Electromagnetic spectrum**: Radio waves, microwaves, infrared, visible, ultraviolet, X-rays, gamma rays with different wavelengths and energies
- **Hydrogen transitions**: Lyman series (UV, to n=1), Balmer series (visible, to n=2), Paschen series (IR, to n=3)
- **Technology**: LEDs (specific wavelengths from semiconductor bandgaps), lasers (monochromatic coherent light), fluorescent tubes (mercury vapor emission)
- **Astronomy**: Stellar spectroscopy to determine star composition, temperature, motion (redshift/blueshift)
- **Everyday phenomena**: Neon signs, flame tests (sodium yellow, copper green), fireworks colors, auroras

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 15): Focus on qualitative understanding - photons as light particles, discrete spectral lines vs continuous spectrum, colors have different energies, simple energy-frequency relationship
- **For middle ages** ({{age}} 15-16): Calculate photon energies from wavelength or frequency, perform unit conversions (nm to m, eV to J), analyze simple transitions, relate color to energy quantitatively
- **For older ages** ({{age}} >= 17): Multi-step problems combining wavelength, frequency, and energy, apply Bohr model to hydrogen transitions, calculate specific series lines, understand selection rules, photon momentum

**Use appropriate formats:**

**LaTeX for formulas:**
- Photon energy-frequency: $E = h \cdot f$ where $h = 6.626 \times 10^{-34}$ J·s
- Photon energy-wavelength: $E = \frac{h \cdot c}{\lambda}$
- Wave equation: $c = \lambda \cdot f$
- Hydrogen energy levels: $E_n = -\frac{13.6 \text{ eV}}{n^2}$
- Energy in joules: $1 \text{ eV} = 1.602 \times 10^{-19}$ J
- Block format for transition calculations:

$$\Delta E = E_{\text{final}} - E_{\text{initial}} = -13.6 \text{ eV} \left(\frac{1}{n_f^2} - \frac{1}{n_i^2}\right)$$

$$\lambda = \frac{h \cdot c}{\Delta E}$$

**Tables for electromagnetic spectrum:**

| Region | Wavelength Range | Frequency Range | Photon Energy |
|--------|------------------|-----------------|---------------|
| Radio | > 1 mm | < 300 GHz | < 1.24 meV |
| Infrared | 700 nm - 1 mm | 300 GHz - 430 THz | 1.24 meV - 1.77 eV |
| Visible | 400 - 700 nm | 430 - 750 THz | 1.77 - 3.10 eV |
| Ultraviolet | 10 - 400 nm | 750 THz - 30 PHz | 3.10 - 124 eV |

**Tables for hydrogen spectral series:**

| Series | Final Level | Wavelength Range | Region |
|--------|-------------|------------------|--------|
| Lyman | n = 1 | 91 - 122 nm | Ultraviolet |
| Balmer | n = 2 | 365 - 656 nm | Visible |
| Paschen | n = 3 | 820 - 1875 nm | Infrared |

**SVG diagrams for energy levels:**

Use SVG to show:
- Energy level diagrams with horizontal lines representing quantum states
- Electron transitions with arrows (downward = emission, upward = absorption)
- Wavelength labels for emitted photons
- Balmer series transitions (n=3,4,5,6 → n=2)
- Comparison of emission spectrum (bright lines) vs absorption spectrum (dark lines)
- Color coding for visible light wavelengths

Example SVG for hydrogen energy levels and Balmer series:
```svg
<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Energy levels -->
  <line x1="50" y1="350" x2="200" y2="350" stroke="black" stroke-width="2"/>
  <text x="210" y="355" font-size="14">n=1 (-13.6 eV)</text>

  <line x1="50" y1="280" x2="200" y2="280" stroke="black" stroke-width="2"/>
  <text x="210" y="285" font-size="14">n=2 (-3.4 eV)</text>

  <line x1="50" y1="240" x2="200" y2="240" stroke="black" stroke-width="2"/>
  <text x="210" y="245" font-size="14">n=3 (-1.5 eV)</text>

  <line x1="50" y1="220" x2="200" y2="220" stroke="black" stroke-width="2"/>
  <text x="210" y="225" font-size="14">n=4 (-0.85 eV)</text>

  <!-- Balmer transitions -->
  <path d="M 80 240 L 80 280" stroke="#dc2626" stroke-width="2" marker-end="url(#arrowred)" fill="none"/>
  <text x="85" y="260" font-size="12" fill="#dc2626">656 nm (red)</text>

  <path d="M 120 220 L 120 280" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrowblue)" fill="none"/>
  <text x="125" y="245" font-size="12" fill="#3b82f6">486 nm (blue)</text>

  <!-- Arrow markers -->
  <defs>
    <marker id="arrowred" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
      <polygon points="0,0 10,5 0,10" fill="#dc2626"/>
    </marker>
    <marker id="arrowblue" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
      <polygon points="0,0 10,5 0,10" fill="#3b82f6"/>
    </marker>
  </defs>

  <text x="150" y="30" font-size="16" font-weight="bold">Balmer Series</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Calculate photon energy from wavelength using provided formula, identify colors by wavelength, explain emission vs absorption qualitatively, recognize that different colors = different energies
- **Medium**: Multi-step problems (wavelength → frequency → energy), convert between eV and joules, calculate specific hydrogen transitions, interpret energy level diagrams, determine wavelengths from energy differences
- **Hard**: Combine multiple concepts (Bohr model + photon energy + wavelength), calculate entire spectral series, analyze selection rules, solve inverse problems (given wavelength, find transition), photon momentum calculations

**Include variety in numerical values:**
- Different wavelengths: 400 nm (violet), 486 nm (blue-green), 550 nm (green), 589 nm (sodium yellow), 656 nm (red), 700 nm (deep red)
- Various frequencies: 4.5×10¹⁴ Hz, 5.5×10¹⁴ Hz, 6.5×10¹⁴ Hz, 7.5×10¹⁴ Hz
- Different transitions: n=2→1, n=3→1, n=3→2, n=4→2, n=5→2, n=4→1
- Energy ranges: 1.77 eV (red), 2.5 eV (green), 3.1 eV (violet), 10.2 eV (Lyman alpha)
- Various elements for spectral analysis: hydrogen, sodium, mercury, helium, neon
- Ensure calculations yield different photon energies and wavelengths each time
