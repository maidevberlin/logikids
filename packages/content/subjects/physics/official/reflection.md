---
id: reflection
name: Reflection
description: 'Reflection of light at plane and curved mirrors'
grade: 7
ages:
  - 12
  - 14
focus: 'Law of reflection, plane mirrors, mirror images, curved mirrors (concave and convex), focal point, mirror equation, applications'
difficulty: easy
learning_objectives:
  - Apply law of reflection
  - Construct ray diagrams for plane mirrors
  - Analyze curved mirror imaging
  - Understand mirror applications
prerequisites:
  - light-propagation
example_tasks:
  - A light ray hits a mirror at 35° angle. What is the reflection angle?
  - Draw a ray diagram showing how a plane mirror creates a virtual image
  - Explain why a spoon shows an upside-down reflection on one side
real_world_context: 'Bathroom mirrors, car rearview mirrors, telescope mirrors, solar concentrators, periscopes, kaleidoscopes'
---

# Reflection Tasks

Create physics problems that explore how light reflects from surfaces following the law of reflection. Problems should help students understand mirror imaging, construct ray diagrams, and analyze both plane and curved mirror systems.

**Vary the problem structure:**
- **Law of reflection applications**: Given incident angle, calculate reflection angle using "angle of incidence = angle of reflection" (measured from normal)
- **Plane mirror ray diagrams**: Construct ray diagrams showing how images form behind mirrors, verify that image distance equals object distance
- **Plane mirror image properties**: Analyze virtual images - same size, laterally inverted, same distance behind mirror as object in front
- **Concave mirror focusing**: Analyze parallel rays converging at focal point, calculate focal length $f = \frac{R}{2}$ where $R$ is radius of curvature
- **Convex mirror diverging**: Show how parallel rays appear to diverge from virtual focal point behind mirror, explain wide-angle viewing
- **Mirror equation problems**: Use $\frac{1}{f} = \frac{1}{d_o} + \frac{1}{d_i}$ to calculate image distance, object distance, or focal length
- **Magnification calculations**: Calculate magnification $M = -\frac{d_i}{d_o} = \frac{h_i}{h_o}$, determine if image is enlarged, reduced, upright, or inverted
- **Multiple reflection problems**: Analyze light bouncing between two or more mirrors, calculate number of reflections

**Vary the content/context:**
- **Everyday mirrors**: Bathroom mirrors, dressing mirrors, makeup mirrors, hand mirrors
- **Vehicle mirrors**: Rearview mirrors (plane), side mirrors (convex for wide view), blind spot considerations
- **Scientific instruments**: Telescope mirrors (concave), laser systems, optical microscopes
- **Decorative applications**: Mirror balls at parties, funhouse mirrors, kaleidoscopes, periscopes
- **Solar energy**: Parabolic solar concentrators, solar cookers, concentrated solar power plants
- **Safety and security**: Convex mirrors at intersections, shop security mirrors, traffic mirrors

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 13): Focus on law of reflection with simple angle measurements, plane mirror properties, basic ray diagrams, identify real-world mirror types
- **For middle ages** ({{age}} 13-14): Introduce curved mirror concepts qualitatively, distinguish concave vs. convex, focal point concept, simple ray constructions for curved mirrors
- **For older ages** ({{age}} >= 15): Quantitative mirror equation calculations, magnification problems, precise ray diagram construction with three principal rays, analyze real vs. virtual images

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for laws: Law of reflection $\theta_i = \theta_r$, focal length $f = \frac{R}{2}$
- Block for mirror equations:

$$\frac{1}{f} = \frac{1}{d_o} + \frac{1}{d_i}$$

$$M = -\frac{d_i}{d_o} = \frac{h_i}{h_o}$$

where $f$ is focal length, $d_o$ is object distance, $d_i$ is image distance, $M$ is magnification, $h_i$ is image height, $h_o$ is object height.

**Sign conventions:**
- $f > 0$ for concave mirrors (converging)
- $f < 0$ for convex mirrors (diverging)
- $d_i > 0$ for real images (in front of mirror)
- $d_i < 0$ for virtual images (behind mirror)
- $M > 0$ for upright images
- $M < 0$ for inverted images

**Tables for mirror data:**

| Object Distance $d_o$ (cm) | Focal Length $f$ (cm) | Image Distance $d_i$ (cm) | Magnification $M$ |
|----------------------------|----------------------|--------------------------|-------------------|
| 30                         | 10                   | 15                       | -0.5              |
| 15                         | 10                   | 30                       | -2.0              |
| 5                          | 10                   | -10                      | +2.0              |

**SVG diagrams for reflection visualization:**

Use SVG to show:
- Law of reflection with incident and reflected rays, normal line, and equal angles
- Plane mirror ray diagrams with object, virtual image, and ray paths
- Concave mirror ray diagrams showing focal point, center of curvature, principal axis
- Convex mirror ray diagrams showing virtual focal point and image formation
- Three principal rays for curved mirrors: parallel ray, focal ray, center ray
- Real vs. virtual image positions

Example SVG for law of reflection:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Mirror surface -->
  <line x1="150" y1="50" x2="150" y2="250" stroke="#64748b" stroke-width="8"/>
  <!-- Normal line -->
  <line x1="150" y1="150" x2="250" y2="150" stroke="black" stroke-width="1" stroke-dasharray="5,5"/>
  <!-- Incident ray -->
  <line x1="50" y1="80" x2="150" y2="150" stroke="#ef4444" stroke-width="3" marker-end="url(#arrowred)"/>
  <!-- Reflected ray -->
  <line x1="150" y1="150" x2="50" y2="220" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrowblue)"/>
  <!-- Angle arcs -->
  <path d="M 180 150 A 30 30 0 0 0 165 125" fill="none" stroke="#ef4444" stroke-width="2"/>
  <path d="M 180 150 A 30 30 0 0 1 165 175" fill="none" stroke="#3b82f6" stroke-width="2"/>
  <!-- Labels -->
  <text x="80" y="70" font-size="14" fill="#ef4444">Incident ray</text>
  <text x="80" y="240" font-size="14" fill="#3b82f6">Reflected ray</text>
  <text x="170" y="120" font-size="14">θᵢ</text>
  <text x="170" y="185" font-size="14">θᵣ</text>
  <text x="260" y="155" font-size="12">Normal</text>
  <!-- Arrow markers -->
  <defs>
    <marker id="arrowred" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#ef4444"/>
    </marker>
    <marker id="arrowblue" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#3b82f6"/>
    </marker>
  </defs>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Apply law of reflection with given angles, describe plane mirror images qualitatively, identify mirror types, simple ray diagrams for plane mirrors
- **Medium**: Construct ray diagrams for curved mirrors, distinguish real vs. virtual images, basic mirror equation problems with one unknown, calculate focal length from radius
- **Hard**: Complex mirror equation problems requiring algebraic manipulation, combined magnification and position calculations, multi-step problems, analyze optical systems with multiple mirrors

**Include variety in numerical values:**
- Different incident angles: 20°, 35°, 45°, 60°, 75°
- Vary object distances: 10 cm, 25 cm, 40 cm, 1.5 m
- Different focal lengths: 5 cm, 15 cm, 30 cm, 50 cm
- Mirror radii of curvature: 20 cm, 60 cm, 1 m
- Object heights: 3 cm, 8 cm, 15 cm, 25 cm
- Ensure different numerical answers each time to prevent memorization
