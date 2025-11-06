---
id: curve-sketching
name: Curve Sketching (Kurvendiskussion)
description: Complete analysis of functions including domain, zeros, extrema, inflection points, and asymptotes
grade: 11
ages:
  - 16
  - 17
  - 18
  - 19
focus: Domain and range analysis, zeros and y-intercept, symmetry, monotonicity using first derivative, extrema using first and second derivatives, concavity and inflection points, asymptotic behavior
difficulty: hard
learning_objectives:
  - Determine domain and range systematically
  - Find zeros and y-intercept
  - Analyze symmetry properties
  - Determine extrema and inflection points
  - Identify asymptotes and end behavior
  - Create accurate function sketches
prerequisites:
  - derivatives
  - derivative-applications
  - limits-continuity
example_tasks:
  - Perform a complete curve analysis for f(x) = x³ - 3x² + 2
  - Analyze the rational function f(x) = (x² - 1)/(x² - 4) including asymptotes
  - Sketch the graph of f(x) = x·e⁻ˣ after analyzing all properties
real_world_context: Analyzing business functions, understanding scientific models, engineering design curves
---

# Curve Sketching (Kurvendiskussion) Tasks

Create comprehensive function analysis problems following the German Kurvendiskussion tradition. Problems should guide students through systematic, complete analysis of functions including all key properties, culminating in an accurate sketch. This integrates differentiation, limits, and algebraic techniques.

**Vary the problem structure:**
- **Domain analysis**: Determine $D_f = \{x \in \mathbb{R} : f(x) \text{ is defined}\}$, exclude division by zero, negative values under even roots
- **Zeros**: Solve $f(x) = 0$ by factoring, quadratic formula, or numerical methods
- **Y-intercept**: Evaluate $f(0)$ if $0 \in D_f$
- **Symmetry**: Test for even function $f(-x) = f(x)$ (y-axis symmetry) or odd function $f(-x) = -f(x)$ (origin symmetry)
- **Behavior at boundaries**: Calculate $\lim_{x \to \infty} f(x)$ and $\lim_{x \to -\infty} f(x)$ for end behavior
- **Vertical asymptotes**: Find $\lim_{x \to a} f(x) = \pm\infty$ at points outside domain
- **Horizontal asymptotes**: Determine if $\lim_{x \to \pm\infty} f(x) = L$ exists
- **Oblique asymptotes**: For rational functions, perform polynomial division to find $y = mx + b$ asymptote
- **First derivative**: Calculate $f'(x)$, find critical points where $f'(x) = 0$ or undefined
- **Monotonicity**: Analyze sign of $f'(x)$ to find intervals where function increases $(f'(x) > 0)$ or decreases $(f'(x) < 0)$
- **Extrema**: Classify critical points using first or second derivative test
- **Second derivative**: Calculate $f''(x)$, find potential inflection points where $f''(x) = 0$
- **Concavity**: Determine where $f''(x) > 0$ (concave up/convex) or $f''(x) < 0$ (concave down/concave)
- **Inflection points**: Verify concavity change at candidate points
- **Complete sketch**: Combine all information to draw accurate graph with labeled key points

**Vary the content/context:**
- **Polynomial functions**: Cubic $f(x) = ax^3 + bx^2 + cx + d$, quartic functions with multiple extrema
- **Rational functions**: $f(x) = \frac{p(x)}{q(x)}$ with vertical and horizontal/oblique asymptotes
- **Exponential combinations**: $f(x) = x \cdot e^x$, $f(x) = e^{-x^2}$, growth-decay models
- **Logarithmic functions**: $f(x) = x \ln(x)$, $f(x) = \frac{\ln(x)}{x}$
- **Trigonometric functions**: $f(x) = x + \sin(x)$, $f(x) = \frac{\sin(x)}{x}$
- **Mixed functions**: Combinations like $f(x) = x^2 e^{-x}$, $f(x) = \frac{x^2}{x^2 + 1}$
- **Applied contexts**: Profit functions, cost functions, population models, concentration curves
- **Pure analysis**: Functions chosen for interesting features (multiple inflection points, complex symmetry)

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 17): Polynomial functions (cubic), simple rational functions with clear asymptotes, straightforward extrema, focus on systematic process
- **For middle ages** ({{age}} 17-18): Rational functions with oblique asymptotes, exponential combinations, functions with multiple extrema and inflection points, complete monotonicity and concavity analysis
- **For older ages** ({{age}} >= 19): Complex rational functions requiring polynomial division, logarithmic and trigonometric combinations, parameter-dependent functions, global behavior analysis, proofs of properties

**Use appropriate formats:**

**LaTeX for formulas:**
- Domain notation: $D_f = \mathbb{R} \setminus \{-2, 2\}$ or $D_f = (0, \infty)$
- Kurvendiskussion structure in block form:

**Complete Curve Analysis Template:**

**1. Domain:**
$$D_f = \{x \in \mathbb{R} : \text{conditions}\}$$

**2. Zeros:** Solve $f(x) = 0$

**3. Y-intercept:** $f(0) = ?$

**4. Symmetry:** Test $f(-x) = ?$

**5. Behavior at infinity:**
$$\lim_{x \to \infty} f(x) = ?, \quad \lim_{x \to -\infty} f(x) = ?$$

**6. Asymptotes:**
- Vertical: $\lim_{x \to a^\pm} f(x) = ?$
- Horizontal/Oblique: $y = ?$

**7. First derivative:** $f'(x) = ?$

**8. Critical points:** Solve $f'(x) = 0$

**9. Monotonicity:**
| Interval | $f'(x)$ | Behavior |
|----------|---------|----------|
| ...      | $+/-$   | ↗/↘      |

**10. Extrema:**
- Local maximum at $x = ?$: $f(?) = ?$
- Local minimum at $x = ?$: $f(?) = ?$

**11. Second derivative:** $f''(x) = ?$

**12. Inflection points:** Solve $f''(x) = 0$ and verify

**13. Concavity:**
| Interval | $f''(x)$ | Concavity |
|----------|----------|-----------|
| ...      | $+/-$    | ∪/∩       |

**Tables for sign analysis:**

| $x$ | $(-\infty, -1)$ | $-1$ | $(-1, 2)$ | $2$ | $(2, \infty)$ |
|-----|-----------------|------|-----------|-----|---------------|
| $f'(x)$ | $+$ | $0$ | $-$ | $0$ | $+$ |
| $f(x)$ | ↗ | max | ↘ | min | ↗ |

**SVG diagrams for complete graph:**

Use SVG to show:
- Complete function graph with all analysis results visible
- Marked zeros (x-intercepts) and y-intercept
- Local maxima and minima with coordinates labeled
- Inflection points marked and labeled
- Vertical asymptotes as dashed lines
- Horizontal or oblique asymptotes as dashed lines
- Arrows showing end behavior
- Shaded regions or symbols indicating increasing/decreasing intervals
- Concavity indicated visually (curves up/down)
- Coordinate system with appropriate scale

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Polynomial functions (cubic) with integer coefficients and rational zeros, clear extrema, straightforward monotonicity, no asymptotes
- **Medium**: Rational functions with vertical and horizontal asymptotes, polynomial functions with irrational zeros, exponential combinations, multiple extrema and one inflection point
- **Hard**: Rational functions with oblique asymptotes requiring polynomial division, complex domain restrictions, functions with parameters, multiple inflection points, subtle symmetry properties, global optimization

**Include variety in numerical values:**
- Different polynomial coefficients avoiding always using 1, 2, 3
- Various degrees: cubic, quartic, quintic polynomials
- Multiple types of rational functions: proper and improper
- Different asymptote locations: $x = 1$, $x = -2$, $y = 3$, $y = 2x + 1$
- Varied zero locations: integers, fractions, irrational values
- Different extrema and inflection point coordinates
- Range of exponential bases and coefficients
- Ensure each function has unique combination of features requiring full analysis
