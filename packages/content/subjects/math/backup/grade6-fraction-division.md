---
id: grade6-fraction-division
name: Fraction Division
description: Numbers and operations
grade: 6
ages:
  - 11
  - 12
focus: Numbers and operations
difficulty: medium
learning_objectives:
  - Division by fractions
  - Find reciprocal
  - Dividing = multiplying by reciprocal
prerequisites:
  - fraction-multiplication
example_tasks:
  - '½ : ¼ = ?'
  - '3 : ⅔ = ?'
real_world_context: Dividing fractions helps determine how many portions can be made from ingredients, how many pieces can be cut from materials, and sharing resources equally.
---

# Fraction Division

Create diverse problems for dividing fractions and whole numbers by fractions, emphasizing the reciprocal method and real-world applications.

## Problem Variations

### 1. Basic Fraction Division - Understanding Reciprocals
Calculate: $\frac{{{num1}}}{{{denom1}}} \div \frac{{{num2}}}{{{denom2}}}$

**Explain the reciprocal method:**
- The reciprocal of $\frac{{{num2}}}{{{denom2}}}$ is $\frac{{{denom2}}}{{{num2}}}$
- Division by a fraction equals multiplication by its reciprocal

$$\frac{a}{b} \div \frac{c}{d} = \frac{a}{b} \times \frac{d}{c}$$

**Show both steps:**
1. Rewrite as multiplication: $\frac{{{num1}}}{{{denom1}}} \times \frac{{{denom2}}}{{{num2}}}$
2. Multiply and simplify

### 2. Visual Fraction Division
Calculate: $\frac{{{numerator}}}{{{denominator}}} \div \frac{1}{{{divisor}}}$

**Use a visual explanation:**
"How many $\frac{1}{{{divisor}}}$ pieces fit into $\frac{{{numerator}}}{{{denominator}}}$?"

**Provide an SVG diagram showing the division:**
```svg
<svg viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="20" font-size="14">Original: {{numerator}}/{{denominator}}</text>
  <rect x="10" y="30" width="200" height="30" fill="lightblue" stroke="black" stroke-width="2"/>
  <text x="10" y="80" font-size="14">Divided into 1/{{divisor}} pieces</text>
  <line x1="10" y1="90" x2="210" y2="90" stroke="black" stroke-width="2"/>
</svg>
```

Then solve using the reciprocal method.

### 3. Whole Number Divided by Fraction
Calculate: ${{whole}} \div \frac{{{frac_num}}}{{{frac_denom}}}$

**Show the process:**
1. Write the whole number as a fraction: $\frac{{{whole}}}{1}$
2. Multiply by the reciprocal: $\frac{{{whole}}}{1} \times \frac{{{frac_denom}}}{{{frac_num}}}$
3. Simplify the result

**Explain:** "This tells us how many $\frac{{{frac_num}}}{{{frac_denom}}}$ portions are in {{whole}} whole units."

### 4. Ribbon Cutting Problem
You have $\frac{{{total_num}}}{{{total_denom}}}$ meters of ribbon. Each bow requires $\frac{{{piece_num}}}{{{piece_denom}}}$ meters of ribbon.

a) How many complete bows can you make?
b) How much ribbon will be left over?
c) If you need to make {{target_bows}} bows, do you have enough ribbon? If not, how much more do you need?

**Show calculations with proper units.**

### 5. Recipe Scaling Problem
A recipe calls for $\frac{{{recipe_num}}}{{{recipe_denom}}}$ cups of sugar. You want to know how many batches you can make with ${{available}}$ cups of sugar.

a) Calculate: ${{available}} \div \frac{{{recipe_num}}}{{{recipe_denom}}}$
b) How many complete batches can you make?
c) How much sugar will be left over after making the complete batches?

### 6. Chain Division Operations
Calculate: $\frac{{{a}}}{{{b}}} \div \frac{{{c}}}{{{d}}} \div \frac{{{e}}}{{{f}}}$

**Process:**
1. Work from left to right
2. First: $\frac{{{a}}}{{{b}}} \div \frac{{{c}}}{{{d}}}$
3. Then divide that result by $\frac{{{e}}}{{{f}}}$
4. Simplify the final answer

**Show each step clearly.**

### 7. Comparison: Division vs. Multiplication
For the fractions $\frac{{{x}}}{{{y}}}$ and $\frac{{{z}}}{{{w}}}$:

a) Calculate: $\frac{{{x}}}{{{y}}} \div \frac{{{z}}}{{{w}}}$
b) Calculate: $\frac{{{x}}}{{{y}}} \times \frac{{{z}}}{{{w}}}$
c) Which result is larger? By how much?
d) Explain why division by a fraction less than 1 makes the result larger.

**Use a table to compare:**

| Operation | Expression | Result (simplified) |
|-----------|-----------|-------------------|
| Division | | |
| Multiplication | | |
| Difference | | |

### 8. Fabric Cutting Problem
A tailor has ${{fabric_length}}\frac{{{fabric_frac}}}{{{fabric_denom}}}$ meters of fabric. Each dress requires $\frac{{{dress_num}}}{{{dress_denom}}}$ meters.

a) How many dresses can be made?
b) How much fabric is left over?
c) The tailor also wants to make scarves using $\frac{{{scarf_num}}}{{{scarf_denom}}}$ meters each. How many scarves can be made from the leftover fabric?

**Convert mixed number to improper fraction first.**

### 9. Time Division Problem
It takes $\frac{{{time_num}}}{{{time_denom}}}$ hours to complete one task. How many tasks can be completed in ${{total_hours}}$ hours?

a) Set up the division problem
b) Solve using the reciprocal method
c) Express the answer as a mixed number if applicable
d) If you need to complete {{required_tasks}} tasks, will {{total_hours}} hours be enough? How much time will you have left (or need)?

### 10. Complex Division with Mixed Numbers
Calculate: ${{mixed_whole}}\frac{{{mixed_num}}}{{{mixed_denom}}} \div \frac{{{divisor_num}}}{{{divisor_denom}}}$

**Step-by-step process:**
1. Convert the mixed number to an improper fraction
   $${{mixed_whole}}\frac{{{mixed_num}}}{{{mixed_denom}}} = \frac{?}{{{mixed_denom}}}$$
2. Apply the reciprocal method
3. Multiply the fractions
4. Simplify and convert back to a mixed number if appropriate

### 11. Real-World Application - Pizza Sharing
A pizza is cut into $\frac{{{pieces_num}}}{{{pieces_denom}}}$ of its original size per slice. How many slices can be made from ${{num_pizzas}}$ pizzas?

a) Set up the division
b) Solve the problem
c) If {{num_people}} people each want {{slices_per_person}} slices, is there enough pizza?

## Task Requirements
- Include visual or conceptual explanations where helpful
- Mix problems with proper fractions, improper fractions, and mixed numbers
- Always show the reciprocal method explicitly
- Include at least 2 real-world contexts (cooking, crafts, time, etc.)
- Simplify all final answers
- Convert improper fractions to mixed numbers when appropriate
- Use varied denominators (2-12) and numerators
- Ensure significantly different numerical values across task generations
