---
id: grade3-combinatorics
name: Combinatorics
description: Data and probability
grade: 3
ages:
  - 8
  - 9
focus: Data and probability
difficulty: hard
learning_objectives:
  - Systematic trial
  - Simple combinatorial tasks
  - Tree diagrams (introduction)
prerequisites: []
example_tasks:
  - How many different outfits from 3 pants and 4 shirts?
real_world_context: Combinatorics helps us count all possible choices when picking outfits, creating passwords, planning routes, or organizing teams and schedules.
---

# Combinatorics

Generate tasks that introduce systematic counting and simple combinatorial reasoning through age-appropriate scenarios.

## Task Variations

### 1. Outfit Combinations
Count combinations of clothing items:
- "You have {{num1}} different shirts and {{num2}} different pants. How many different outfits can you make?"
- Use small numbers (2-4 items per category) appropriate for Grade 3
- Include visual aids or encourage drawing: "Draw or list all possible combinations"
- Example: "Maya has 3 t-shirts (red, blue, green) and 2 pairs of shorts (black, white). How many different outfits can she wear?"

### 2. Food Menu Combinations
Create meal or snack combinations:
- "An ice cream shop has {{num1}} flavors and {{num2}} toppings. How many different ice cream combinations can you order?"
- "For lunch, you can choose from {{num1}} main dishes, {{num2}} sides, and {{num3}} drinks. How many different lunches are possible?"
- Keep total combinations manageable (12-20 max)
- Example: "A café offers 3 types of bread and 4 types of filling. How many different sandwiches can you make?"

### 3. Path Counting Problems
Count different routes or paths:
- Use grid diagrams showing paths from point A to point B
- "How many different ways can you walk from home to school if you can only go right or up?"
- Create simple 2×2 or 2×3 grids
- Example with SVG:

<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
  <line x1="20" y1="20" x2="180" y2="20" stroke="black" stroke-width="2"/>
  <line x1="20" y1="20" x2="20" y2="130" stroke="black" stroke-width="2"/>
  <line x1="100" y1="20" x2="100" y2="130" stroke="black" stroke-width="2"/>
  <line x1="180" y1="20" x2="180" y2="130" stroke="black" stroke-width="2"/>
  <line x1="20" y1="75" x2="180" y2="75" stroke="black" stroke-width="2"/>
  <line x1="20" y1="130" x2="180" y2="130" stroke="black" stroke-width="2"/>
  <circle cx="20" cy="20" r="8" fill="green"/>
  <circle cx="180" cy="130" r="8" fill="red"/>
  <text x="10" y="10" font-size="12">Start</text>
  <text x="170" y="145" font-size="12">End</text>
</svg>

### 4. Simple Tree Diagrams
Introduce systematic listing with tree structures:
- "Use a tree diagram to show all possible outcomes when you flip a coin twice"
- "Draw a tree diagram for choosing one fruit (apple, banana) and one drink (juice, milk)"
- Present partially completed tree diagrams for students to finish
- Show systematic branching:

```
First Choice    Second Choice    Outcome
    A --------→ X ----------→ AX
     \--------→ Y ----------→ AY
    B --------→ X ----------→ BX
     \--------→ Y ----------→ BY
```

### 5. Number Combinations
Create numbers from given digits:
- "Using the digits {{digit1}}, {{digit2}}, and {{digit3}}, how many different 2-digit numbers can you make? (You can use each digit only once)"
- "How many different 3-digit numbers can you make with the digits 1, 2, 3 if you can't repeat digits?"
- Use small digit sets (3-4 digits)
- Example: "Using 2, 5, and 7, list all possible 2-digit numbers: 25, 27, 52, 57, 72, 75"

### 6. Team or Group Formation
Count ways to form groups:
- "You have {{num}} friends. How many different pairs can you make?"
- "A game needs 2 players. If there are 4 children (Anna, Ben, Clara, David), how many different pairs can play?"
- Create systematic lists: AB, AC, AD, BC, BD, CD
- Keep group sizes small (4-5 people max)

### 7. Multiplication Principle Introduction
Connect combinations to multiplication:
- "If there are {{num1}} ways to get to the park and {{num2}} ways to get home, how many different round trips are possible?"
- Show the connection: ${{num1}} \times {{num2}} = {{product}}$ different combinations
- Use concrete scenarios: "3 paths to school × 2 paths home = 6 different routes"
- Present in table format:

| To School | From School | Total Routes |
|-----------|-------------|--------------|
| Path A    | Route 1     | 1            |
| Path A    | Route 2     | 2            |
| Path B    | Route 1     | 3            |
| Path B    | Route 2     | 4            |
| Path C    | Route 1     | 5            |
| Path C    | Route 2     | 6            |

### 8. Systematic Listing Practice
Develop organized counting strategies:
- "List all possible ways to arrange 3 books (Math, Science, Reading) on a shelf"
- "How many different 3-letter 'words' can you make with A, B, C if you use each letter exactly once?"
- Encourage alphabetical or systematic ordering
- Provide partial lists for students to complete

## Difficulty Scaling

**Easy ({{difficulty}} = easy):**
- 2 categories with 2-3 items each
- Direct outfit or menu combinations
- Maximum 6-9 total combinations
- Example: "2 shirts and 3 pants = ? outfits"

**Medium ({{difficulty}} = medium):**
- 3 categories or more complex 2-category problems
- Simple tree diagrams
- Path counting on small grids
- 10-16 total combinations
- Example: Tree diagram for 2 coin flips

**Hard ({{difficulty}} = hard):**
- Number arrangements or permutations
- Team formation problems
- Multi-step problems combining concepts
- Require systematic listing strategy
- Example: "How many different 3-digit numbers using 1, 2, 3, 4 with no repeats?"
