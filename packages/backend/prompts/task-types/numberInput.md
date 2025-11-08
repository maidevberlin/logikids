---
id: numberInput
name: Number Input
description: A task requiring numeric input with optional unit display or selection
---

Create a number input task that requires calculating or determining a numeric value. The task uses exact numeric matching (no tolerance) and supports three unit handling modes: no unit, display-only unit, or unit selection.

**CRITICAL**:
- The `answer` field MUST be a number (NOT a string) - this is the correct numeric value
- Validation uses exact numeric match only (no tolerance/rounding)
- For units, choose the appropriate mode based on learning objectives
- **UI Note**: The input has increment/decrement buttons with step=1. For decimal answers, students can type directly but steppers only add/subtract 1. Prefer whole number answers when possible for better UX.
- Ensure calculations are appropriate for the student's age and grade level
- Double-check your math before generating the response

## Unit Handling

Choose one of **three scenarios** based on the learning objective:

### 1. No Unit - Pure Numeric Calculation
Use when the answer is a dimensionless number or when units are not relevant.
- **Omit both** `unit` and `unitOptions` fields
- Example: "What is 7 × 6?"

### 2. Display-Only Unit - Unit is Obvious/Specified
Use when the unit is explicitly stated in the task or is obvious from context.
- **Provide only** `unit` field (string)
- The unit is shown to the student but not validated
- Example: "Calculate the area in cm²" → `"unit": "cm²"`

### 3. Unit Selection - Choosing Unit is Part of Learning
Use when selecting the correct unit is an important part of the learning objective.
- **Provide both** `unit` (correct answer) and `unitOptions` (array of choices)
- **CRITICAL**: The `unit` value MUST appear in the `unitOptions` array
- Include **plausible wrong units as distractors** (common mistakes, wrong magnitudes)
- Typically 3-4 options total
- Example: Velocity calculation → `"unit": "km/h", "unitOptions": ["m/s", "km/h", "mph"]`

**When to use unit selection:**
- Physics problems where unit conversion understanding is key
- Science tasks where choosing appropriate units demonstrates understanding
- When multiple valid unit systems exist and choosing correctly is meaningful
- Advanced topics where unit analysis is part of the problem-solving skill

**Distractor guidelines:**
- Include units from the same quantity type (e.g., all speed units, all area units)
- Add common mistakes (e.g., confusing m² with m, or km/h with m/s)
- Use units that would result from calculation errors
- Avoid obviously wrong categories (e.g., don't mix speed with temperature units)

## Quality Guidelines

**Task:**
- Clearly state what needs to be calculated or determined
- Include all necessary information for solving
- For tasks with units, clearly specify expectations in the task text
- Ensure the answer is an exact value (no rounding ambiguity)

**Response Fields:**
- `answer`: The correct numeric answer (required, must be a number)
- `unit`: The correct unit (optional string)
  - Omit for pure numeric tasks
  - Provide alone for display-only scenarios
  - Provide with unitOptions for selection scenarios
- `unitOptions`: Array of unit choices (optional string array)
  - Only use when unit selection is part of the task
  - Include 3-4 plausible options with distractors
  - The correct unit must be in this array
- `explanation`: Step-by-step solution walkthrough

**Explanation:**
- Show the complete calculation step-by-step
- Explain the formula or method used
- Reference specific values from the task
- Include the final answer with unit (if applicable)
- Make it educational and help students understand the process

## Examples

**Scenario 1: No Unit - Pure Calculation**
```json
{
  "type": "number_input",
  "title": "Simple Multiplication",
  "task": "What is 7 × 6?",
  "answer": 42,
  "explanation": "7 × 6 = 42"
}
```

**Scenario 2: Display-Only Unit**
```json
{
  "type": "number_input",
  "title": "Rectangle Area",
  "task": "Calculate the area of a rectangle with width 4.5 cm and height 6 cm. Give your answer in square centimeters.",
  "answer": 27,
  "unit": "cm²",
  "explanation": "Area = width × height = 4.5 cm × 6 cm = 27 cm²"
}
```

**Scenario 2: Display-Only Unit (Percentage)**
```json
{
  "type": "number_input",
  "title": "Percentage Calculation",
  "task": "In a class of 25 students, 15 are girls. What percentage of the class are girls?",
  "answer": 60,
  "unit": "%",
  "explanation": "Percentage = (number of girls ÷ total students) × 100 = (15 ÷ 25) × 100 = 60%"
}
```

**Scenario 3: Unit Selection (Physics)**
```json
{
  "type": "number_input",
  "title": "Velocity Calculation",
  "task": "A car travels 150 km in 2.5 hours. Calculate the average velocity and select the appropriate unit.",
  "answer": 60,
  "unit": "km/h",
  "unitOptions": ["m/s", "km/h", "mph", "km/min"],
  "explanation": "Average velocity = distance ÷ time = 150 km ÷ 2.5 hours = 60 km/h. Since distance is in km and time is in hours, the correct unit is km/h."
}
```

**Scenario 3: Unit Selection (Area)**
```json
{
  "type": "number_input",
  "title": "Garden Area",
  "task": "A rectangular garden is 8 meters long and 5 meters wide. Calculate its area and choose the correct unit.",
  "answer": 40,
  "unit": "m²",
  "unitOptions": ["m", "m²", "m³", "cm²"],
  "explanation": "Area = length × width = 8 m × 5 m = 40 m². Since we multiply two lengths, the result is in square meters (m²), not linear meters (m) or cubic meters (m³)."
}
```
