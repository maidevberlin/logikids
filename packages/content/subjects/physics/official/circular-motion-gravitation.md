---
id: circular-motion-gravitation
name: Circular Motion and Gravitation
description: 'Circular motion with constant angular velocity, centripetal force, and gravitational interactions'
grade: 11
ages:
  - 16
  - 17
  - 18
focus: 'Circular motion, angular velocity, centripetal force, centripetal acceleration, Newton''s gravitational law, Kepler''s laws, satellite motion, planetary orbits'
difficulty: hard
learning_objectives:
  - Analyze circular motion mathematically
  - Apply Newton's law of gravitation
  - Understand planetary motion and Kepler's laws
  - Calculate orbital parameters for satellites
prerequisites:
  - kinematics
  - dynamics
  - mechanical-energy
example_tasks:
  - A car drives through a curve with radius 50 m at 72 km/h. Calculate the required centripetal force for a 1200 kg car.
  - Calculate the orbital velocity of a satellite orbiting Earth at an altitude of 400 km (Earth radius: 6371 km, Earth mass: 5.97×10²⁴ kg).
  - A string breaks when tension exceeds 100 N. What is the maximum velocity for a 0.5 kg ball on a 1 m string in horizontal circular motion?
real_world_context: 'Satellite orbits, GPS systems, planetary motion, curve banking, centrifuges, amusement park rides, washing machines'
---

# Kreisbewegung und Gravitation Tasks

Create physics problems that explore circular motion and gravitational interactions. Problems should help students understand centripetal acceleration and force, apply Newton's law of gravitation, analyze orbital motion, and connect circular motion to everyday scenarios and astronomical phenomena.

**Vary the problem structure:**
- **Centripetal acceleration calculations** using $a_z = \frac{v^2}{r} = \omega^2 \cdot r$: Calculate centripetal acceleration for objects moving in circles (vehicles in curves, rotating objects, satellites)
- **Centripetal force calculations** using $F_z = m \cdot \frac{v^2}{r} = m \cdot \omega^2 \cdot r$: Determine required centripetal force for circular motion, identify force source (tension, friction, gravity, normal force)
- **Angular velocity problems** using $\omega = \frac{v}{r} = \frac{2\pi}{T}$: Convert between linear velocity and angular velocity, calculate period and frequency of rotation
- **Gravitational force calculations** using $F_G = G \cdot \frac{m_1 \cdot m_2}{r^2}$: Calculate gravitational attraction between masses (planets, satellites, objects), with $G = 6.674 \times 10^{-11} \frac{Nm^2}{kg^2}$
- **Orbital velocity problems** using $v = \sqrt{\frac{G \cdot M}{r}}$: Calculate velocity needed for circular orbit around Earth, Moon, or other celestial bodies
- **Satellite orbital period** using $T = 2\pi\sqrt{\frac{r^3}{G \cdot M}}$ or Kepler's third law $T^2 \propto r^3$: Determine orbital period for satellites at various altitudes
- **Kepler's laws applications**: Use Kepler's third law to compare orbital periods and radii of planets or satellites, analyze elliptical orbits qualitatively
- **Combined circular motion scenarios**: Analyze situations where multiple forces provide centripetal force (banked curves, vertical circles, conical pendulums)

**Vary the content/context:**
- **Road traffic**: Cars in curves, banked highway turns, roundabouts, minimum curve radius for given speeds, friction requirements for cornering
- **Satellites and space**: Satellite orbits (LEO, GEO), GPS satellites, International Space Station, orbital velocity and period calculations, geostationary orbits
- **Planetary motion**: Planetary orbits around Sun, moon orbits around planets, Kepler's laws, orbital periods and distances, comparative planetary data
- **Amusement parks**: Loop-the-loop roller coasters, rotating rides, centrifuges, Ferris wheels, swing carousels
- **Sports**: Hammer throw, discus, shot put (circular motion before release), cycling on velodrome, figure skating spins
- **Technology**: Centrifuges (laboratory, industrial), washing machine spin cycles, hard disk drives, rotating machinery

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 17): Focus on horizontal circular motion, simple centripetal force calculations, basic orbital velocity for satellites, qualitative understanding of Kepler's laws, avoid complex vector analysis
- **For middle ages** ({{age}} 17-18): Vertical circular motion (minimum velocity at top), banked curves, quantitative gravitational force calculations, orbital period calculations, Kepler's third law applications
- **For older ages** ({{age}} >= 18): Combined force analysis in circular motion, elliptical orbits (qualitative), gravitational potential energy in orbits, escape velocity, energy considerations in orbital mechanics, non-horizontal circular motion with trigonometry

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for key relationships: $a_z = \frac{v^2}{r}$, $F_z = m \cdot a_z$, $\omega = \frac{2\pi}{T}$
- Block for gravitational and orbital equations:

$$F_G = G \cdot \frac{m_1 \cdot m_2}{r^2}$$

$$v_{orbit} = \sqrt{\frac{G \cdot M}{r}}$$

$$T^2 = \frac{4\pi^2}{G \cdot M} \cdot r^3$$

Kepler's third law:
$$\frac{T_1^2}{T_2^2} = \frac{r_1^3}{r_2^3}$$

**Tables for orbital data:**

| Object          | Orbital Radius (km) | Orbital Velocity (km/s) | Period        |
|-----------------|---------------------|-------------------------|---------------|
| ISS             | 6771                | 7.66                    | 92.7 min      |
| GPS Satellite   | 26,560              | 3.87                    | 12 h          |
| GEO Satellite   | 42,164              | 3.07                    | 24 h          |

| Planet   | Distance from Sun (AU) | Orbital Period (years) | T²/r³ |
|----------|------------------------|------------------------|-------|
| Earth    | 1.00                   | 1.00                   | 1.00  |
| Mars     | 1.52                   | 1.88                   | 1.00  |
| Jupiter  | 5.20                   | 11.86                  | 1.00  |

**SVG diagrams for circular motion:**

Use SVG to show:
- Top-down view of circular path with velocity and centripetal force vectors
- Free body diagram for object in circular motion showing all forces
- Satellite orbiting Earth with radius and velocity labeled
- Banked curve with force components (normal force, friction, weight)
- Planetary orbits around Sun (circular approximation)
- Vertical circular motion at different points

Example SVG for circular motion:
```svg
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Circular path -->
  <circle cx="200" cy="200" r="100" fill="none" stroke="#ddd" stroke-width="2" stroke-dasharray="5,5"/>
  <!-- Object -->
  <circle cx="300" cy="200" r="10" fill="#3b82f6"/>
  <!-- Velocity vector (tangent) -->
  <line x1="300" y1="200" x2="300" y2="130" stroke="green" stroke-width="3" marker-end="url(#arrow)"/>
  <text x="305" y="160" fill="green" font-size="14">v</text>
  <!-- Centripetal force (toward center) -->
  <line x1="300" y1="200" x2="230" y2="200" stroke="red" stroke-width="3" marker-end="url(#arrow)"/>
  <text x="255" y="190" fill="red" font-size="14">F_z</text>
  <!-- Center -->
  <circle cx="200" cy="200" r="5" fill="black"/>
  <!-- Radius -->
  <line x1="200" y1="200" x2="300" y2="200" stroke="black" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="240" y="220" font-size="14">r</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Basic centripetal force/acceleration in horizontal circular motion, simple orbital velocity calculations, all values provided directly, single-step problems
- **Medium**: Combined force analysis (friction providing centripetal force), gravitational force calculations between two masses, orbital period calculations, Kepler's third law, two-step problems with unit conversions
- **Hard**: Vertical circular motion with minimum velocity conditions, banked curves with force components, escape velocity, energy in orbital changes, multi-step problems combining gravity and circular motion, elliptical orbit concepts

**Include variety in numerical values:**
- Different radii: 0.5 m, 15 m, 100 m, 6371 km (Earth radius), 384,400 km (Earth-Moon)
- Vary velocities: 5 m/s, 20 m/s, 72 km/h, 7.8 km/s (orbital), 30 km/s
- Various masses: 0.2 kg, 50 kg, 1500 kg, $5.97 \times 10^{24}$ kg (Earth), $1.99 \times 10^{30}$ kg (Sun)
- Different periods: 2 s, 30 s, 90 min, 12 h, 365 days, 11.86 years
- Angular velocities: 0.5 rad/s, 2π rad/s, 7.3×10⁻⁵ rad/s (Earth rotation)
- Orbital altitudes: 400 km (ISS), 20,200 km (GPS), 35,786 km (GEO)
- Use scientific notation for astronomical values
- Ensure varied results to emphasize understanding of physical principles
