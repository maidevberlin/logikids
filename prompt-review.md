# Task Brief

Generate an educational task for this student:

| | |
|---|---|
| **Student** | Age 11, Grade 5 |
| **Subject** | Mathematics |
| **Concept** | Data Collection and Charts (Data representation and interpretation) |
| **Language** | English |

---

# Task Requirements

**Learning Objective:** Create and interpret line graphs for temporal data

**Problem Type:** Direct Reading

**Difficulty (medium):**
- Create bar charts from organized data
- Choose appropriate scales (1s, 2s, 5s, 10s)
- Interpret pictographs with partial symbols

**Avoid:**
- Avoid pie charts or scatter plots (not covered at grade 5)
- Don't use data sets with more than 6 categories
- Avoid decimal values in data - use whole numbers only
- Don't create ambiguous scales that could be read multiple ways
- Avoid data values larger than 100 for bar charts



---

# Creative Framing

**Scenario:** designing a dream house

**Language style:** Use casual but structured language. Explain concepts clearly without being condescending.

- **Thinking Challenge**: Explain how you knew to start with this step
- **Time Context**: This repeats every season

**Real-world context options:**
- Conducting surveys and analyzing results
- Tracking weather patterns and temperature changes
- Recording and comparing sports statistics
- Monitoring environmental data like rainfall or plant growth
- Organizing sales data and business information

---

# Output Format

Create a multiple choice task with 4 options where exactly one is correct.

**CRITICAL**: Randomize correct answer position (1st-4th with equal probability).

**Options**: Exactly 4 total. One correct (`isCorrect: true`), three plausible distractors (`isCorrect: false`). Distractors should target common misconceptions or calculation errors.

**Explanation**: Required. Show reasoning/calculation steps for the correct answer.

## Example

```json
{
  "type": "single_choice",
  "title": "Solving Linear Equations",
  "task": "Solve for x: 3x - 7 = 14",
  "options": [
    { "text": "x = 5", "isCorrect": false },
    { "text": "x = 7", "isCorrect": true },
    { "text": "x = 21", "isCorrect": false },
    { "text": "x = 3", "isCorrect": false }
  ],
  "explanation": "Add 7 to both sides: 3x = 21. Divide by 3: x = 7. Verify: 3(7) - 7 = 14 ✓"
}
```

## Output Format

```json
{
  "type": "single_choice",
  "title": "string",
  "task": "string (markdown supported)",
  "options": [{ "text": "string", "isCorrect": boolean }],
  "explanation": "string (required, markdown supported)"
}
```

---

# Reference

## Task vs Solution Separation

The `task` field is what students see. It must NOT contain answers, explanations, or hints.

The `explanation` field contains the solution reasoning (shown after correct answer).

## Formatting Options

# Mathematics

Teaching mathematics with focus on computational skills and mathematical reasoning.

## Content Types

**Use:**
- LaTeX for equations: `$x^2 + 5x - 3 = 0$`
- SVG diagrams for geometry, graphs, number lines
- Tables for data, patterns, comparisons
- Step-by-step worked examples

- LaTeX: `$x^2$` (inline), `$$\frac{a}{b}$$` (block)
- Tables, **bold**, *italic*, lists
- SVG in `<figure>` tags with `<figcaption>`
