---
id: exponential-functions
name: Exponential Functions
description: Understanding exponential growth and decay with applications to real-world scenarios
grade: 10
ages:
  - 15
  - 17
focus: Exponential growth and decay, base e and natural exponential function, growth factor and rate, exponential equations, half-life and doubling time
difficulty: medium
learning_objectives:
  - Recognize exponential functions f(x) = a·bˣ
  - Distinguish between exponential growth and decay
  - Understand the natural exponential function f(x) = eˣ
  - Apply exponential models to growth and decay problems
  - Calculate with exponential equations
prerequisites:
  - powers-and-roots
  - linear-functions
example_tasks:
  - A bacterial culture doubles every 3 hours. If there are initially 500 bacteria, how many after 12 hours?
  - A radioactive substance has a half-life of 20 years. How much remains after 60 years?
  - Solve the equation 2ˣ = 16
real_world_context: Population growth, radioactive decay, bacterial growth, compound interest, pandemic modeling, carbon dating
---

# Exponential Functions Tasks

Create mathematics problems that explore exponential growth and decay. Problems should help students recognize exponential patterns, distinguish between linear and exponential change, model real-world exponential processes, and solve exponential equations.

**Vary the problem structure:**
- **Exponential growth**: Model situations where quantity increases by constant factor: $f(t) = a \cdot b^t$ with $b > 1$ (population doubling, compound interest, viral spread)
- **Exponential decay**: Model situations where quantity decreases by constant factor: $f(t) = a \cdot b^t$ with $0 < b < 1$ (radioactive decay, depreciation, cooling)
- **Growth factor vs. growth rate**: Convert between forms $f(t) = a(1 + r)^t$ where $r$ is rate and $b = 1 + r$ is factor
- **Doubling time problems**: Given doubling time, find amount after several doubling periods, or determine how long until amount doubles
- **Half-life problems**: Given half-life, calculate remaining amount after time periods, or find time until specific amount remains
- **Solving exponential equations**: Solve equations like $2^x = 32$, $3^x = 81$, or $5^x = 125$ by recognizing powers
- **Comparing exponential to linear**: Present scenarios and determine whether growth is linear or exponential based on description or data
- **Natural exponential function**: Introduce $e \approx 2.718$ for continuous growth: $f(t) = a \cdot e^{kt}$
- **Compound interest**: Calculate final amounts using $A = P(1 + \frac{r}{n})^{nt}$ for periodic compounding

**Vary the content/context:**
- **Biology**: Bacterial growth, cell division, virus spread, population growth of species
- **Chemistry**: Radioactive decay, carbon dating, chemical reaction rates
- **Finance**: Compound interest, investment growth, inflation, depreciation of assets
- **Medicine**: Drug concentration decay in body, epidemic spread, antibiotic resistance
- **Technology**: Moore's law (computing power doubling), data storage growth, social media user growth
- **Physics**: Radioactive substances, Newton's law of cooling, atmospheric pressure with altitude

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 16): Simple integer bases (2, 3, 5, 10), clear doubling/halving scenarios, given growth formulas, direct substitution, exponents that result in integer answers
- **For middle ages** ({{age}} 16-17): Converting between growth factor and growth rate, fractional or decimal bases, multi-step calculations, setting up exponential models from descriptions
- **For older ages** ({{age}} >= 17): Natural exponential function $e^x$, continuous compounding, solving for exponents without obvious answers, combining exponential with other functions, deriving formulas

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline: $f(x) = a \cdot b^x$, growth factor $b = 1 + r$, $f(t) = a \cdot e^{kt}$
- Block for exponential models:

$$N(t) = N_0 \cdot 2^{t/T_d}$$

$$N(t) = N_0 \cdot \left(\frac{1}{2}\right)^{t/T_h}$$

$$A = P \cdot (1 + r)^t$$

**Tables for exponential growth/decay:**

| Time (hours) | Bacteria Count |
|--------------|----------------|
| 0            | 100            |
| 3            | 200            |
| 6            | 400            |
| 9            | 800            |
| 12           | 1600           |

**SVG diagrams for exponential function graphs:**

Use SVG to show:
- Coordinate systems with exponential curves
- Growth curves (increasing, concave up)
- Decay curves (decreasing, approaching horizontal asymptote)
- Comparison of exponential vs. linear growth
- Marked points showing doubling or halving
- Horizontal asymptote (typically y = 0 for decay)

Example SVG for exponential growth function:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Coordinate system -->
  <line x1="50" y1="250" x2="350" y2="250" stroke="black" stroke-width="2"/>
  <line x1="50" y1="250" x2="50" y2="50" stroke="black" stroke-width="2"/>
  <!-- Exponential growth curve -->
  <path d="M 50 240 Q 150 180 250 80 T 340 50" fill="none" stroke="#3b82f6" stroke-width="3"/>
  <!-- Marked points -->
  <circle cx="50" cy="240" r="4" fill="#3b82f6"/>
  <circle cx="150" cy="180" r="4" fill="#3b82f6"/>
  <circle cx="250" cy="80" r="4" fill="#3b82f6"/>
  <!-- Labels -->
  <text x="180" y="280" font-size="14">t</text>
  <text x="20" y="150" font-size="14">y</text>
  <text x="260" y="70" font-size="12" fill="#3b82f6">Growth</text>
</svg>
```

Example SVG for exponential decay:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Coordinate system -->
  <line x1="50" y1="250" x2="350" y2="250" stroke="black" stroke-width="2"/>
  <line x1="50" y1="250" x2="50" y2="50" stroke="black" stroke-width="2"/>
  <!-- Exponential decay curve -->
  <path d="M 50 80 Q 150 140 250 200 T 340 240" fill="none" stroke="#ef4444" stroke-width="3"/>
  <!-- Horizontal asymptote -->
  <line x1="50" y1="245" x2="350" y2="245" stroke="#9ca3af" stroke-width="1" stroke-dasharray="5,5"/>
  <!-- Marked points -->
  <circle cx="50" cy="80" r="4" fill="#ef4444"/>
  <circle cx="150" cy="140" r="4" fill="#ef4444"/>
  <circle cx="250" cy="200" r="4" fill="#ef4444"/>
  <!-- Labels -->
  <text x="180" y="280" font-size="14">t</text>
  <text x="20" y="150" font-size="14">y</text>
  <text x="260" y="190" font-size="12" fill="#ef4444">Decay</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Simple doubling or halving with clear time periods, direct substitution into given formulas, solving basic exponential equations with small integer exponents
- **Medium**: Converting between growth rate and factor, multi-step problems, setting up exponential models from word problems, half-life and doubling time calculations
- **Hard**: Natural exponential function, continuous compounding, solving for time or rate, comparing multiple exponential models, complex real-world applications

**Include variety in numerical values:**
- Different initial amounts: $a = 100$, $a = 500$, $a = 1000$, $a = 250$
- Various growth factors: $b = 2$ (doubling), $b = 3$, $b = 1.05$, $b = 1.15$
- Different decay factors: $b = 0.5$ (halving), $b = 0.8$, $b = 0.9$
- Various time periods: 3 hours, 20 years, 5 days, 10 minutes
- Different rates: 5% growth, 15% decay, 3% increase, 8% decrease
- Ensure different numerical answers each time to prevent memorization
