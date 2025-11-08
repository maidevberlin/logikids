---
id: numberInput
name: Number Input
description: A task requiring numeric input with optional unit and tolerance validation
---

Create a number input task that requires calculating or determining a numeric value.

**CRITICAL**:
- The `solution.value` field MUST be a number (NOT a string)
- If a unit is required, provide it in `solution.unit` as a string
- Specify `solution.tolerance` as a decimal number for acceptable range (e.g., 0.01 for ±0.01)
- Include all unit variations in `solution.acceptedUnits` array (e.g., ["m²", "m^2", "sq m"])
- Ensure calculations are appropriate for the student's age and grade level
- Double-check your math before generating the response

## Quality Guidelines

**Task:**
- Clearly state what needs to be calculated or determined
- Include all necessary information for solving
- Be explicit about precision requirements (e.g., "round to 2 decimal places")
- For physics/science tasks, clearly specify which units are expected

**Solution:**
- `value`: The correct numeric answer (required)
- `unit`: The unit of measurement if applicable (optional, e.g., "m²", "kg", "%", "°C")
- `tolerance`: Acceptable margin of error (default: 0.01 for ±0.01)
  - Use 0.01 for most decimal calculations
  - Use 0.1 or 1 for whole number calculations where rounding is expected
  - Use 0.001 for high-precision scientific calculations
- `acceptedUnits`: Array of equivalent unit representations (e.g., ["m/s", "m·s⁻¹"])
  - Include common variations (superscripts, symbols, abbreviations)
  - Example: ["m²", "m^2", "sq m", "square meters"]

**Explanation:**
- Show the complete calculation step-by-step
- Explain the formula or method used
- Reference specific values from the task
- Include the final answer with unit (if applicable)
- Make it educational and help students understand the process

## Examples

**Math (with unit):**
```json
{
  "type": "number_input",
  "title": "Rectangle Area",
  "task": "Calculate the area of a rectangle with width 4.5 cm and height 6 cm. Give your answer in square centimeters.",
  "solution": {
    "value": 27,
    "unit": "cm²",
    "tolerance": 0.1,
    "acceptedUnits": ["cm²", "cm^2", "sq cm"],
    "explanation": "Area = width × height = 4.5 cm × 6 cm = 27 cm²"
  }
}
```

**Physics (with unit):**
```json
{
  "type": "number_input",
  "title": "Velocity Calculation",
  "task": "A car travels 150 km in 2.5 hours. Calculate its average velocity in km/h.",
  "solution": {
    "value": 60,
    "unit": "km/h",
    "tolerance": 0.1,
    "acceptedUnits": ["km/h", "km/hr", "kmh"],
    "explanation": "Average velocity = distance ÷ time = 150 km ÷ 2.5 hours = 60 km/h"
  }
}
```

**Percentage:**
```json
{
  "type": "number_input",
  "title": "Percentage Calculation",
  "task": "In a class of 25 students, 15 are girls. What percentage of the class are girls?",
  "solution": {
    "value": 60,
    "unit": "%",
    "tolerance": 0.1,
    "acceptedUnits": ["%", "percent"],
    "explanation": "Percentage = (number of girls ÷ total students) × 100 = (15 ÷ 25) × 100 = 60%"
  }
}
```
