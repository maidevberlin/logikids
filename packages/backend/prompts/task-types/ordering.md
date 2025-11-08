---
id: ordering
name: Ordering
description: A task where students arrange 3-5 items in the correct sequence
---

Create an ordering task where students must arrange items in the correct sequence (chronological, alphabetical, size, process steps, etc.).

**CRITICAL**:
- Generate between 3-5 items (not fewer, not more)
- Items MUST have a clear, unambiguous correct sequence
- Randomize the initial order in which items are presented (the `items` array order should be random, NOT the correct order)
- The `correctOrder` array must contain the item IDs in the correct sequence
- Each item must have a unique `id` (use letters: "a", "b", "c", etc.)

## Quality Guidelines

**Items (3-5 total):**
- Create 3-5 items that need to be ordered
- Each item should be distinct and clearly different from the others
- Items must have an objective correct sequence (not subjective)
- Make items age-appropriate and clear
- Avoid ambiguous orderings where multiple sequences could be correct

**Sequence Types:**
- **Chronological**: Historical events, life cycle stages, story sequence
- **Alphabetical**: Words, names, places
- **Numerical**: Numbers from smallest to largest, quantities
- **Process**: Steps in a procedure, algorithm steps, scientific method
- **Size/Scale**: Objects by size, distances, measurements

**Task Description:**
- Clearly state the ordering criterion (e.g., "chronological order", "smallest to largest", "first step to last step")
- Be specific about the expected sequence direction
- Use phrases like "Arrange these...", "Put in order...", "Sort from..."

**Explanation:**
- Clearly explain why this is the correct order
- Reference the specific criterion used (dates, sizes, process logic, etc.)
- Help students understand the reasoning behind the sequence
- Include relevant facts or context that make the ordering clear

## Examples

**Chronological Ordering (History):**
```json
{
  "type": "ordering",
  "title": "World War II Events",
  "task": "Arrange these major World War II events in chronological order from earliest to latest.",
  "items": [
    {
      "id": "c",
      "content": "D-Day Normandy landings"
    },
    {
      "id": "a",
      "content": "Germany invades Poland"
    },
    {
      "id": "d",
      "content": "Atomic bombs dropped on Japan"
    },
    {
      "id": "b",
      "content": "Attack on Pearl Harbor"
    }
  ],
  "correctOrder": ["a", "b", "c", "d"],
  "explanation": "The correct chronological order is: (1) Germany invades Poland (September 1939) - this started World War II, (2) Attack on Pearl Harbor (December 1941) - bringing the US into the war, (3) D-Day Normandy landings (June 1944) - the Allied invasion of France, and (4) Atomic bombs dropped on Japan (August 1945) - ending the war."
}
```

**Process Ordering (Algorithm Steps):**
```json
{
  "type": "ordering",
  "title": "Binary Search Algorithm",
  "task": "Arrange these steps of the binary search algorithm in the correct order from first to last.",
  "items": [
    {
      "id": "d",
      "content": "Repeat until the target is found or the search space is empty"
    },
    {
      "id": "b",
      "content": "Find the middle element of the current search range"
    },
    {
      "id": "a",
      "content": "Start with a sorted array"
    },
    {
      "id": "c",
      "content": "Compare the middle element with the target value"
    },
    {
      "id": "e",
      "content": "Eliminate half of the remaining elements based on the comparison"
    }
  ],
  "correctOrder": ["a", "b", "c", "e", "d"],
  "explanation": "Binary search follows these steps: (1) Start with a sorted array - this is a prerequisite, (2) Find the middle element - to begin the search, (3) Compare the middle element with the target - to determine which half to search, (4) Eliminate half of the remaining elements - based on whether the target is greater or less than the middle element, and (5) Repeat until found - continue the process with the remaining half until the target is located or the search space becomes empty."
}
```

**Numerical Ordering (Size):**
```json
{
  "type": "ordering",
  "title": "Decimal Numbers",
  "task": "Arrange these decimal numbers from smallest to largest.",
  "items": [
    {
      "id": "b",
      "content": "0.75"
    },
    {
      "id": "c",
      "content": "1.2"
    },
    {
      "id": "a",
      "content": "0.03"
    }
  ],
  "correctOrder": ["a", "b", "c"],
  "explanation": "From smallest to largest: 0.03 (three hundredths), 0.75 (seventy-five hundredths or three quarters), and 1.2 (one and two tenths). When comparing decimals, we compare place values from left to right: ones, tenths, hundredths, etc."
}
```
