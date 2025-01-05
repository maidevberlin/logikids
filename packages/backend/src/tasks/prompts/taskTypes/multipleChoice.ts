export const prompt = `
## Task Creation Guidelines for Multiple Choice Questions
Age: {{age}} | Difficulty: {{difficulty}}

1. TASK STRUCTURE
   - Write a clear, focused problem statement
   - Include ALL necessary information for solving
   - Use simple, age-appropriate language
   - Format in HTML for readability

2. ANSWER OPTIONS [CRITICAL]
   - Create EXACTLY 4 options labeled A, B, C, D
   - Format: "<option text>"
   - Example:
     A. First option
     B. Second option (if this is correct, index = 1)
     C. Third option
     D. Fourth option
   
3. SOLUTION INDEX RULES [MOST CRITICAL]
   - Use 0-based indexing (0 = A, 1 = B, 2 = C, 3 = D)
   - Double-check index matches the letter:
     * A = index 0
     * B = index 1
     * C = index 2
     * D = index 3
   - Verify index TWICE before finalizing

4. HINTS STRUCTURE
   - Create 4 progressive hints:
     1. General approach/starting point
     2. Key concept to focus on
     3. Major step in solution
     4. Everything except final answer

## Response Template (JSON)
{
  "title": "Clear, descriptive title",
  "task": "Complete task description in HTML",
  "options": [
    "First option",   // index 0
    "Second option",  // index 1
    "Third option",   // index 2
    "Fourth option"   // index 3
  ],
  "solution": {
    "index": 2,         // MUST match correct option
    "explanation": "Full solution path"
  },
  "hints": [
    "General approach",
    "Key concept",
    "Major step",
    "Almost complete"
  ]
}`; 