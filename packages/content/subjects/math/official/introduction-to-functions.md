---
id: introduction-to-functions
name: Introduction to Functions
description: Understanding the concept of functions, domain, range, and function notation
grade: 7
ages:
  - 12
  - 14
focus: Function concept and notation, domain and range, function representations, evaluating functions, functional dependencies
difficulty: easy
learning_objectives:
  - Understand functions as unique mappings from input to output
  - Use function notation f(x)
  - Determine domain and range of functions
  - Represent functions with tables, graphs, and formulas
  - Interpret functional relationships in real contexts
prerequisites: []
example_tasks:
  - If f(x) = 2x + 3, calculate f(5)
  - Determine if a table represents a function
  - Find the domain and range of a function from its graph
real_world_context: Input-output relationships, conversion formulas, cost functions, distance-time relationships
---

# Introduction to Functions Tasks

Create mathematics problems that introduce the concept of functions as unique mappings between inputs and outputs. Problems should help students understand function notation, identify functions in various representations, and interpret functional relationships in real-world contexts.

**Vary the problem structure:**
- **Evaluating functions**: Given a function rule like $f(x) = 3x - 5$, calculate function values for specific inputs: "Calculate $f(4)$", "Find $f(-2)$"
- **Function identification from tables**: Present a table of x and y values and ask whether it represents a function by checking if each input has exactly one output
- **Function identification from graphs**: Show coordinate graphs and ask students to identify which represent functions using the vertical line test
- **Domain and range from graphs**: Present function graphs and ask students to determine the set of possible input values (domain) and output values (range)
- **Domain and range from formulas**: Given simple function rules, determine which values are allowed as inputs and what outputs are possible
- **Creating function tables**: Given a function rule, create a table of values for specified inputs
- **Real-world function modeling**: Present scenarios (taxi fare based on distance, temperature conversion) and express the relationship using function notation
- **Matching representations**: Match functions given in different forms (table, graph, formula, verbal description) that represent the same relationship

**Vary the content/context:**
- **Unit conversions**: Temperature (Celsius to Fahrenheit), currency exchange, metric conversions
- **Cost functions**: Taxi fares, rental costs, phone plans, admission fees
- **Distance-time relationships**: Constant speed travel, walking or cycling distances
- **Measurement relationships**: Perimeter of squares given side length, area of circles given radius
- **Daily life patterns**: Age differences between people, cooking time vs. weight
- **Shopping scenarios**: Total cost based on quantity, discount calculations

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 13): Simple function rules with small integers, basic arithmetic operations only (addition, subtraction, simple multiplication), concrete contexts (doubling a number, adding a fixed amount), emphasize the "input-output machine" concept
- **For middle ages** ({{age}} 13-14): Include negative numbers, fractions, two-step functions like $f(x) = 2x + 1$, distinguish between functions and non-functions, understand domain restrictions (no division by zero)
- **For older ages** ({{age}} >= 14): More complex algebraic expressions, inverse operations, composition of simple functions, formal domain and range notation using interval notation or set notation

**Use appropriate formats:**

**LaTeX for function notation:**
- Inline: $f(x) = 2x + 3$, $g(t) = 5t - 1$
- Block for function definitions:

$$f(x) = 3x + 7$$

$$h(n) = n^2 - 2n$$

**Tables for function values:**

| x | f(x) |
|---|------|
| 0 | 3    |
| 1 | 5    |
| 2 | 7    |
| 3 | 9    |

**SVG diagrams for function graphs:**

Use SVG to show:
- Coordinate systems with properly labeled axes
- Function graphs plotted with clear points and lines
- Mapping diagrams showing input-output relationships
- Visual representation of domain and range on number lines
- Vertical line test demonstrations

Example SVG for a simple linear function graph:
```svg
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Coordinate system -->
  <line x1="50" y1="250" x2="350" y2="250" stroke="black" stroke-width="2"/>
  <line x1="50" y1="250" x2="50" y2="50" stroke="black" stroke-width="2"/>
  <!-- Function graph -->
  <line x1="50" y1="200" x2="300" y2="100" stroke="#3b82f6" stroke-width="3"/>
  <!-- Points -->
  <circle cx="50" cy="200" r="4" fill="#3b82f6"/>
  <circle cx="150" cy="150" r="4" fill="#3b82f6"/>
  <circle cx="250" cy="100" r="4" fill="#3b82f6"/>
  <!-- Labels -->
  <text x="180" y="280" font-size="14">x</text>
  <text x="20" y="150" font-size="14">f(x)</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Direct evaluation of simple functions with small positive integers, identifying obvious functions vs. non-functions, simple one-step function rules
- **Medium**: Functions with negative inputs, determining domain from context, recognizing domain restrictions, creating function rules from patterns
- **Hard**: Complex algebraic expressions, formal domain and range notation, multiple representations of the same function, functions with multiple domain restrictions

**Include variety in numerical values:**
- Different coefficients: $f(x) = 3x + 2$, $f(x) = 5x - 7$, $f(x) = 0.5x + 4$
- Various inputs to evaluate: x = 0, x = -3, x = 2.5, x = 10
- Different contexts with varied units: euros, meters, minutes, degrees
- Range of domain values: {-2, -1, 0, 1, 2}, {0, 5, 10, 15}, {1, 2, 3, 4, 5}
- Ensure different numerical answers each time to prevent memorization
