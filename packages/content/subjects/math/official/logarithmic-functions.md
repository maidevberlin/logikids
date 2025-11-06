---
id: logarithmic-functions
name: Logarithmic Functions
description: Understanding logarithms as inverse of exponential functions with applications
grade: 10
ages:
  - 15
  - 16
  - 17
focus: Logarithm definition and notation, logarithm laws, natural logarithm and common logarithm, solving exponential equations, logarithmic scales
difficulty: medium
learning_objectives:
  - Understand logarithms as inverse operations to exponentiation
  - Apply logarithm laws for calculation
  - Solve exponential equations using logarithms
  - Work with natural logarithm (ln) and common logarithm (log)
  - Graph logarithmic functions
prerequisites:
  - exponential-functions
  - powers-and-roots
example_tasks:
  - Solve for x in the equation 2ˣ = 50 using logarithms
  - Calculate log₂(32)
  - Simplify log(100) + log(10)
real_world_context: pH scale, Richter scale (earthquakes), decibel scale (sound), carbon dating calculations, investment growth
---

# Logarithmic Functions Tasks

Create mathematics problems that explore logarithms as the inverse of exponential functions. Problems should help students understand logarithm notation, apply logarithm laws for calculations, solve exponential equations, and recognize logarithmic scales in real-world applications.

**Vary the problem structure:**
- **Basic logarithm evaluation**: Calculate simple logarithms like $\log_2(8)$, $\log_3(27)$, $\log_{10}(1000)$ by asking "what power gives this result?"
- **Converting between exponential and logarithmic form**: Rewrite $2^5 = 32$ as $\log_2(32) = 5$ and vice versa
- **Logarithm laws - product rule**: Apply $\log_b(xy) = \log_b(x) + \log_b(y)$ to simplify or calculate
- **Logarithm laws - quotient rule**: Apply $\log_b(\frac{x}{y}) = \log_b(x) - \log_b(y)$
- **Logarithm laws - power rule**: Apply $\log_b(x^n) = n \cdot \log_b(x)$
- **Solving exponential equations**: Use logarithms to solve equations like $3^x = 50$ or $2^{x+1} = 100$
- **Natural logarithm (ln)**: Work with base $e$ logarithms, understanding $\ln(e^x) = x$ and $e^{\ln(x)} = x$
- **Common logarithm (log)**: Use base 10 logarithms for practical calculations
- **Graphing logarithmic functions**: Plot $f(x) = \log_b(x)$ showing domain $(0, \infty)$, vertical asymptote at $x = 0$, and passing through $(1, 0)$
- **Change of base formula**: Convert logarithms between bases using $\log_b(x) = \frac{\log_a(x)}{\log_a(b)}$

**Vary the content/context:**
- **pH scale**: Calculate pH from hydrogen ion concentration using $pH = -\log_{10}[H^+]$, interpret acidity
- **Richter scale**: Compare earthquake magnitudes using logarithmic scale where each unit represents 10x amplitude increase
- **Decibel scale**: Sound intensity measured logarithmically: $L = 10 \log_{10}(\frac{I}{I_0})$
- **Carbon dating**: Determine age of artifacts using decay equations and logarithms
- **Investment calculations**: Find time needed for investment to reach target using compound interest and logarithms
- **Bacterial growth**: Determine time for population to reach certain size using exponential growth and logarithms

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 16): Simple integer logarithms with small bases (2, 3, 10), direct evaluation where answer is obvious, basic conversion between exponential and log forms
- **For middle ages** ({{age}} 16-17): Applying logarithm laws for simplification, solving exponential equations with logarithms, natural and common logarithms, real-world applications with guided setup
- **For older ages** ({{age}} >= 17): Change of base formula, complex logarithmic expressions, solving equations with logarithms on both sides, deriving logarithmic models from data

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline: $\log_b(x)$, $\ln(x) = \log_e(x)$, $\log(x) = \log_{10}(x)$
- Block for logarithm laws and calculations:

$$\log_b(xy) = \log_b(x) + \log_b(y)$$

$$\log_b\left(\frac{x}{y}\right) = \log_b(x) - \log_b(y)$$

$$\log_b(x^n) = n \cdot \log_b(x)$$

**Tables for logarithm values:**

| x    | log₂(x) | log₁₀(x) |
|------|---------|----------|
| 1    | 0       | 0        |
| 2    | 1       | 0.301    |
| 4    | 2       | 0.602    |
| 8    | 3       | 0.903    |
| 16   | 4       | 1.204    |

**SVG diagrams for logarithmic function graphs:**

Use SVG to show:
- Coordinate systems with logarithmic curves
- Vertical asymptote at x = 0 (dashed line)
- Function passing through point (1, 0)
- Increasing but decelerating growth
- Comparison of logarithms with different bases
- Relationship between exponential and logarithmic functions (reflection over y = x)

Example SVG for logarithmic function:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Coordinate system -->
  <line x1="50" y1="250" x2="350" y2="250" stroke="black" stroke-width="2"/>
  <line x1="50" y1="250" x2="50" y2="50" stroke="black" stroke-width="2"/>
  <!-- Vertical asymptote at x = 0 -->
  <line x1="50" y1="250" x2="50" y2="50" stroke="#ef4444" stroke-width="1" stroke-dasharray="5,5"/>
  <!-- Logarithmic curve -->
  <path d="M 52 250 Q 80 180 120 130 Q 200 80 340 40" fill="none" stroke="#3b82f6" stroke-width="3"/>
  <!-- Point (1, 0) -->
  <circle cx="90" cy="250" r="4" fill="#3b82f6"/>
  <text x="95" y="245" font-size="12">(1,0)</text>
  <!-- Labels -->
  <text x="180" y="280" font-size="14">x</text>
  <text x="20" y="150" font-size="14">y</text>
  <text x="250" y="30" font-size="12" fill="#3b82f6">y = log(x)</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Simple integer logarithms with obvious answers, basic conversion between forms, evaluating $\log_{10}(10)$, $\log_2(8)$, etc.
- **Medium**: Applying one or two logarithm laws, solving exponential equations with logarithms, natural and common logarithms, simple real-world problems
- **Hard**: Combining multiple logarithm laws, change of base formula, solving complex logarithmic equations, setting up and solving real-world problems requiring logarithms

**Include variety in numerical values:**
- Different bases: base 2, base 3, base 5, base 10, base $e$
- Various arguments: $x = 8, 27, 125, 1000, 16, 64, 81$
- Real-world measurements: pH values 1-14, Richter scale 2-9, decibel levels 0-120
- Time periods: years for decay, hours for bacteria, centuries for dating
- Growth/decay rates: 2%, 5%, 8%, 12% annual rates
- Ensure different numerical answers each time to prevent memorization
