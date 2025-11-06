---
id: magnetism
name: Magnetism
description: 'Magnetic phenomena, permanent magnets, magnetic fields, and Earth''s magnetic field'
grade: 7
ages:
  - 12
  - 14
focus: 'Permanent magnets, magnetic poles, magnetic field, field lines, compass, Earth''s magnetic field, magnetic materials (ferromagnetic, paramagnetic, diamagnetic)'
difficulty: medium
learning_objectives:
  - Describe properties of permanent magnets
  - Visualize magnetic fields using field lines
  - Understand Earth's magnetic field
  - Explain compass function
prerequisites: []
example_tasks:
  - Explain why like magnetic poles repel and unlike poles attract
  - Draw the magnetic field lines around a bar magnet
  - How does a compass help with navigation? Where does it point?
real_world_context: 'Compass navigation, refrigerator magnets, magnetic door locks, speakers, hard drives, MRI machines, magnetic levitation trains'
---

# Magnetism Tasks

Create physics problems that explore permanent magnets, magnetic fields, magnetic materials, and Earth's magnetism. Problems should help students understand magnetic phenomena, visualize magnetic field patterns, explain compass behavior, and recognize applications of magnetism in everyday technology.

**Vary the problem structure:**
- **Magnetic pole interactions**: Explain or predict whether magnetic poles attract or repel (N-N repel, S-S repel, N-S attract), understanding that like poles repel and unlike poles attract
- **Field line visualization**: Draw magnetic field lines around bar magnets, horseshoe magnets, or configurations of multiple magnets; identify field direction (N to S outside magnet)
- **Field strength patterns**: Identify where magnetic field is strongest (near poles) and weakest (far from magnet, between opposite poles), analyze field line density
- **Compass behavior**: Explain how compasses work, predict compass needle orientation in various magnetic fields, understand compass points to magnetic north
- **Earth's magnetic field**: Describe Earth as a giant magnet with magnetic poles near geographic poles, explain why compasses point north, discuss magnetic declination
- **Breaking magnets**: Predict what happens when a magnet is broken in half (each piece becomes a smaller magnet with N and S poles, cannot isolate single pole)
- **Magnetic materials classification**: Identify ferromagnetic (iron, nickel, cobalt), paramagnetic (weakly attracted), and diamagnetic (weakly repelled) materials
- **Magnetization and demagnetization**: Explain how iron becomes temporarily magnetized near permanent magnet (induced magnetism), how magnets can be demagnetized (heating, dropping)
- **Field mapping**: Describe experiments to visualize magnetic fields using iron filings or small compasses, interpret patterns
- **Magnetic shielding**: Understand that magnetic fields can penetrate most materials, but ferromagnetic materials can redirect field lines
- **Applications**: Explain how magnetism is used in everyday devices (speakers, motors, generators, magnetic latches, credit card strips, hard drives)

**Vary the content/context:**
- **Permanent magnets**: Bar magnets, horseshoe magnets, disc magnets, ring magnets, neodymium magnets (very strong), ceramic magnets
- **Household items**: Refrigerator magnets, magnetic cabinet latches, magnetic knife holders, magnetic toys
- **Navigation**: Compass use in hiking/sailing, magnetic north vs. true north, historical use by sailors, animal navigation using Earth's field
- **Earth's magnetism**: Magnetic poles (near but not at geographic poles), magnetic field protects from solar wind, auroras (Northern/Southern Lights), magnetic reversals in geological history
- **Technology**: Hard disk drives storing data magnetically, magnetic stripe cards, speakers and headphones (voice coil moves in magnetic field), metal detectors
- **Medical**: MRI (Magnetic Resonance Imaging) machines using strong magnetic fields
- **Transport**: Maglev trains using magnetic levitation, magnetic bearings
- **Natural magnetism**: Lodestone (naturally magnetic mineral), magnetite, magnetotactic bacteria

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 13): Qualitative understanding of attraction/repulsion, drawing simple field lines around single bar magnet, basic compass behavior (points north), identify magnetic vs. non-magnetic materials, simple applications (refrigerator magnets)
- **For middle ages** ({{age}} 13-14): Field line patterns for multiple magnets or horseshoe magnets, explain compass needle is small magnet with N and S pole, understand Earth as magnet with geographic and magnetic poles not aligned, classify materials as ferromagnetic/non-magnetic, explain induced magnetism in iron
- **For older ages** ({{age}} >= 14): Complex field configurations, magnetic declination and its variation by location, explain domain theory of ferromagnetism (qualitative), compare strengths of different magnetic materials, analyze magnetic shielding effects, advanced applications in technology

**Use appropriate formats:**

**Text descriptions for concepts:**
- Like magnetic poles (N-N or S-S) repel each other
- Unlike magnetic poles (N-S) attract each other
- Magnetic field lines always form closed loops (exit from N pole, enter S pole)
- Field lines never cross
- Closer field lines indicate stronger magnetic field
- Breaking a magnet creates two smaller magnets, each with N and S poles
- Heating or striking magnets can demagnetize them
- Earth's magnetic south pole is near geographic north pole (that's why compass north pole points there)

**Tables for magnetic materials:**

| Material     | Type            | Behavior in Magnetic Field        | Examples                      |
|--------------|-----------------|-----------------------------------|-------------------------------|
| Iron         | Ferromagnetic   | Strongly attracted, can be magnetized | Nails, steel, iron ore     |
| Nickel       | Ferromagnetic   | Strongly attracted               | Coins, alloys                 |
| Cobalt       | Ferromagnetic   | Strongly attracted               | Magnets, alloys               |
| Aluminum     | Paramagnetic    | Very weakly attracted            | Foil, cans                    |
| Copper       | Diamagnetic     | Very weakly repelled             | Wires, pipes                  |
| Wood         | Diamagnetic     | Not noticeably affected          | Furniture, pencils            |
| Plastic      | Diamagnetic     | Not noticeably affected          | Bottles, toys                 |

**Compass directions:**

| Direction | Abbreviation | Degrees |
|-----------|--------------|---------|
| North     | N            | 0°      |
| East      | E            | 90°     |
| South     | S            | 180°    |
| West      | W            | 270°    |

**SVG diagrams for magnetic fields:**

Use SVG to show:
- Bar magnet with N and S poles labeled and field lines curving from N to S
- Horseshoe magnet with strong uniform field between poles
- Two magnets attracting (N-S facing) with field lines connecting
- Two magnets repelling (N-N or S-S facing) with field lines pushed away
- Compass needle (small magnet) aligning with external field
- Iron filings pattern around magnets
- Earth as magnet with field lines

Example SVG for bar magnet field lines:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Bar magnet -->
  <rect x="150" y="125" width="100" height="50" fill="#cccccc" stroke="black" stroke-width="2"/>
  <line x1="200" y1="125" x2="200" y2="175" stroke="black" stroke-width="2"/>
  <!-- Labels -->
  <text x="165" y="155" font-size="20" font-weight="bold">N</text>
  <text x="220" y="155" font-size="20" font-weight="bold">S</text>
  <text x="160" y="115" font-size="14" fill="#ef4444">North Pole</text>
  <text x="205" y="115" font-size="14" fill="#3b82f6">South Pole</text>
  <!-- Field lines exiting N and entering S -->
  <path d="M 150 150 Q 100 150 100 100 Q 100 50 200 30 Q 300 50 300 100 Q 300 150 250 150"
        fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#arrowmag)"/>
  <path d="M 150 145 Q 80 145 80 150 Q 80 200 200 220 Q 320 200 320 150 Q 320 145 250 145"
        fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#arrowmag)"/>
  <path d="M 150 150 Q 120 150 120 125 Q 120 90 200 80 Q 280 90 280 125 Q 280 150 250 150"
        fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#arrowmag)"/>
  <path d="M 150 150 Q 60 150 60 180 Q 60 240 200 260 Q 340 240 340 180 Q 340 150 250 150"
        fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#arrowmag)"/>
  <!-- Arrow marker -->
  <defs>
    <marker id="arrowmag" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#10b981"/>
    </marker>
  </defs>
</svg>
```

Example SVG for compass:
```svg
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Compass housing -->
  <circle cx="100" cy="100" r="80" fill="white" stroke="black" stroke-width="3"/>
  <!-- Direction markings -->
  <text x="95" y="35" font-size="20" font-weight="bold">N</text>
  <text x="95" y="175" font-size="20" font-weight="bold">S</text>
  <text x="165" y="105" font-size="20" font-weight="bold">E</text>
  <text x="25" y="105" font-size="20" font-weight="bold">W</text>
  <!-- Compass needle (red points north) -->
  <polygon points="100,50 95,100 100,105 105,100" fill="#ef4444" stroke="black" stroke-width="1"/>
  <polygon points="100,150 95,100 100,105 105,100" fill="#6b7280" stroke="black" stroke-width="1"/>
  <!-- Center pivot -->
  <circle cx="100" cy="100" r="5" fill="black"/>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Qualitative understanding of magnetic attraction/repulsion, identify N and S poles, draw simple field lines around single bar magnet, understand compass points north, classify materials as magnetic or non-magnetic
- **Medium**: Draw field lines for horseshoe magnets or two magnets, explain compass needle alignment in different field configurations, understand Earth's magnetic field basics (geographic vs. magnetic poles), induced magnetism in iron objects, explain domain theory qualitatively
- **Hard**: Complex multi-magnet field configurations, magnetic declination calculations, compare field patterns quantitatively, analyze magnetic shielding, explain demagnetization mechanisms, advanced applications in technology (hard drives, MRI basics)

**Include variety in examples:**
- Different magnet shapes: bar, horseshoe, disc, ring, cylindrical, rectangular
- Magnet configurations: single magnet, two magnets attracting, two magnets repelling, multiple magnets in line, magnets at angles
- Different materials to test: iron nails, aluminum foil, copper wire, plastic ruler, wooden pencil, nickel coin, stainless steel spoon
- Compass applications: hiking navigation, marine navigation, orienteering, finding magnetic north vs. true north
- Earth's field contexts: auroras at poles, magnetic pole wandering, ancient navigation, animal migration
- Technology examples: speakers (voice coil in magnetic field), hard drives (magnetic domains storing 0s and 1s), MRI (strong fields align hydrogen nuclei), maglev trains (magnetic levitation and propulsion)
- Ensure variety in which poles are shown (N-S, N-N, S-S), which materials are magnetic, and which applications are discussed
