---
id: proportional-relationships
name: Proportional Relationships
description: Understanding direct and inverse proportionality and solving problems using the rule of three
grade: 7
ages:
  - 12
  - 14
focus: Direct proportionality, inverse proportionality, rule of three, proportional reasoning, scale calculations
difficulty: easy
learning_objectives:
  - Recognize proportional and inversely proportional relationships
  - Apply the rule of three (Dreisatz) to solve problems
  - Create and interpret proportion tables
  - Distinguish between proportional and non-proportional relationships
  - Model real-world situations with proportional relationships
prerequisites: []
example_tasks:
  - If 3 kg of apples cost €6, how much do 7 kg cost?
  - A recipe for 4 people uses 200g flour. How much flour is needed for 10 people?
  - 5 workers complete a job in 12 days. How long would 8 workers take?
real_world_context: Recipe scaling, currency exchange, map scales, speed-time-distance problems, work rate problems, fuel consumption, unit pricing
---

# Proportional Relationships Tasks

Create mathematics problems that develop understanding of proportional reasoning and the rule of three (Dreisatz). Problems should help students recognize when quantities are directly or inversely proportional, set up proportion calculations correctly, and apply proportional thinking to practical situations.

**Vary the problem structure:**
- **Direct proportionality with rule of three**: If 5 notebooks cost €8, how much do 12 notebooks cost? Set up: $\frac{5 \text{ notebooks}}{€8} = \frac{12 \text{ notebooks}}{x}$
- **Recipe scaling**: Recipe for 4 people uses 300g flour. How much for 6 people? Double for 8 people? Half for 2 people?
- **Unit rate problems**: Find cost per kilogram, price per liter, speed in km/h, then calculate for different quantities
- **Currency exchange**: If €5 equals $6, how many dollars is €35? Set up proportion table
- **Map scale problems**: Map scale 1:50,000 means 2 cm on map equals 1 km in reality. What distance does 7 cm represent?
- **Speed-distance-time**: Car travels 180 km in 2 hours. How far in 5 hours at same speed? Use $\frac{d_1}{t_1} = \frac{d_2}{t_2}$
- **Inverse proportionality**: 4 workers need 12 days for a job. How many days for 6 workers? Use $w_1 \times d_1 = w_2 \times d_2$
- **Fuel consumption**: Car uses 7 liters per 100 km. How much fuel for 350 km journey?
- **Proportion tables**: Complete tables showing proportional relationships, identify the constant ratio

**Vary the content/context:**
- **Shopping**: Unit pricing (comparing €2.50 per kg vs €4 per kg), quantity discounts, bulk buying, finding better value
- **Cooking**: Recipe scaling (from 4 to 6 people, from 2 to 5 people), ingredient ratios, portion adjustments
- **Travel**: Fuel consumption rates, distance-time-speed relationships, currency conversions for trips, map distances
- **Construction**: Mixing concrete (cement:sand:gravel ratios like 1:2:3), paint coverage (1 liter covers 8 m²), material quantities
- **Work problems**: Workers completing jobs (more workers = less time for inverse), productivity rates, team projects
- **School**: Photocopying (3 minutes for 75 copies, how long for 200 copies?), supply ordering for different class sizes
- **Nature**: Growth rates, shadow lengths at different times (similar triangles), animal populations

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 13): Direct proportionality only, simple whole number ratios, clear context, one-step rule of three, visual proportion tables, unit rates that result in whole numbers
- **For middle ages** ({{age}} 13-14): Both direct and inverse proportionality, distinguishing between them, multi-step problems, decimal results, map scales, recognizing non-proportional relationships
- **For older ages** ({{age}} >= 14): Complex proportionality problems, combined direct and inverse proportions, scale factor applications, word problems requiring careful analysis, graph interpretation

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for proportions: $\frac{3 \text{ kg}}{€6} = \frac{7 \text{ kg}}{x}$, Calculate $x$
- Block for rule of three setup:

$$\text{If } 5 \text{ notebooks cost } €8$$
$$\text{Then } 1 \text{ notebook costs } \frac{€8}{5} = €1.60$$
$$\text{So } 12 \text{ notebooks cost } 12 \times €1.60 = €19.20$$

**Direct proportionality:** $y = k \times x$ where $k$ is constant

**Inverse proportionality:** $y = \frac{k}{x}$ where $k$ is constant

**Tables for proportional relationships:**

| Apples (kg) | Price (€) |
|-------------|-----------|
| 2 | 4 |
| 3 | 6 |
| 5 | 10 |
| 8 | 16 |

**Ratio constant:** $\frac{€}{kg} = 2$ (always the same)

**SVG diagrams for visual representation:**

Use SVG to show:
- Proportion tables with highlighted patterns
- Graph of direct proportionality (straight line through origin)
- Graph of inverse proportionality (hyperbola)
- Map scale visualizations with ruler
- Recipe ingredient ratios as bar comparisons

Example SVG for direct proportionality graph:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Axes -->
  <line x1="50" y1="250" x2="350" y2="250" stroke="black" stroke-width="2"/>
  <line x1="50" y1="250" x2="50" y2="50" stroke="black" stroke-width="2"/>
  <!-- Proportional line through origin -->
  <line x1="50" y1="250" x2="320" y2="80" stroke="#3b82f6" stroke-width="3"/>
  <!-- Points -->
  <circle cx="110" cy="210" r="5" fill="#3b82f6"/>
  <circle cx="170" cy="170" r="5" fill="#3b82f6"/>
  <circle cx="230" cy="130" r="5" fill="#3b82f6"/>
  <!-- Labels -->
  <text x="180" y="280" font-size="14">Quantity</text>
  <text x="10" y="150" font-size="14">Price</text>
  <text x="280" y="70" font-size="12" fill="#3b82f6">Direct proportion</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Direct proportionality only, simple whole number ratios (2:4, 3:6), one-step rule of three, whole number answers, clear context with all information provided, visual tables available
- **Medium**: Both direct and inverse proportionality, identifying which type to use, ratios with decimals, two-step problems, map scales, comparing different proportional relationships
- **Hard**: Complex word problems requiring setup, combined proportions, scale factor applications, distinguishing proportional from non-proportional relationships, optimization problems (best value comparisons)

**Include variety in numerical values:**
- Different quantities: 3 kg, 5 liters, 12 people, 8 workers, 250 meters, 4.5 hours
- Vary prices: €4, €12.50, €8.75, €25, €150
- Ratios: 2:3, 1:4, 3:5, 5:8, 1:2:3 (three quantities)
- Map scales: 1:50,000, 1:100,000, 1:25,000, 1:200,000
- Speeds: 60 km/h, 80 km/h, 15 m/s, 450 km/h (airplane)
- Work rates: 6 workers, 8 days, 12 hours, 15 machines
- Recipe multiples: ×1.5, ×2, ×0.5, ×2.5
- Fuel rates: 6 L/100km, 7.5 L/100km, 5.2 L/100km
- Ensure varied contexts and answer values to build flexible reasoning
