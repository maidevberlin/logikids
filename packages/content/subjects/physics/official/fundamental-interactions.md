---
id: fundamental-interactions
name: Fundamental Interactions
description: 'Four fundamental forces and their role in nature'
grade: 12
ages:
  - 17
  - 18
focus: 'Gravitational interaction, electromagnetic interaction, weak interaction, strong interaction, force carriers (bosons), unified theories, Feynman diagrams (qualitative)'
difficulty: hard
learning_objectives:
  - Describe four fundamental interactions
  - Compare ranges and strengths
  - Understand role of force carriers
  - Apply to particle decays and reactions
prerequisites: []
example_tasks:
  - Compare the relative strengths of the four fundamental forces
  - Explain why the strong force only acts at nuclear distances while gravity has infinite range
  - Identify which fundamental interaction is responsible for beta decay
real_world_context: 'Nuclear reactors, particle accelerators, stellar fusion, radioactive decay, atomic structure, unification theories in modern physics'
---

# Fundamental Interactions Tasks

Create physics problems that explore the four fundamental forces of nature and their characteristics. Problems should help students understand force ranges, relative strengths, which particles are affected by each force, and the role of force-carrying particles (gauge bosons).

**Vary the problem structure:**
- **Force comparison tables**: Complete tables comparing the four forces by range, relative strength, particles affected, and force carrier
- **Identifying interactions in processes**: Determine which fundamental force is responsible for various phenomena (nuclear binding, chemical bonds, radioactive decay, planetary orbits)
- **Relative strength calculations**: Given that strong force strength is 1, compare to electromagnetic ($\alpha \approx 1/137$), weak ($10^{-6}$), and gravitational ($10^{-39}$) forces
- **Range analysis**: Explain why some forces (gravity, electromagnetic) have infinite range while others (weak, strong) are limited to nuclear distances ($10^{-15}$ m)
- **Force carrier identification**: Match each fundamental force to its gauge boson (photon, gluons, W/Z bosons, graviton)
- **Particle interaction possibilities**: Determine which particles can participate in which interactions (quarks in all four, leptons in all except strong, neutrinos only in weak and gravity)
- **Feynman diagram interpretation**: Read simplified Feynman diagrams showing particle interactions, identify exchange particles and interaction type
- **Decay process analysis**: Determine which fundamental force mediates various decay processes (beta decay → weak, nuclear fission → strong, pair annihilation → electromagnetic)

**Vary the content/context:**
- **Gravitational interaction**: Weakest force, infinite range, affects all particles with mass, always attractive, dominant at cosmic scales, graviton (hypothetical), explains planetary motion and cosmic structure
- **Electromagnetic interaction**: Medium strength ($\alpha = 1/137$), infinite range, affects charged particles, can be attractive or repulsive, photon as carrier, responsible for chemistry and light
- **Weak interaction**: Short range ($10^{-18}$ m), strength $10^{-6}$ relative to strong, responsible for beta decay and neutrino interactions, W and Z bosons as carriers, violates parity symmetry
- **Strong interaction**: Strongest force (strength = 1), short range ($10^{-15}$ m), binds quarks into hadrons and nucleons into nuclei, acts on color charge, carried by 8 gluons, exhibits confinement
- **Force carriers (gauge bosons)**: Massless (photon, gluon) vs massive (W, Z bosons), spin-1 particles, virtual particles in quantum field theory
- **Unification**: Electroweak unification (electromagnetic + weak at high energy), Grand Unified Theory (GUT), Theory of Everything including gravity
- **Applications**: Nuclear binding energy (strong), radioactive decay (weak), atomic structure (electromagnetic), stellar fusion (all forces), particle accelerator collisions

**Vary the complexity based on age:**
- **For age 17**: Basic properties of four forces, qualitative comparison of strengths and ranges, identifying which force dominates in common situations (atoms → electromagnetic, nuclei → strong, planets → gravity)
- **For age 18**: Quantitative strength comparisons, understanding force carriers, applying knowledge to particle processes and decays, explaining why certain interactions occur or don't occur
- **For age 19**: Feynman diagram interpretation, unified theories and symmetry breaking, coupling constants, range from Yukawa potential, quantum field theory concepts, experimental evidence from accelerators

**Use appropriate formats:**

**LaTeX for formulas and comparisons:**
- Relative strengths: $F_{\text{strong}} : F_{\text{em}} : F_{\text{weak}} : F_{\text{grav}} = 1 : 10^{-2} : 10^{-6} : 10^{-39}$
- Electromagnetic fine structure constant: $\alpha = \frac{e^2}{4\pi\epsilon_0\hbar c} \approx \frac{1}{137}$
- Range from mass: $r \approx \frac{\hbar}{m_{\text{carrier}}c}$ (Yukawa potential)
- Gravitational force: $F = G\frac{m_1 m_2}{r^2}$
- Coulomb force: $F = k\frac{q_1 q_2}{r^2}$
- Strong force (qualitative): $F_{\text{strong}} \sim \text{constant for } r < 10^{-15}\text{ m}$

**Tables for force properties:**

| Force | Relative Strength | Range | Acts On | Carrier | Mass (GeV/c²) |
|-------|-------------------|-------|---------|---------|---------------|
| Strong | 1 | $10^{-15}$ m | Quarks, gluons | Gluons (8) | 0 |
| Electromagnetic | $10^{-2}$ | Infinite | Charged particles | Photon | 0 |
| Weak | $10^{-6}$ | $10^{-18}$ m | All fermions | W±, Z⁰ | 80, 91 |
| Gravitational | $10^{-39}$ | Infinite | All mass | Graviton* | 0 |

*Hypothetical, not yet observed

**Force participation table:**

| Particle | Strong | Electromagnetic | Weak | Gravitational |
|----------|--------|-----------------|------|---------------|
| Quarks | Yes | Yes (charged) | Yes | Yes |
| Leptons | No | Yes (charged) | Yes | Yes |
| Neutrinos | No | No | Yes | Yes |
| Photon | No | Yes | No | Yes |

**SVG diagrams for Feynman diagrams:**

Use SVG to show:
- Simple Feynman diagrams with time going upward
- Particle lines (fermions) and wavy lines (bosons)
- Interaction vertices where force carriers are exchanged
- Examples: electron-electron scattering (photon exchange), beta decay (W boson), quark interaction (gluon)

Example SVG for electromagnetic interaction:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Title -->
  <text x="100" y="30" font-size="18" font-weight="bold">Electromagnetic Repulsion</text>

  <!-- Left electron path -->
  <line x1="80" y1="250" x2="120" y2="150" stroke="#3b82f6" stroke-width="3"/>
  <line x1="120" y1="150" x2="80" y2="50" stroke="#3b82f6" stroke-width="3"/>

  <!-- Right electron path -->
  <line x1="320" y1="250" x2="280" y2="150" stroke="#3b82f6" stroke-width="3"/>
  <line x1="280" y1="150" x2="320" y2="50" stroke="#3b82f6" stroke-width="3"/>

  <!-- Photon exchange (wavy line) -->
  <path d="M 120 150 Q 140 140, 160 150 T 200 150 T 240 150 T 280 150"
        fill="none" stroke="#ef4444" stroke-width="2"/>

  <!-- Labels -->
  <text x="50" y="270" font-size="14">e⁻</text>
  <text x="50" y="40" font-size="14">e⁻</text>
  <text x="330" y="270" font-size="14">e⁻</text>
  <text x="330" y="40" font-size="14">e⁻</text>
  <text x="180" y="130" font-size="14" fill="#ef4444">γ</text>

  <!-- Time arrow -->
  <line x1="370" y1="250" x2="370" y2="50" stroke="black" stroke-width="2" marker-end="url(#arrowhead)"/>
  <text x="350" y="145" font-size="12">time</text>

  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="black"/>
    </marker>
  </defs>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Qualitative comparison of forces, identifying which force dominates in everyday situations (chemistry, gravity, nuclear binding), basic properties without numbers
- **Medium**: Quantitative strength comparisons, identifying force carriers, determining which particles interact via which forces, explaining range differences, analyzing simple processes
- **Hard**: Multiple forces in complex situations, Feynman diagram interpretation, relating force range to carrier mass, unified theories, explaining experimental evidence, predicting possible/impossible interactions

**Include variety in contexts and examples:**
- Phenomena to analyze: atomic structure, chemical bonding, nuclear binding, radioactive decay, neutron stars, particle accelerator collisions
- Decay processes: beta decay (weak), alpha decay (strong + electromagnetic), pair annihilation (electromagnetic)
- Comparison contexts: inside proton (strong dominates), atomic scale (electromagnetic), solar system (gravity), radioactive nucleus (weak)
- Force dominance scales: $10^{-15}$ m (nuclear), $10^{-10}$ m (atomic), $10^6$ m (planetary), $10^{21}$ m (galactic)
- Particle interactions: quark-quark (strong), electron-proton (electromagnetic), neutrino-matter (weak), all masses (gravitational)
- Unification energy scales: electroweak ($10^2$ GeV), GUT ($10^{16}$ GeV), Planck scale ($10^{19}$ GeV)
- Real experiments: particle colliders (LHC), neutrino detectors, gravitational wave observatories (LIGO)
- Ensure different contexts and phenomena in each problem
