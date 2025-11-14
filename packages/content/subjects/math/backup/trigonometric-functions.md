---
id: trigonometric-functions
name: Trigonometric Functions
description: Understanding sine, cosine, and tangent functions with periodic behavior
grade: 10
ages:
  - 15
  - 18
focus: Sine, cosine, and tangent functions, amplitude, period, phase shift, unit circle and radian measure, trigonometric identities
difficulty: hard
learning_objectives:
  - Understand trigonometric functions as periodic functions
  - Graph sine, cosine, and tangent functions
  - Determine amplitude, period, phase shift, and vertical shift
  - Apply trigonometric functions to modeling periodic phenomena
  - Solve trigonometric equations
prerequisites:
  - right-triangle-trigonometry
  - radians
example_tasks:
  - Graph f(x) = 2sin(x) and identify the amplitude
  - Find the period of f(x) = cos(3x)
  - Model a pendulum's motion with height h(t) = 5cos(2πt/3) + 10
real_world_context: Sound waves, light waves, seasonal temperature variation, tides, pendulum motion, AC circuits
---

# Trigonometric Functions Tasks

Create mathematics problems that explore periodic trigonometric functions. Problems should help students understand sine, cosine, and tangent as functions of angles, graph these functions with various transformations, identify key parameters, and model periodic real-world phenomena.

**Vary the problem structure:**
- **Basic sine function**: Graph $f(x) = \sin(x)$ showing period $2\pi$, amplitude 1, oscillation between -1 and 1, zeros at $0, \pi, 2\pi$
- **Basic cosine function**: Graph $f(x) = \cos(x)$ showing period $2\pi$, amplitude 1, starts at maximum (1, 0)
- **Basic tangent function**: Graph $f(x) = \tan(x)$ showing period $\pi$, vertical asymptotes at $x = \pm\frac{\pi}{2}$, passes through origin
- **Amplitude changes**: Analyze $f(x) = a\sin(x)$ where $|a|$ is amplitude (vertical stretch), sign determines reflection
- **Period changes**: For $f(x) = \sin(bx)$, period is $\frac{2\pi}{|b|}$; larger $|b|$ means shorter period (more oscillations)
- **Phase shift**: Analyze $f(x) = \sin(x - c)$ where $c$ shifts graph horizontally right ($c > 0$) or left ($c < 0$)
- **Vertical shift**: For $f(x) = \sin(x) + d$, graph shifts up ($d > 0$) or down ($d < 0$), centering around $y = d$
- **General form**: Analyze $f(x) = a\sin(b(x - c)) + d$ identifying all four parameters and their effects
- **Solving trigonometric equations**: Find x-values where $\sin(x) = \frac{1}{2}$ or $\cos(x) = 0$ in given intervals
- **Unit circle connection**: Relate trigonometric function values to coordinates on unit circle
- **Radian vs. degree measure**: Convert between radians and degrees using $180° = \pi$ radians

**Vary the content/context:**
- **Sound waves**: Model sound pressure variation with sine functions, frequency determines pitch, amplitude determines loudness
- **Light waves**: Electromagnetic radiation modeled as sine/cosine, wavelength related to period
- **Seasonal temperatures**: Annual temperature cycle modeled with cosine, $T(t) = A\cos(b(t - c)) + D$ where t is month
- **Tides**: Ocean water level variation with period approximately 12.4 hours
- **Pendulum motion**: Height or horizontal position as function of time following sinusoidal pattern
- **AC circuits**: Alternating current and voltage as sine functions with frequency 50 or 60 Hz
- **Ferris wheel**: Height of rider as function of time following circular motion

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 16): Basic sine and cosine graphs with $a = 1, b = 1$, identifying amplitude and period from standard forms, degree measure
- **For middle ages** ({{age}} 16-17): Transformations with $a$ and $b$ parameters, radian measure, simple phase shifts, modeling with guided setup, solving basic trig equations
- **For older ages** ({{age}} >= 17): General form with all parameters, complex transformations, deriving models from data, solving equations in intervals, trigonometric identities

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline: $f(x) = \sin(x)$, $f(x) = a\sin(b(x - c)) + d$, period $T = \frac{2\pi}{b}$
- Block for trigonometric function forms:

$$f(x) = 3\sin(2x - \pi) + 1$$

$$\text{Amplitude: } |a| = 3$$

$$\text{Period: } T = \frac{2\pi}{2} = \pi$$

$$\text{Phase shift: } c = \frac{\pi}{2} \text{ (right)}$$

$$\text{Vertical shift: } d = 1$$

**Tables for trigonometric values:**

| x (radians) | sin(x) | cos(x) | tan(x)     |
|-------------|--------|--------|------------|
| 0           | 0      | 1      | 0          |
| π/6         | 0.5    | 0.866  | 0.577      |
| π/4         | 0.707  | 0.707  | 1          |
| π/3         | 0.866  | 0.5    | 1.732      |
| π/2         | 1      | 0      | undefined  |

**SVG diagrams for trigonometric function graphs:**

Use SVG to show:
- Coordinate systems with proper scale showing multiples of π
- Sine/cosine curves showing complete periods
- Amplitude marked as distance from center line to peak
- Period marked as horizontal distance between repeating points
- Phase shifts shown by horizontal translation
- Vertical shifts shown by center line movement
- Tangent function with vertical asymptotes

Example SVG for sine function with transformations:
```svg
<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Coordinate system -->
  <line x1="50" y1="150" x2="450" y2="150" stroke="black" stroke-width="2"/>
  <line x1="50" y1="250" x2="50" y2="50" stroke="black" stroke-width="2"/>
  <!-- Grid marks for π intervals -->
  <line x1="150" y1="245" x2="150" y2="255" stroke="black" stroke-width="1"/>
  <text x="140" y="270" font-size="12">π</text>
  <line x1="250" y1="245" x2="250" y2="255" stroke="black" stroke-width="1"/>
  <text x="237" y="270" font-size="12">2π</text>
  <!-- Sine curve -->
  <path d="M 50 150 Q 100 50 150 150 Q 200 250 250 150 Q 300 50 350 150 Q 400 250 450 150"
        fill="none" stroke="#3b82f6" stroke-width="3"/>
  <!-- Amplitude markers -->
  <line x1="50" y1="50" x2="70" y2="50" stroke="#ef4444" stroke-width="1"/>
  <line x1="50" y1="250" x2="70" y2="250" stroke="#ef4444" stroke-width="1"/>
  <text x="25" y="55" font-size="12" fill="#ef4444">A</text>
  <text x="25" y="255" font-size="12" fill="#ef4444">-A</text>
  <!-- Labels -->
  <text x="460" y="155" font-size="14">x</text>
  <text x="30" y="45" font-size="14">y</text>
</svg>
```

Example SVG comparing sine and cosine:
```svg
<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Coordinate system -->
  <line x1="50" y1="150" x2="450" y2="150" stroke="black" stroke-width="2"/>
  <line x1="50" y1="250" x2="50" y2="50" stroke="black" stroke-width="2"/>
  <!-- Sine curve -->
  <path d="M 50 150 Q 100 50 150 150 Q 200 250 250 150 Q 300 50 350 150"
        fill="none" stroke="#3b82f6" stroke-width="2"/>
  <text x="360" y="150" font-size="12" fill="#3b82f6">sin(x)</text>
  <!-- Cosine curve -->
  <path d="M 50 50 Q 100 150 150 250 Q 200 150 250 50 Q 300 150 350 250"
        fill="none" stroke="#10b981" stroke-width="2"/>
  <text x="360" y="260" font-size="12" fill="#10b981">cos(x)</text>
  <!-- Labels -->
  <text x="460" y="155" font-size="14">x</text>
  <text x="30" y="45" font-size="14">y</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Basic sine/cosine graphs with standard amplitude and period, identifying amplitude and period from simple forms, degree measure
- **Medium**: Graphs with amplitude and period changes, converting between radians and degrees, simple phase and vertical shifts, basic modeling problems
- **Hard**: General form with all four transformations, solving trigonometric equations in intervals, deriving models from real-world data, combining trig functions, identities

**Include variety in numerical values:**
- Different amplitudes: $a = 2, 3, 5, 0.5, -2$
- Various periods via b: $b = 2$ (period $\pi$), $b = 0.5$ (period $4\pi$), $b = 3$ (period $\frac{2\pi}{3}$)
- Phase shifts: $c = \frac{\pi}{4}, \frac{\pi}{2}, \pi, -\frac{\pi}{3}$
- Vertical shifts: $d = 1, 2, -1, 3, 5$
- Real-world units: meters, degrees Celsius, centimeters, volts
- Time periods: seconds, hours, months, years
- Ensure different numerical answers each time to prevent memorization
