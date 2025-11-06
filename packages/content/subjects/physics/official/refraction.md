---
id: refraction
name: Refraction
description: 'Refraction of light at boundaries between media, lenses, and optical instruments'
grade: 8
ages:
  - 13
  - 14
  - 15
focus: 'Refraction, Snell''s law, total internal reflection, fiber optics, converging and diverging lenses, focal length, lens equation, real and virtual images, eye structure, vision correction (myopia/hyperopia), magnifying glass, microscope, telescope'
difficulty: medium
learning_objectives:
  - Explain refraction phenomena
  - Apply Snell's law qualitatively
  - Analyze lens imaging (real and virtual images)
  - Understand optical instruments
prerequisites:
  - light-propagation
  - reflection
example_tasks:
  - Explain why a straw appears bent in a glass of water
  - Calculate where a converging lens with focal length 10 cm forms an image of an object 30 cm away
  - Describe how eyeglasses correct nearsightedness
real_world_context: 'Eyeglasses and contact lenses, cameras, microscopes, telescopes, fiber optic communication, mirages, rainbows'
---

# Refraction Tasks

Create physics problems that explore how light bends when passing between different media and how lenses form images. Problems should help students understand refraction phenomena, lens behavior, and applications in optical instruments including vision correction.

**Vary the problem structure:**
- **Qualitative refraction analysis**: Explain why light bends toward normal when entering denser medium (air → water) and away from normal when entering less dense medium (water → air)
- **Snell's law applications** (qualitative or with given indices): $n_1 \sin(\theta_1) = n_2 \sin(\theta_2)$, analyze refraction angles at air-water, air-glass boundaries
- **Total internal reflection**: Calculate critical angle $\theta_c = \arcsin\left(\frac{n_2}{n_1}\right)$ for glass-air or water-air, explain fiber optic operation
- **Converging lens ray diagrams**: Use three principal rays (parallel, focal, center) to locate real or virtual images formed by convex lenses
- **Diverging lens ray diagrams**: Construct diagrams showing virtual image formation with concave lenses
- **Thin lens equation problems**: Use $\frac{1}{f} = \frac{1}{d_o} + \frac{1}{d_i}$ to calculate image position, object position, or focal length
- **Magnification calculations**: Calculate $M = -\frac{d_i}{d_o} = \frac{h_i}{h_o}$, determine image size and orientation
- **Eye and vision correction**: Analyze myopia (nearsightedness) requiring diverging lenses, hyperopia (farsightedness) requiring converging lenses
- **Optical instruments**: Explain magnifying glass (object inside focal length → virtual enlarged image), microscope (two converging lenses), telescope (objective + eyepiece)
- **Everyday refraction**: Explain apparent depth in water, mirages, atmospheric refraction, apparent position of stars

**Vary the content/context:**
- **Water and liquids**: Objects appearing shallower in water, bent appearance of submerged objects, aquarium viewing
- **Vision and eyes**: Eye structure (cornea, lens, retina), accommodation, nearsightedness and farsightedness correction
- **Optical instruments**: Magnifying glasses, binoculars, microscopes, telescopes, cameras, projectors
- **Fiber optics**: Internet cables, medical endoscopes, illumination systems, telecommunications
- **Atmospheric phenomena**: Mirages on hot roads, atmospheric refraction at sunrise/sunset, green flash
- **Gemstones and prisms**: Diamond brilliance, prism light paths, optical quality of materials
- **Eyewear**: Prescription glasses, reading glasses, safety glasses, sunglasses

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 14): Focus on qualitative refraction (light bends at boundaries), basic lens identification (converging vs. diverging), simple ray diagrams, explain eyeglasses without calculations
- **For middle ages** ({{age}} 14-15): Introduce thin lens equation with straightforward calculations, magnification problems, detailed ray diagrams with three rays, qualitative Snell's law, basic vision correction
- **For older ages** ({{age}} >= 16): Quantitative Snell's law calculations, critical angle and total internal reflection, complex lens systems, combined optical instruments, derive relationships from ray diagrams

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for laws: Snell's law $n_1 \sin(\theta_1) = n_2 \sin(\theta_2)$, refractive index $n = \frac{c}{v}$
- Block for lens equations:

$$\frac{1}{f} = \frac{1}{d_o} + \frac{1}{d_i}$$

$$M = -\frac{d_i}{d_o} = \frac{h_i}{h_o}$$

$$\theta_c = \arcsin\left(\frac{n_2}{n_1}\right) \text{ for } n_1 > n_2$$

where $f$ is focal length, $d_o$ is object distance, $d_i$ is image distance, $M$ is magnification, $\theta_c$ is critical angle, $n$ is refractive index.

**Common refractive indices:**
- Air: $n \approx 1.00$
- Water: $n \approx 1.33$
- Glass: $n \approx 1.5$
- Diamond: $n \approx 2.42$

**Sign conventions:**
- $f > 0$ for converging lenses (convex)
- $f < 0$ for diverging lenses (concave)
- $d_i > 0$ for real images (opposite side from object)
- $d_i < 0$ for virtual images (same side as object)
- $M > 0$ for upright images
- $M < 0$ for inverted images

**Tables for lens data:**

| Object Distance $d_o$ (cm) | Focal Length $f$ (cm) | Image Distance $d_i$ (cm) | Magnification $M$ | Image Type |
|----------------------------|----------------------|--------------------------|-------------------|------------|
| 30                         | 10                   | 15                       | -0.5              | Real       |
| 20                         | 10                   | 20                       | -1.0              | Real       |
| 5                          | 10                   | -10                      | +2.0              | Virtual    |

**SVG diagrams for refraction visualization:**

Use SVG to show:
- Refraction at boundaries with incident ray, refracted ray, normal line, and angles
- Light bending toward normal (air → water) and away from normal (water → air)
- Total internal reflection beyond critical angle
- Converging lens ray diagrams with three principal rays and image formation
- Diverging lens ray diagrams showing virtual image formation
- Eye structure with cornea, lens, and retina
- Vision correction diagrams showing how lenses help focus light on retina
- Fiber optic light path with multiple total internal reflections

Example SVG for converging lens:
```svg
<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Optical axis -->
  <line x1="0" y1="150" x2="600" y2="150" stroke="black" stroke-width="1" stroke-dasharray="5,5"/>
  <!-- Converging lens -->
  <path d="M 300 50 Q 320 150 300 250" fill="none" stroke="#64748b" stroke-width="8"/>
  <path d="M 300 50 Q 280 150 300 250" fill="none" stroke="#64748b" stroke-width="8"/>
  <!-- Focal points -->
  <circle cx="400" cy="150" r="4" fill="#ef4444"/>
  <circle cx="200" cy="150" r="4" fill="#ef4444"/>
  <text x="405" y="140" font-size="12">F</text>
  <text x="180" y="140" font-size="12">F</text>
  <!-- Object -->
  <line x1="150" y1="150" x2="150" y2="100" stroke="#3b82f6" stroke-width="4" marker-end="url(#arrowblue)"/>
  <text x="130" y="90" font-size="12">Object</text>
  <!-- Principal rays -->
  <!-- Parallel ray -->
  <line x1="150" y1="100" x2="300" y2="100" stroke="#10b981" stroke-width="2"/>
  <line x1="300" y1="100" x2="400" y2="150" stroke="#10b981" stroke-width="2" stroke-dasharray="3,3"/>
  <!-- Focal ray -->
  <line x1="150" y1="100" x2="200" y2="150" stroke="#8b5cf6" stroke-width="2"/>
  <line x1="200" y1="150" x2="300" y2="190" stroke="#8b5cf6" stroke-width="2"/>
  <line x1="300" y1="190" x2="450" y2="150" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="3,3"/>
  <!-- Center ray -->
  <line x1="150" y1="100" x2="300" y2="150" stroke="#f59e0b" stroke-width="2"/>
  <line x1="300" y1="150" x2="450" y2="200" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3"/>
  <!-- Image -->
  <line x1="450" y1="150" x2="450" y2="200" stroke="#ef4444" stroke-width="4" marker-end="url(#arrowred)"/>
  <text x="455" y="210" font-size="12">Image</text>
  <!-- Labels -->
  <text x="290" y="30" font-size="14" font-weight="bold">Converging Lens</text>
  <!-- Arrow markers -->
  <defs>
    <marker id="arrowblue" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#3b82f6"/>
    </marker>
    <marker id="arrowred" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#ef4444"/>
    </marker>
  </defs>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Qualitative refraction descriptions, identify lens types, simple ray diagrams with provided rays, explain everyday refraction without math
- **Medium**: Thin lens equation with one unknown, magnification calculations, construct three-ray diagrams, qualitative Snell's law, explain vision correction
- **Hard**: Quantitative Snell's law with angle calculations, critical angle problems, complex lens systems, derive image positions from ray geometry, combined refraction and reflection

**Include variety in numerical values:**
- Different object distances: 15 cm, 25 cm, 40 cm, 8 cm
- Vary focal lengths: 5 cm, 10 cm, 20 cm, 30 cm
- Object heights: 2 cm, 5 cm, 10 cm, 15 cm
- Refractive indices: 1.33 (water), 1.5 (glass), 1.4 (acrylic)
- Incident angles: 30°, 45°, 60°, 20°
- Ensure different numerical answers each time to prevent memorization
