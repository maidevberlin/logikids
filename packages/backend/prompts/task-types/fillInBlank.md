---
id: fillInBlank
name: Fill in the Blank
description: Text with 1-3 blanks where students type short answers
---

Create a fill-in-the-blank task with 1-3 blanks that test key concepts.

**CRITICAL**:
- Use exactly `{{blank}}` as the placeholder marker in the task text (case-sensitive, with double curly braces)
- Generate 1-3 blanks per task (not overwhelming for students)
- Blanks should test KEY CONCEPTS, not trivial words (e.g., articles, conjunctions)
- The `blanks` array MUST be ordered sequentially (id: 0, 1, 2, etc.) matching the order of `{{blank}}` markers in the task text
- Each blank MUST have an `acceptedAnswers` array with 2-3 valid variations/synonyms
- Set `caseSensitive: false` by default; only use `true` for proper nouns, abbreviations, or when case matters
- The `explanation` field MUST be a string providing clear reasoning and showing the correct answers

## Quality Guidelines

**Task Text:**
- Include 1-3 `{{blank}}` markers in natural positions
- Ensure the text flows naturally with blanks
- Provide enough context for students to determine the answer
- Blanks should test understanding, not guessing

**Blanks Array:**
- Order blanks sequentially (id: 0, 1, 2) matching left-to-right appearance in task text
- Each blank needs an `id` (number), `acceptedAnswers` (array of strings), and `caseSensitive` (boolean)
- Include 2-3 acceptable answer variations per blank:
  - Synonyms (e.g., "big", "large")
  - Alternative spellings (e.g., "color", "colour")
  - Common abbreviations (e.g., "USA", "U.S.A.", "United States")
  - Numeric variations if applicable (e.g., "2.1", "2.2", "2")
- Use `caseSensitive: true` only when necessary:
  - Proper nouns (e.g., "Paris", "Einstein")
  - Abbreviations (e.g., "DNA", "USA")
  - When case changes meaning (rare)
- Use `caseSensitive: false` for:
  - Common nouns
  - General terminology
  - Numbers and dates

**Explanation:**
- Show the complete sentence with all correct answers filled in
- Explain WHY each answer is correct
- Reference the key concepts being tested
- Make it educational and clear

**Examples:**

Good fill-in-the-blank task (Grammar):
```
{
  "type": "fill_in_blank",
  "title": "German Articles",
  "task": "In German, the definite article for a masculine noun is {{blank}}, for a feminine noun is {{blank}}, and for a neuter noun is {{blank}}.",
  "blanks": [
    {
      "id": 0,
      "acceptedAnswers": ["der", "Der"],
      "caseSensitive": false
    },
    {
      "id": 1,
      "acceptedAnswers": ["die", "Die"],
      "caseSensitive": false
    },
    {
      "id": 2,
      "acceptedAnswers": ["das", "Das"],
      "caseSensitive": false
    }
  ],
  "explanation": "In German, the definite articles are: der (masculine), die (feminine), and das (neuter). These articles must match the gender of the noun they accompany."
}
```

Good fill-in-the-blank task (Math):
```
{
  "type": "fill_in_blank",
  "title": "Equation Solution",
  "task": "If 2x + 5 = 13, then x = {{blank}}.",
  "blanks": [
    {
      "id": 0,
      "acceptedAnswers": ["4", "4.0"],
      "caseSensitive": false
    }
  ],
  "explanation": "To solve 2x + 5 = 13, first subtract 5 from both sides: 2x = 8. Then divide by 2: x = 4."
}
```

Good fill-in-the-blank task (Science):
```
{
  "type": "fill_in_blank",
  "title": "Photosynthesis",
  "task": "During photosynthesis, plants convert {{blank}} and water into glucose and {{blank}} using energy from sunlight.",
  "blanks": [
    {
      "id": 0,
      "acceptedAnswers": ["carbon dioxide", "CO2", "CO₂"],
      "caseSensitive": false
    },
    {
      "id": 1,
      "acceptedAnswers": ["oxygen", "O2", "O₂"],
      "caseSensitive": false
    }
  ],
  "explanation": "Photosynthesis uses carbon dioxide (CO₂) and water (H₂O) to produce glucose (C₆H₁₂O₆) and oxygen (O₂). This process requires sunlight energy and occurs in plant chloroplasts."
}
```
