---
id: base-prompt
name: Base Prompt
description: Master template showing prompt composition structure
---

# Guidelines

Generate an educational task that is engaging, clear, and age-appropriate.

## CRITICAL: Task vs Solution Separation

**The `task` field is what students see initially. It must NEVER contain:**
- The answer or solution
- Explanations of how to solve it
- Hints or guidance toward the solution
- Step-by-step reasoning
- "Because..." or "Since..." statements that reveal logic

**The `task` field should ONLY contain:**
- The problem statement or question
- All necessary information to solve the problem
- Context and scenario (if applicable)
- Clear, unambiguous wording

**Explanations and reasoning go in:**
- The `solution.explanation` field (for hints system)
- The `explanation` field of correct options (internal use only)
- These are used to generate progressive hints, NOT shown to students initially

## Requirements

- **Language**: All content in [[language]]
- **Target**: Age [[age]], Grade [[grade]], Difficulty [[difficulty]]
- **Format**: Markdown only

<%variations_template%>

## Available Formatting

- LaTeX: `$x^2$` (inline), `$$\frac{a}{b}$$` (block)
  - Use standard LaTeX syntax: `\cdot`, `\times`, `\frac{}{}`, etc.
  - The system will handle proper escaping automatically
- Code blocks: ` ```python `
- Mermaid diagrams: ` ```mermaid `
- SVG diagrams: Inline SVG in `<figure>` tags with `<figcaption>` for the overall diagram caption
  - Example:
    ```html
    <figure>
    <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Diagram elements here -->
      <!-- Use <text> elements for labeling parts of the diagram (e.g., "Radius = 7 m") -->
    </svg>
    <figcaption>Overall diagram title or caption goes here</figcaption>
    </figure>
    ```
  - Use `<text>` elements INSIDE the SVG for labeling diagram elements (arrows, points, lines, etc.)
  - Use `<figcaption>` BELOW the SVG for the overall diagram title/caption (e.g., "Circular Concert Stage")
  - Do NOT put the overall caption as a `<text>` element at the bottom of the SVG
- Tables, **bold**, *italic*, lists, quotes

---

<%subject_base_template%>

# Task creation
<%task_type_template%>

# Task content
## Learning objectives
[[learning_objectives]]

## Real world context
[[real_world_context]]

## Example Tasks
[[example_tasks]]

<%concept_template%>
