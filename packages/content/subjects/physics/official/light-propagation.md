---
id: light-propagation
name: Light Propagation
description: 'Basic properties of light - propagation, shadows, and ray model'
grade: 7
ages:
  - 12
  - 13
  - 14
focus: 'Light sources, light propagation, light rays, shadows (umbra and penumbra), solar and lunar eclipses, pinhole camera, ray diagrams'
difficulty: easy
learning_objectives:
  - Apply ray model of light
  - Explain shadow formation
  - Understand rectilinear propagation of light
  - Analyze pinhole camera
prerequisites: []
example_tasks:
  - Explain why shadows become sharper when you move a light source farther away
  - Draw a ray diagram showing how a pinhole camera creates an inverted image
  - Calculate the height of a building using its shadow length and sun angle
real_world_context: 'Sundials, shadow art, pinhole photography, solar eclipses, architectural lighting design'
---

# Light Propagation Tasks

Create physics problems that explore how light travels and interacts with objects to form shadows. Problems should help students understand the ray model of light, rectilinear propagation, and shadow formation phenomena.

**Vary the problem structure:**
- **Shadow formation with point light sources**: Analyze sharp shadows (umbra) created by small light sources, calculate shadow sizes using similar triangles
- **Shadow formation with extended light sources**: Explain fuzzy shadows with umbra (full shadow) and penumbra (partial shadow) regions, determine penumbra width
- **Pinhole camera analysis**: Explain image inversion, calculate image size using ray diagrams and similar triangles with formula $\frac{h_{\text{image}}}{h_{\text{object}}} = \frac{d_{\text{screen}}}{d_{\text{object}}}$
- **Eclipse phenomena**: Describe solar and lunar eclipses using light ray diagrams, explain why eclipses don't happen every month, distinguish total and partial eclipses
- **Ray diagram construction**: Draw light ray paths from sources through openings or around obstacles, showing rectilinear propagation
- **Shadow length calculations**: Use sun angle and object height to calculate shadow length with $\text{shadow length} = \frac{\text{height}}{\tan(\text{angle})}$
- **Light propagation in space**: Explain why light travels in straight lines, speed of light concepts (8 minutes from sun to Earth)
- **Multiple light sources**: Analyze shadow patterns when multiple light sources illuminate an object, identify overlapping umbra and penumbra regions

**Vary the content/context:**
- **Everyday shadows**: Shadows from streetlamps, shadows under trees, sundials, shadow puppets
- **Astronomical phenomena**: Solar eclipses, lunar eclipses, phases of the moon, shadows on other planets
- **Photography**: Pinhole cameras, camera obscura, historical photography techniques
- **Architecture and design**: Building shadows, shadow art installations, shadow calculations for solar panels
- **Nature**: Tree shadows, mountain shadows at sunrise/sunset, animal shadows
- **Technology**: Shadow detection in robotics, optical sensors, shadow removal in image processing

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 13): Focus on qualitative shadow observations, simple ray diagrams with straight lines, identifying light sources and shadows, basic pinhole camera concept without calculations
- **For middle ages** ({{age}} 13-14): Introduce shadow size calculations with similar triangles, quantitative pinhole camera problems, eclipse diagrams, distinguish umbra and penumbra
- **For older ages** ({{age}} >= 15): Complex multi-source problems, precise angle calculations with trigonometry, detailed eclipse geometry, combine shadow concepts with other optics principles

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for relationships: Image size $\frac{h_i}{h_o} = \frac{d_i}{d_o}$, speed of light $c = 3 \times 10^8 \frac{m}{s}$
- Block for geometric relationships:

$$\frac{\text{shadow width}}{\text{object width}} = \frac{\text{distance to screen}}{\text{distance to object}}$$

$$\text{shadow length} = h \cdot \frac{d}{r}$$

where $h$ is object height, $d$ is distance from light to screen, $r$ is distance from light to object.

**Tables for shadow data:**

| Object Height (cm) | Distance to Light (m) | Shadow Length (m) |
|--------------------|----------------------|-------------------|
| 50                 | 2                    | 3.5               |
| 100                | 3                    | 4.2               |
| 180                | 4                    | 5.8               |

**SVG diagrams for light ray visualization:**

Use SVG to show:
- Light rays emanating from point sources with arrows
- Shadow formation with umbra and penumbra regions (different shading)
- Pinhole camera ray diagrams showing image inversion
- Eclipse geometry with Earth, Moon, and Sun positions
- Multiple light source scenarios with overlapping shadows
- Similar triangle constructions for shadow calculations

Example SVG for shadow formation:
```svg
<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Light source -->
  <circle cx="50" cy="100" r="15" fill="#fbbf24" stroke="black" stroke-width="2"/>
  <!-- Object casting shadow -->
  <rect x="200" y="150" width="30" height="100" fill="#374151"/>
  <!-- Ground line -->
  <line x1="0" y1="250" x2="500" y2="250" stroke="black" stroke-width="2"/>
  <!-- Light rays -->
  <line x1="50" y1="100" x2="200" y2="150" stroke="#fbbf24" stroke-width="2" stroke-dasharray="5,5"/>
  <line x1="50" y1="100" x2="450" y2="250" stroke="#fbbf24" stroke-width="2" stroke-dasharray="5,5"/>
  <!-- Shadow region -->
  <polygon points="230,250 450,250 230,150" fill="black" opacity="0.3"/>
  <!-- Labels -->
  <text x="40" y="80" font-size="12">Light</text>
  <text x="195" y="140" font-size="12">Object</text>
  <text x="320" y="270" font-size="12">Shadow</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Qualitative shadow descriptions, simple ray diagrams, identify light sources and shadows, basic pinhole camera demonstration without math
- **Medium**: Shadow size calculations with given formulas, pinhole camera calculations using similar triangles, eclipse diagrams with labels, distinguish umbra and penumbra
- **Hard**: Derive shadow formulas from geometry, complex multi-source problems, trigonometric calculations for sun angles, predict eclipse visibility from different locations

**Include variety in numerical values:**
- Different object heights: 20 cm, 1.5 m, 3 m, 50 cm
- Vary distances to light: 1 m, 2.5 m, 50 cm, 4 m
- Different pinhole distances: 10 cm, 25 cm, 5 cm
- Shadow lengths: 80 cm, 2.3 m, 1.2 m, 4.5 m
- Sun angles: 30°, 45°, 60°, 20°
- Ensure different numerical answers each time to prevent memorization
