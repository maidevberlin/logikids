---
id: grade5-understanding-fractions
name: Understanding Fractions
description: Numbers and operations
grade: 5
ages:
  - 10
  - 11
focus: Numbers and operations
difficulty: medium
learning_objectives:
  - 'Deepen fraction concept (part, proportion, ratio)'
  - Fractions on number line
  - Simplify and expand
  - Compare and order fractions
  - Mixed numbers and improper fractions
prerequisites:
  - grade-4-fractions-intro
example_tasks:
  - Simplify ¹⁸⁄₂₄
  - 'Which fraction is larger: ⅗ or ⅔?'
  - 'Convert: 2 ½ = __'
real_world_context: Fractions are essential in cooking recipes, measuring materials for projects, dividing things fairly, and understanding portions in everyday life.
---

# Understanding and Working with Fractions

You will create tasks that deepen students' understanding of fractions, including simplifying, comparing, converting between mixed numbers and improper fractions, and representing fractions on number lines. Use LaTeX for all fraction notation and SVG for visual representations.

## Problem Variations

### 1. Simplifying Fractions
Students reduce fractions to their simplest form by dividing numerator and denominator by their greatest common divisor (GCD).

**Examples:**
- Simplify the fraction $\frac{{{numerator}}}{{{denominator}}}$.
- Reduce $\frac{18}{24}$ to its simplest form.
- Simplify $\frac{{{numerator}}}{{{denominator}}}$ by finding the GCD of the numerator and denominator.
- Write $\frac{45}{60}$ in its lowest terms.

**Show work:**
$$\frac{18}{24} = \frac{18 \div 6}{24 \div 6} = \frac{3}{4}$$

### 2. Expanding Fractions
Students create equivalent fractions by multiplying both numerator and denominator by the same number.

**Examples:**
- Expand $\frac{{{numerator}}}{{{denominator}}}$ to an equivalent fraction with denominator ${{newDenominator}}$.
- Write $\frac{3}{5}$ as an equivalent fraction with denominator $15$.
- Find three equivalent fractions for $\frac{{{numerator}}}{{{denominator}}}$.
- Convert $\frac{2}{7}$ to an equivalent fraction with denominator ${{newDenominator}}$.

### 3. Comparing Fractions
Students determine which fraction is larger by finding common denominators or using other strategies.

**Examples:**
- Which fraction is larger: $\frac{{{num1}}}{{{den1}}}$ or $\frac{{{num2}}}{{{den2}}}$?
- Compare $\frac{3}{5}$ and $\frac{2}{3}$. Which is greater?
- Order these fractions from smallest to largest: $\frac{{{num1}}}{{{den1}}}$, $\frac{{{num2}}}{{{den2}}}$, $\frac{{{num3}}}{{{den3}}}$.
- Is $\frac{5}{8}$ greater than, less than, or equal to $\frac{7}{12}$?

**Show comparison using common denominator:**
$$\frac{3}{5} = \frac{9}{15} \quad \text{and} \quad \frac{2}{3} = \frac{10}{15}$$
Therefore, $\frac{2}{3} > \frac{3}{5}$.

### 4. Converting Mixed Numbers to Improper Fractions
Students convert mixed numbers (whole number + fraction) to improper fractions (numerator > denominator).

**Examples:**
- Convert the mixed number ${{whole}}\frac{{{numerator}}}{{{denominator}}}$ to an improper fraction.
- Write $2\frac{3}{4}$ as an improper fraction.
- Express ${{whole}}\frac{{{numerator}}}{{{denominator}}}$ as a single fraction.
- Convert $5\frac{2}{3}$ to an improper fraction.

**Show work:**
$$2\frac{3}{4} = \frac{(2 \times 4) + 3}{4} = \frac{11}{4}$$

### 5. Converting Improper Fractions to Mixed Numbers
Students convert improper fractions to mixed numbers by dividing numerator by denominator.

**Examples:**
- Convert the improper fraction $\frac{{{numerator}}}{{{denominator}}}$ to a mixed number.
- Write $\frac{17}{5}$ as a mixed number.
- Express $\frac{{{numerator}}}{{{denominator}}}$ as a whole number and a proper fraction.
- Convert $\frac{29}{6}$ to a mixed number.

**Show work:**
$$\frac{17}{5} = 3\frac{2}{5} \quad \text{because} \quad 17 \div 5 = 3 \text{ remainder } 2$$

### 6. Fractions on Number Lines
Students locate fractions on a number line and identify fractions represented by points.

**Examples:**
- Mark the fraction $\frac{{{numerator}}}{{{denominator}}}$ on a number line from $0$ to $2$.
- What fraction is represented by point A on this number line?
- Place $\frac{3}{4}$, $1\frac{1}{2}$, and $\frac{5}{4}$ on a number line.

Include an SVG number line:
```svg
<svg width="400" height="80" xmlns="http://www.w3.org/2000/svg">
  <line x1="20" y1="40" x2="380" y2="40" stroke="black" stroke-width="2"/>
  <line x1="20" y1="35" x2="20" y2="45" stroke="black" stroke-width="2"/>
  <text x="20" y="60" font-size="14" text-anchor="middle">0</text>
  <line x1="200" y1="35" x2="200" y2="45" stroke="black" stroke-width="2"/>
  <text x="200" y="60" font-size="14" text-anchor="middle">1</text>
  <line x1="380" y1="35" x2="380" y2="45" stroke="black" stroke-width="2"/>
  <text x="380" y="60" font-size="14" text-anchor="middle">2</text>
  <!-- Mark for 3/4 -->
  <circle cx="155" cy="40" r="4" fill="red"/>
  <text x="155" y="25" font-size="12" text-anchor="middle">3/4</text>
</svg>
```

### 7. Finding Equivalent Fractions in Context
Students solve word problems involving equivalent fractions.

**Examples:**
- Maria ate $\frac{2}{6}$ of a pizza. Her brother ate $\frac{1}{3}$ of the same pizza. Did they eat the same amount? Explain.
- A recipe calls for $\frac{3}{4}$ cup of sugar. Is this the same as $\frac{6}{8}$ cup?
- Tom has $\frac{{{numerator}}}{{{denominator}}}$ of his homework done. Write this as an equivalent fraction with denominator ${{newDenominator}}$.

### 8. Fraction as Part of a Whole
Students identify or shade fractions of shapes and sets.

**Examples:**
- A rectangle is divided into ${{denominator}}$ equal parts. If ${{numerator}}$ parts are shaded, what fraction is shaded?
- Shade $\frac{{{numerator}}}{{{denominator}}}$ of this circle.
- A set has ${{total}}$ objects. ${{part}}$ of them are red. What fraction is red? Simplify your answer.

Include an SVG diagram showing a divided shape:
```svg
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="20" width="160" height="160" fill="none" stroke="black" stroke-width="2"/>
  <line x1="100" y1="20" x2="100" y2="180" stroke="black" stroke-width="1"/>
  <line x1="20" y1="100" x2="180" y2="100" stroke="black" stroke-width="1"/>
  <!-- Shade 3/4 -->
  <rect x="20" y="20" width="80" height="80" fill="lightblue" opacity="0.6"/>
  <rect x="100" y="20" width="80" height="80" fill="lightblue" opacity="0.6"/>
  <rect x="20" y="100" width="80" height="80" fill="lightblue" opacity="0.6"/>
</svg>
```
