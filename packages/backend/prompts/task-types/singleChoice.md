---
id: singleChoice
name: Single Choice
description: A task with exactly 4 options where one is correct
---

Create a multiple choice task with a question and 4 answer options where exactly one is correct.

**CRITICAL**:
- One of the generated Options MUST BE CORRECT. Double check and regenerate all options if you find a mistake.
- Randomize the position of the correct answer. Do NOT always put it first. The correct answer should appear in different positions (1st, 2nd, 3rd, or 4th) with equal probability. Avoid any position bias.
- Each option can optionally include an `explanation` field to clarify why it is correct or incorrect
- The root-level `explanation` field is required and should provide a comprehensive explanation of the correct answer

## Quality Guidelines

**Task Text:**
- Clearly state what is being asked
- Provide all necessary context and information
- Make the question unambiguous
- Ensure the question tests understanding, not trick knowledge
- Include relevant formulas, definitions, or context as needed

**Options (exactly 4):**
- Create exactly 4 options total
- One correct option - mark with `isCorrect: true`
- Three plausible but incorrect options - mark with `isCorrect: false`
- All options should be grammatically consistent with the question
- Options should be similar in length and detail (avoid obvious patterns)
- Use parallel structure across all options

**Creating Plausible Distractors (incorrect options):**
Distractors are the incorrect options that should challenge students' understanding. Good distractors:
- Are believable and might appeal to students with partial understanding
- Target common misconceptions or calculation errors
- Are not obviously absurd or impossible
- Do not use extreme language ("always", "never") unless contextually appropriate
- Relate to the topic but contain subtle errors
- Might result from common mistakes in the solving process
- Are based on realistic alternative interpretations or partial knowledge

Examples of GOOD distractors:
- For "2 + 3 × 4 = ?": Include "20" (wrong order of operations) as well as "14" (correct)
- For "Capital of France": Include "Lyon" or "Marseille" (major French cities) not "Berlin" (different country)
- For a definition question: Include partial definitions or related concepts
- For historical dates: Use dates of related events, not random years

Examples of BAD distractors:
- Nonsensical answers that no one would choose
- Answers from completely different topics
- Extremely long or extremely short options when others are similar length
- Options with obvious grammatical errors
- Joke answers or clearly impossible values

**Randomizing Answer Position:**
- Distribute correct answers across all 4 positions with equal probability
- Avoid patterns like "always third option" or "mostly first option"
- Don't use alphabetical or numerical ordering as a cue
- Position should not correlate with difficulty
- Mix up the position between tasks

**Using Explanation Fields:**

**Root-level `explanation` (required):**
- Provide a clear, comprehensive explanation of why the correct answer is right
- Show the reasoning process or calculation steps
- Reference key concepts or principles
- Help students understand the underlying concept
- Make it educational and thorough

**Per-option `explanation` (optional):**
- Add to the correct option to reinforce why it's right
- Add to common wrong answers to explain the misconception
- Keep explanations concise but educational
- Use to address specific errors students might make
- Not required for all options, focus on the most instructive ones

## Examples

**Math (Basic Algebra):**
```json
{
  "type": "single_choice",
  "title": "Solving Linear Equations",
  "task": "Solve for x: 3x - 7 = 14",
  "options": [
    {
      "text": "x = 5",
      "isCorrect": false,
      "explanation": "This would be correct if the equation were 3x = 15, but we need to add 7 first: 3x = 21."
    },
    {
      "text": "x = 7",
      "isCorrect": true,
      "explanation": "Correct! Add 7 to both sides: 3x = 21. Then divide by 3: x = 7."
    },
    {
      "text": "x = 21",
      "isCorrect": false,
      "explanation": "This is the value of 3x, not x. You need to divide 21 by 3 to get x = 7."
    },
    {
      "text": "x = 3",
      "isCorrect": false
    }
  ],
  "explanation": "To solve 3x - 7 = 14, we use inverse operations. First, add 7 to both sides: 3x - 7 + 7 = 14 + 7, which gives us 3x = 21. Then divide both sides by 3: x = 21 ÷ 3 = 7. We can verify: 3(7) - 7 = 21 - 7 = 14 ✓"
}
```

**Science (Biology):**
```json
{
  "type": "single_choice",
  "title": "Photosynthesis",
  "task": "What is the primary pigment responsible for capturing light energy during photosynthesis?",
  "options": [
    {
      "text": "Carotene",
      "isCorrect": false,
      "explanation": "Carotene is an accessory pigment that assists in photosynthesis but is not the primary pigment."
    },
    {
      "text": "Hemoglobin",
      "isCorrect": false,
      "explanation": "Hemoglobin is found in blood cells and transports oxygen, not involved in photosynthesis."
    },
    {
      "text": "Chlorophyll",
      "isCorrect": true,
      "explanation": "Correct! Chlorophyll is the primary pigment that absorbs light energy, particularly red and blue wavelengths, making plants appear green."
    },
    {
      "text": "Xanthophyll",
      "isCorrect": false,
      "explanation": "Xanthophyll is another accessory pigment that helps capture light but is not the primary pigment."
    }
  ],
  "explanation": "Chlorophyll is the main photosynthetic pigment found in the chloroplasts of plant cells. It absorbs light energy most efficiently in the red and blue wavelengths of the visible spectrum, reflecting green light (which is why plants appear green). While accessory pigments like carotene and xanthophyll also help capture light, chlorophyll is the primary pigment that converts light energy into chemical energy during photosynthesis."
}
```

**Language (German Grammar):**
```json
{
  "type": "single_choice",
  "title": "German Verb Conjugation",
  "task": "Which sentence correctly uses the verb 'sein' (to be) in the present tense for 'we are'?",
  "options": [
    {
      "text": "Wir seid glücklich",
      "isCorrect": false,
      "explanation": "This uses the 'ihr' (you plural) form. The correct form for 'wir' is 'sind'."
    },
    {
      "text": "Wir sind glücklich",
      "isCorrect": true
    },
    {
      "text": "Wir bin glücklich",
      "isCorrect": false,
      "explanation": "This uses the 'ich' (I) form. The correct form for 'wir' is 'sind'."
    },
    {
      "text": "Wir ist glücklich",
      "isCorrect": false,
      "explanation": "This uses the 'er/sie/es' (he/she/it) form. The correct form for 'wir' is 'sind'."
    }
  ],
  "explanation": "The verb 'sein' (to be) is irregular in German and must be conjugated correctly. For the first-person plural 'wir' (we), the correct present tense form is 'sind'. The complete conjugation is: ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind. Therefore, 'Wir sind glücklich' (We are happy) is the correct answer."
}
```

**Math (Geometry):**
```json
{
  "type": "single_choice",
  "title": "Circle Circumference",
  "task": "What is the circumference of a circle with a radius of 5 cm? (Use π ≈ 3.14)",
  "options": [
    {
      "text": "15.7 cm",
      "isCorrect": false,
      "explanation": "This is the result of calculating π × r instead of 2π × r."
    },
    {
      "text": "31.4 cm",
      "isCorrect": true
    },
    {
      "text": "78.5 cm",
      "isCorrect": false,
      "explanation": "This is the area (π × r²), not the circumference."
    },
    {
      "text": "10 cm",
      "isCorrect": false,
      "explanation": "This is just the diameter (2 × r), missing the π factor."
    }
  ],
  "explanation": "The circumference of a circle is calculated using the formula C = 2πr, where r is the radius. With r = 5 cm and π ≈ 3.14, we get: C = 2 × 3.14 × 5 = 31.4 cm. Note that the area formula is πr² (which would give 78.5 cm²), and the diameter is 2r (which would give 10 cm), but circumference specifically requires the 2πr formula."
}
```

## Output Format

```json
{
  "type": "single_choice",
  "title": "string",
  "task": "string (markdown supported)",
  "options": [
    {
      "text": "string (markdown supported)",
      "isCorrect": boolean,
      "explanation": "string (optional, markdown supported)"
    }
  ],
  "explanation": "string (required, markdown supported)"
}
```
