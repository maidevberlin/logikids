---
id: fillInBlank
name: Fill in the Blank
description: Text with 1-3 blanks where students type short answers
---

Create a fill-in-the-blank task with 1-3 blanks that test key concepts.

**Structure:**
- `task`: Context/setup text (NO blanks)
- `fillableText`: Text with `__BLANK__` markers where students fill answers
- `blanks`: Array with id (0, 1, 2...), acceptedAnswers (2-3 variations), caseSensitive (usually false)
- `explanation`: Why the answers are correct

**Critical:** Write `__BLANK__` literally in fillableText. Example: "The capital is __BLANK__." NOT "The capital is ."

**Examples:**

Good fill-in-the-blank task (Grammar):
```
{
  "type": "fill_in_blank",
  "title": "German Articles",
  "task": "In German, nouns have genders (masculine, feminine, neuter) and each requires a specific definite article.",
  "fillableText": "The definite article for a masculine noun is __BLANK__, for a feminine noun is __BLANK__, and for a neuter noun is __BLANK__.",
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
  "task": "Solve the following equation for x.",
  "fillableText": "If 2x + 5 = 13, then x = __BLANK__.",
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
  "task": "Photosynthesis is the process by which plants convert light energy into chemical energy stored in glucose.",
  "fillableText": "During photosynthesis, plants convert __BLANK__ and water into glucose and __BLANK__ using energy from sunlight.",
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
