---
id: special-relativity
name: Special Relativity
description: "Einstein's special theory of relativity - time dilation, length contraction, and relativistic effects"
grade: 11
ages:
  - 16
  - 18
focus: "Einstein's postulates, constancy of speed of light, inertial reference frames, time dilation, length contraction, relativity of simultaneity, relativistic mass, mass-energy equivalence (E = mc²), spacetime"
difficulty: hard
learning_objectives:
  - Understand Einstein's postulates
  - Apply time dilation and length contraction
  - Recognize relativity of simultaneity
  - Understand limitations of Newtonian mechanics
prerequisites: []
example_tasks:
  - A spaceship travels at 0.8c. Calculate the time dilation factor and how much time passes on Earth when 1 year passes on the ship
  - A rocket of proper length 100m travels at 0.6c. What length do ground observers measure?
  - "Calculate the energy equivalent of 1 kg of mass using E = mc^2"
real_world_context: 'GPS satellite time corrections, particle accelerators, cosmic ray muons reaching Earth, nuclear energy release, relativistic jets from black holes'
---

# Special Relativity Tasks

Create physics problems that explore relativistic effects when objects move at speeds approaching the speed of light. Problems should help students understand time dilation, length contraction, mass-energy equivalence, and the breakdown of classical Newtonian physics at high velocities.

**Vary the problem structure:**
- **Time dilation calculations** using $\Delta t = \frac{\Delta t_0}{\sqrt{1-\frac{v^2}{c^2}}} = \gamma \Delta t_0$: Calculate how time passes differently for moving observers, comparing proper time to dilated time for spaceships, particles, or astronauts
- **Length contraction problems** using $L = L_0\sqrt{1-\frac{v^2}{c^2}} = \frac{L_0}{\gamma}$: Determine contracted lengths of moving objects as observed from stationary frame, compare proper length to contracted length
- **Lorentz factor calculations**: Compute $\gamma = \frac{1}{\sqrt{1-\frac{v^2}{c^2}}}$ for various velocities, understand when relativistic effects become significant ($v > 0.1c$)
- **Mass-energy equivalence** using $E = mc^2$: Calculate energy equivalent of mass, energy released in nuclear reactions, rest energy of particles, compare to kinetic energy
- **Relativistic velocity addition**: Apply $v = \frac{v_1 + v_2}{1 + \frac{v_1v_2}{c^2}}$ instead of simple Galilean addition, show why velocities can't exceed $c$
- **Simultaneity analysis**: Examine events that are simultaneous in one reference frame but not in another, understand the relativity of "now"
- **Relativistic momentum and energy**: Calculate $p = \gamma m_0 v$ and total energy $E = \gamma m_0 c^2$, understand increase at high speeds
- **Twin paradox scenarios**: Analyze aging differences between traveling and stationary twins, calculate age difference after high-speed journey

**Vary the content/context:**
- **Space travel**: Spaceships traveling to distant stars, time experienced by astronauts vs Earth observers, interstellar journeys at relativistic speeds
- **Particle physics**: Particles in accelerators (protons at LHC), particle lifetimes in lab vs proper frame, high-energy cosmic rays
- **Muons from cosmic rays**: Muons created in upper atmosphere, should decay before reaching ground by classical physics, reach surface due to time dilation
- **GPS satellites**: Time runs faster in orbit due to relativity (both special and general effects), corrections needed for accurate positioning
- **Nuclear reactions**: Mass defect in nuclear fusion/fission, energy release calculated from $E=mc^2$, sun's energy production
- **Velocity scenarios**: Various speeds from $0.1c$ to $0.99c$ showing increasing relativistic effects
- **Practical implications**: Why we can't accelerate to light speed, infinite energy requirement, speed of light as cosmic speed limit

**Vary the complexity based on age:**
- **For age 16**: Focus on conceptual understanding of time dilation and length contraction, use simple speeds like $0.6c$, $0.8c$ for easy calculations, emphasize that $c$ is constant for all observers, basic $E=mc^2$ applications
- **For age 17**: Quantitative problems with Lorentz factor, various velocities requiring calculator use, proper time vs coordinate time, proper length vs contracted length, relativistic momentum introduction
- **For age 18**: Complex multi-step problems, velocity addition, relativistic energy-momentum relation $E^2 = (pc)^2 + (m_0c^2)^2$, simultaneity analysis, understanding four-vectors, experimental evidence from particle physics

**Use appropriate formats:**

**LaTeX for formulas:**
- Lorentz factor: $\gamma = \frac{1}{\sqrt{1-\frac{v^2}{c^2}}} = \frac{1}{\sqrt{1-\beta^2}}$ where $\beta = \frac{v}{c}$
- Time dilation: $\Delta t = \gamma \Delta t_0$ or $\Delta t = \frac{\Delta t_0}{\sqrt{1-\frac{v^2}{c^2}}}$
- Length contraction: $L = \frac{L_0}{\gamma} = L_0\sqrt{1-\frac{v^2}{c^2}}$
- Mass-energy: $E_0 = m_0c^2$ (rest energy), $E = \gamma m_0 c^2$ (total energy)
- Relativistic momentum: $p = \gamma m_0 v$
- Velocity addition: $v = \frac{v_1 + v_2}{1 + \frac{v_1v_2}{c^2}}$
- Energy-momentum relation: $E^2 = (pc)^2 + (m_0c^2)^2$

**Tables for relativistic effects at different speeds:**

| Velocity | $\beta = v/c$ | $\gamma$ | Time dilation | Length contraction |
|----------|---------------|----------|---------------|-------------------|
| 0.1c | 0.1 | 1.005 | 0.5% slower | 0.5% shorter |
| 0.5c | 0.5 | 1.155 | 15.5% slower | 13.4% shorter |
| 0.8c | 0.8 | 1.667 | 66.7% slower | 40% shorter |
| 0.9c | 0.9 | 2.294 | 129% slower | 56.4% shorter |
| 0.99c | 0.99 | 7.089 | 609% slower | 85.9% shorter |

**Einstein's postulates:**
1. Laws of physics are the same in all inertial reference frames
2. Speed of light in vacuum is constant ($c = 3.0 \times 10^8$ m/s) for all observers

**SVG diagrams for spacetime and reference frames:**

Use SVG to visualize:
- Spacetime diagrams with time on vertical axis, space on horizontal
- Light cones showing causally connected events
- World lines for stationary and moving objects
- Length contraction illustration with rocket in two frames
- Time dilation illustration with clocks on spaceship and Earth
- Simultaneity diagram showing different "now" for different observers

Example SVG for time dilation:
```svg
<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Earth observer -->
  <rect x="50" y="100" width="80" height="120" fill="#3b82f6" opacity="0.3"/>
  <circle cx="90" cy="160" r="15" fill="none" stroke="black" stroke-width="2"/>
  <text x="85" y="165" font-size="12">🕐</text>
  <text x="55" y="240" font-size="14" font-weight="bold">Earth: Δt = 5 years</text>

  <!-- Spaceship -->
  <path d="M 300 100 L 380 100 L 400 140 L 400 180 L 380 220 L 300 220 Z"
        fill="#ef4444" opacity="0.3" stroke="#ef4444" stroke-width="2"/>
  <circle cx="340" cy="160" r="15" fill="none" stroke="black" stroke-width="2"/>
  <text x="335" y="165" font-size="12">🕐</text>
  <text x="295" y="240" font-size="14" font-weight="bold">Ship (v=0.8c): Δt₀ = 3 years</text>

  <!-- Speed arrow -->
  <line x1="320" y1="50" x2="380" y2="50" stroke="black" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="330" y="40" font-size="14">v = 0.8c</text>

  <!-- Formula -->
  <text x="150" y="280" font-size="14">Δt = γΔt₀ = 1.667 × 3 = 5 years</text>

  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="black"/>
    </marker>
  </defs>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Simple velocities ($0.6c$, $0.8c$), direct formula application, one-step calculations, basic $E=mc^2$ with small masses, conceptual questions about which effects occur
- **Medium**: Various velocities requiring calculator, two-step problems (first find $\gamma$, then apply), comparing proper and coordinate measurements, energy calculations for realistic particles (electrons, protons)
- **Hard**: Multi-step problems combining effects, velocity addition problems, energy-momentum problems, analyzing paradoxes, experimental verification scenarios, requiring both time dilation and length contraction

**Include variety in numerical values:**
- Different velocities: $0.1c$, $0.3c$, $0.5c$, $0.6c$, $0.8c$, $0.9c$, $0.95c$, $0.99c$, $0.999c$
- Time intervals: 1 year, 5 years, 10 years, 1 μs, 100 ns (for particles)
- Distances: 4 light-years, 10 light-years, 100 m (rockets), 1 km
- Particle lifetimes: muon ($2.2 \times 10^{-6}$ s), pion ($2.6 \times 10^{-8}$ s)
- Masses: electron ($9.11 \times 10^{-31}$ kg), proton ($1.67 \times 10^{-27}$ kg), 1 kg, 1 g
- Energy scales: keV, MeV, GeV for particles; joules for macroscopic objects
- GPS corrections: ~7 μs/day (special relativity effect)
- Nuclear masses: before and after reactions with mass defect
- Ensure variety so students cannot memorize answers
