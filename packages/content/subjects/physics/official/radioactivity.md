---
id: radioactivity
name: Radioactivity
description: 'Nuclear radiation, decay processes, and applications of radioactivity'
grade: 10
ages:
  - 15
  - 17
focus: 'Discovery of radioactivity, alpha decay, beta decay, gamma radiation, decay equations, half-life, radioactive dating, isotopes, biological effects, radiation protection, applications in medicine and technology'
difficulty: hard
learning_objectives:
  - Describe types of radioactive radiation (α, β, γ)
  - Understand nuclear decay equations
  - Apply half-life concept
  - Evaluate biological effects and radiation protection
prerequisites: []
example_tasks:
  - Write the nuclear equation for alpha decay of Uranium-238
  - Calculate how much of a 100g sample of Carbon-14 remains after 11,460 years (two half-lives)
  - Explain why alpha radiation is dangerous when inhaled but can be stopped by a sheet of paper
real_world_context: 'Carbon dating of archaeological artifacts, medical diagnostics and cancer treatment, nuclear power, smoke detectors, radiation safety, environmental monitoring'
---

# Radioactivity Tasks

Create physics problems that explore nuclear radiation, radioactive decay processes, and practical applications. Problems should help students understand the three types of radiation, work with decay equations and half-life calculations, evaluate radiation hazards, and recognize beneficial applications in medicine and technology.

**Vary the problem structure:**
- **Radiation type identification**: Compare alpha (α), beta (β), and gamma (γ) radiation in terms of composition (helium nucleus, electron, photon), penetration ability, ionization power, and shielding requirements
- **Nuclear decay equations**: Write balanced equations using $^A_Z X$ notation, ensuring conservation of mass number and atomic number. For alpha: $^A_Z X \rightarrow ^{A-4}_{Z-2} Y + ^4_2 He$, for beta: $^A_Z X \rightarrow ^{A}_{Z+1} Y + ^0_{-1} e$
- **Half-life calculations**: Use $N(t) = N_0 \cdot \left(\frac{1}{2}\right)^{t/T_{1/2}}$ where $N_0$ is initial amount, $T_{1/2}$ is half-life, $t$ is elapsed time
- **Radioactive dating**: Apply half-life to determine age of samples - carbon-14 dating for organic materials, uranium-lead for geological samples
- **Activity calculations**: Calculate decay rate using $A = \lambda \cdot N$ where λ is decay constant, measured in Becquerels (Bq = decays/second)
- **Shielding problems**: Determine appropriate shielding - paper stops alpha, aluminum stops beta, lead reduces gamma
- **Biological effects**: Analyze absorbed dose (Gray), equivalent dose (Sievert), discuss relative biological effectiveness (RBE) and tissue sensitivity
- **Medical applications**: Explain how radioisotopes are used - iodine-131 for thyroid treatment, cobalt-60 for cancer therapy, technetium-99m for imaging

**Vary the content/context:**
- **Common isotopes**: Carbon-14 (T₁/₂ = 5,730 years), Uranium-238 (4.5 billion years), Iodine-131 (8 days), Cobalt-60 (5.3 years), Radon-222 (3.8 days), Polonium-210 (138 days)
- **Natural sources**: Cosmic rays, radon gas from soil, potassium-40 in bananas, carbon-14 in atmosphere, uranium/thorium in rocks
- **Decay chains**: Uranium-238 decay series leading to stable lead-206 through multiple alpha and beta decays
- **Medical uses**: PET scans, radiotherapy for tumors, tracer studies, sterilization of medical equipment
- **Technology**: Smoke detectors (americium-241), radioisotope thermoelectric generators in spacecraft, thickness gauges in industry
- **Archaeological dating**: Dating ancient artifacts, fossils, geological formations, establishing historical timelines
- **Safety**: Radiation protection principles (time, distance, shielding), background radiation, occupational limits, nuclear accidents

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 16): Focus on qualitative understanding of three radiation types, simple half-life problems (1-3 half-lives), basic decay equations, recognize beneficial vs harmful uses, understand shielding needs
- **For middle ages** ({{age}} 16): Calculate amounts remaining after multiple half-lives, write balanced decay equations for various isotopes, compare penetration depths, apply to dating problems with clear context
- **For older ages** ({{age}} >= 17): Use exponential decay formula, calculate decay constants from half-lives, solve inverse problems (determine age from remaining amount), analyze dose calculations, evaluate radiation exposure scenarios quantitatively

**Use appropriate formats:**

**LaTeX for formulas:**
- Half-life decay: $N(t) = N_0 \cdot \left(\frac{1}{2}\right)^{t/T_{1/2}}$
- Exponential form: $N(t) = N_0 \cdot e^{-\lambda t}$ where $\lambda = \frac{\ln 2}{T_{1/2}}$
- Alpha decay: $^A_Z X \rightarrow ^{A-4}_{Z-2} Y + ^4_2 He$ (or $^4_2 \alpha$)
- Beta minus decay: $^A_Z X \rightarrow ^{A}_{Z+1} Y + ^0_{-1} e + \bar{\nu}_e$
- Gamma emission: $^A_Z X^* \rightarrow ^A_Z X + \gamma$
- Activity: $A = \lambda \cdot N$ (measured in Bq or Ci)
- Block format for decay calculation:

$$N(t) = N_0 \cdot \left(\frac{1}{2}\right)^{t/T_{1/2}} = 100 \text{ g} \cdot \left(\frac{1}{2}\right)^{11460/5730} = 100 \text{ g} \cdot \left(\frac{1}{2}\right)^2 = 25 \text{ g}$$

**Tables for radiation properties:**

| Radiation | Composition | Charge | Mass | Penetration | Stopped By | Ionization |
|-----------|-------------|--------|------|-------------|------------|------------|
| Alpha (α) | 2p + 2n | +2e | 4 u | ~cm in air | Paper, skin | High |
| Beta (β⁻) | Electron | -1e | ~0 | ~m in air | Aluminum (mm) | Medium |
| Gamma (γ) | Photon | 0 | 0 | ~km in air | Lead (cm), concrete | Low |

**Tables for common radioisotopes:**

| Isotope | Half-life | Decay Mode | Application |
|---------|-----------|------------|-------------|
| C-14 | 5,730 years | β⁻ | Archaeological dating |
| I-131 | 8 days | β⁻, γ | Thyroid treatment |
| Co-60 | 5.3 years | β⁻, γ | Cancer radiotherapy |
| U-238 | 4.5 billion years | α | Geological dating |
| Tc-99m | 6 hours | γ | Medical imaging |

**SVG diagrams for radioactivity:**

Use SVG to show:
- Three types of radiation with different penetration through materials (paper, aluminum, lead)
- Decay chains with arrows showing sequence of alpha and beta decays
- Half-life decay curves showing exponential decrease over time
- Atomic nucleus before and after decay (show change in protons/neutrons)
- Radiation shielding setup with source, shield, and detector
- Activity vs time graph showing exponential decay

Example SVG for radiation penetration:
```svg
<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Radioactive source -->
  <circle cx="50" cy="150" r="20" fill="#fbbf24"/>
  <text x="35" y="155" font-size="16" font-weight="bold">☢</text>

  <!-- Alpha particles -->
  <path d="M 70 130 L 150 130" stroke="#dc2626" stroke-width="3" marker-end="url(#arrowalpha)"/>
  <text x="100" y="120" font-size="14" fill="#dc2626">α</text>
  <rect x="160" y="100" width="5" height="100" fill="#d4d4d4"/>
  <text x="170" y="115" font-size="12">Paper</text>

  <!-- Beta particles -->
  <path d="M 70 150 L 290 150" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrowbeta)"/>
  <text x="150" y="145" font-size="14" fill="#3b82f6">β</text>
  <rect x="300" y="100" width="8" height="100" fill="#71717a"/>
  <text x="315" y="115" font-size="12">Aluminum</text>

  <!-- Gamma rays -->
  <path d="M 70 170 L 500 170" stroke="#8b5cf6" stroke-width="3"/>
  <text x="250" y="165" font-size="14" fill="#8b5cf6">γ</text>
  <rect x="450" y="100" width="20" height="100" fill="#3f3f46"/>
  <text x="480" y="115" font-size="12">Lead (thick)</text>

  <!-- Arrow markers -->
  <defs>
    <marker id="arrowalpha" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
      <polygon points="0,0 10,5 0,10" fill="#dc2626"/>
    </marker>
    <marker id="arrowbeta" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
      <polygon points="0,0 10,5 0,10" fill="#3b82f6"/>
    </marker>
  </defs>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Identify radiation types by properties, simple half-life calculations (1-2 half-lives, nice numbers), write basic decay equations given parent and decay type, understand shielding qualitatively
- **Medium**: Calculate amounts after 3-5 half-lives, write complete decay equations independently, determine appropriate shielding for scenarios, apply to dating problems with context, convert between units
- **Hard**: Use exponential decay formula with calculator, solve for unknown half-life given data, work backwards from final amount to determine age or initial amount, calculate activity, analyze multi-step decay chains

**Include variety in numerical values:**
- Different initial amounts: 50 g, 100 g, 200 g, 500 mg, 1 kg, 10 mg
- Various time periods: 5,730 years (C-14 half-life), 10,000 years, 24 days (3 half-lives of I-131), 15,000 years
- Multiple isotopes with different half-lives: C-14 (5,730 y), U-238 (4.5×10⁹ y), I-131 (8 d), Co-60 (5.3 y), Rn-222 (3.8 d)
- Various elements for decay equations: U-238→Th-234, Ra-226→Rn-222, C-14→N-14, Co-60→Ni-60
- Different numbers of half-lives: 1, 2, 3, 4, 5 half-lives
- Activity values: 1000 Bq, 5 MBq, 100 kBq, 1 Ci
- Ensure each problem yields different final amounts and ages
