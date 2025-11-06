---
id: atomic-models
name: Atomic Models
description: 'Historical development of atomic models and structure of atoms'
grade: 9
ages:
  - 14
  - 17
focus: 'Dalton model, Thomson model, Rutherford scattering experiment, nuclear model, Bohr model, energy levels, electron shells, atomic number, mass number, isotopes'
difficulty: hard
learning_objectives:
  - Describe historical atomic models (Dalton, Thomson, Rutherford, Bohr)
  - Understand nuclear-shell model of the atom
  - Explain atomic structure (protons, neutrons, electrons)
  - Apply atomic models to explain spectra
prerequisites: []
example_tasks:
  - Explain how Rutherford's gold foil experiment led to the discovery of the atomic nucleus
  - Draw the Bohr model for a hydrogen atom showing the first three energy levels
  - Calculate the number of protons, neutrons, and electrons in an isotope given its atomic notation
real_world_context: 'Spectroscopy, chemical bonding, nuclear medicine, radioactive dating, understanding matter at the atomic scale'
---

# Atomic Models Tasks

Create physics problems that explore the historical development of atomic models and how our understanding of atomic structure evolved. Problems should help students compare different atomic models, understand experimental evidence that led to model refinements, and apply modern atomic structure concepts.

**Vary the problem structure:**
- **Model comparison questions**: Compare Dalton's solid sphere model with Thomson's plum pudding model - what new experimental evidence led to Thomson's model? What were the key differences?
- **Rutherford scattering analysis**: Analyze the gold foil experiment - explain why most alpha particles passed through but some were deflected at large angles. What did this reveal about atomic structure?
- **Nuclear model calculations**: Given atomic number $Z$ and mass number $A$, calculate number of protons, neutrons ($N = A - Z$), and electrons in neutral atoms and ions
- **Bohr model energy levels**: Analyze electron transitions between energy levels using $E_n = -\frac{13.6 \text{ eV}}{n^2}$ for hydrogen. Calculate photon energy for transitions using $\Delta E = E_{final} - E_{initial}$
- **Isotope notation**: Interpret and write isotope notation $^A_Z X$ where X is the element symbol, A is mass number, Z is atomic number. Compare isotopes of the same element
- **Electron shell configuration**: Describe electron distribution in shells (K, L, M shells) for elements, understanding shell capacity (2, 8, 18...)
- **Model limitations**: Explain what each model could and couldn't explain - why was each model eventually replaced or refined?
- **Timeline questions**: Arrange atomic models chronologically and explain the progression of scientific understanding from Dalton (1803) to Bohr (1913)

**Vary the content/context:**
- **Historical experiments**: Gold foil experiment (Rutherford), cathode ray tubes (Thomson), hydrogen spectrum (Bohr), Dalton's atomic theory
- **Element examples**: Hydrogen (simplest), helium, carbon, nitrogen, oxygen, sodium, chlorine - show increasing complexity
- **Isotopes**: Carbon-12 vs Carbon-14, Hydrogen vs Deuterium vs Tritium, Uranium-235 vs Uranium-238
- **Spectroscopy**: Line spectra of different elements, Balmer series in hydrogen, emission and absorption spectra
- **Technology applications**: Spectral analysis in astronomy, flame tests in chemistry, medical imaging
- **Scientific process**: How experimental evidence challenges and refines theories, role of models in science

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 15): Focus on qualitative descriptions of models, simple atomic structure (protons in nucleus, electrons orbiting), basic isotope calculations, comparing 2-3 models visually
- **For middle ages** ({{age}} 15-16): Include quantitative analysis of atomic composition, calculate particles in isotopes, understand energy level diagrams, analyze Rutherford experiment results, relate models to spectral lines
- **For older ages** ({{age}} >= 17): Apply Bohr model equations, calculate photon energies for transitions, analyze limitations of each model quantitatively, connect to wave-particle duality, understand quantum numbers basics

**Use appropriate formats:**

**LaTeX for formulas:**
- Atomic notation: $^A_Z X$ where $A$ = mass number, $Z$ = atomic number
- Number of neutrons: $N = A - Z$
- Bohr model energy levels: $E_n = -\frac{13.6 \text{ eV}}{n^2}$ (for hydrogen)
- Photon energy for transitions: $\Delta E = h \cdot f = \frac{h \cdot c}{\lambda}$
- Block format for key equations:

$$E_{\text{photon}} = E_{\text{final}} - E_{\text{initial}} = -13.6 \text{ eV} \left(\frac{1}{n_f^2} - \frac{1}{n_i^2}\right)$$

**Tables for atomic data:**

| Element | Symbol | Atomic Number | Mass Number | Protons | Neutrons | Electrons |
|---------|--------|---------------|-------------|---------|----------|-----------|
| Hydrogen | H | 1 | 1 | 1 | 0 | 1 |
| Carbon-12 | C | 6 | 12 | 6 | 6 | 6 |
| Oxygen | O | 8 | 16 | 8 | 8 | 8 |

**Model comparison tables:**

| Model | Year | Structure | Explained | Limitations |
|-------|------|-----------|-----------|-------------|
| Dalton | 1803 | Solid sphere | Conservation of mass | No internal structure |
| Thomson | 1897 | Plum pudding | Electrons exist | No nucleus |
| Rutherford | 1911 | Nuclear | Nucleus, alpha scattering | Electron stability |
| Bohr | 1913 | Quantum orbits | Hydrogen spectrum | Only works for hydrogen |

**SVG diagrams for atomic models:**

Use SVG to show:
- Dalton model: solid colored sphere
- Thomson model: sphere with embedded electrons (plum pudding)
- Rutherford model: small nucleus with electrons orbiting (planetary)
- Bohr model: nucleus with discrete circular orbits labeled with quantum numbers n=1, 2, 3
- Energy level diagrams showing electron transitions with arrows
- Rutherford scattering setup: alpha source, gold foil, detector screen

Example SVG for Bohr model of hydrogen:
```svg
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Nucleus -->
  <circle cx="200" cy="200" r="10" fill="#dc2626"/>
  <text x="195" y="205" font-size="10" fill="white">p+</text>

  <!-- Electron orbits -->
  <circle cx="200" cy="200" r="50" fill="none" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,3"/>
  <circle cx="200" cy="200" r="100" fill="none" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,3"/>
  <circle cx="200" cy="200" r="150" fill="none" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,3"/>

  <!-- Electron -->
  <circle cx="250" cy="200" r="5" fill="#3b82f6"/>

  <!-- Labels -->
  <text x="245" y="190" font-size="12">n=1</text>
  <text x="295" y="190" font-size="12">n=2</text>
  <text x="345" y="190" font-size="12">n=3</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Qualitative descriptions of 2-3 models, simple particle counting (protons, neutrons, electrons) for given elements, identify isotopes, recognize model progression
- **Medium**: Compare all major models with reasons for changes, calculate atomic composition for multiple isotopes, interpret simple energy level diagrams, analyze Rutherford experiment outcomes
- **Hard**: Apply Bohr model equations to calculate transition energies, explain quantum number significance, analyze spectral lines quantitatively, evaluate model limitations theoretically, connect multiple concepts (models + spectra + energy)

**Include variety in numerical values:**
- Different elements: H (Z=1), He (Z=2), C (Z=6), N (Z=7), O (Z=8), Na (Z=11), Cl (Z=17), Fe (Z=26)
- Various isotopes: $^{12}_6 C$, $^{14}_6 C$, $^{235}_{92} U$, $^{238}_{92} U$, $^1_1 H$, $^2_1 H$, $^3_1 H$
- Energy level transitions: n=3→n=2, n=4→n=1, n=2→n=1, n=5→n=2
- Different quantum numbers: n=1, 2, 3, 4, 5
- Vary ions: Na⁺, Cl⁻, O²⁻, Fe²⁺, Fe³⁺
- Ensure calculations yield different energies and particle counts each time
