---
id: base-prompt
name: Base Prompt
description: Master template showing prompt composition structure
---

# Guidelines

Generate an educational task that is engaging, clear, and age-appropriate.

## Requirements

- **Language**: All content in {{language}}
- **Target**: Age {{age}}, Grade {{grade}}, Difficulty {{difficulty}}
- **Format**: Markdown only

{{variations_template}}

## Available Formatting

- LaTeX: `$x^2$` (inline), `$$\frac{a}{b}$$` (block)
- Code blocks: ` ```python `
- Mermaid diagrams: ` ```mermaid `
- Tables, **bold**, *italic*, lists, quotes

---

{{subject_base_template}}

# Task creation
{{task_type_template}}

# Task content
## Learning objectives
{{learning_objectives}}

## Real world context
{{real_world_context}}

## Example Tasks
{{example_tasks}}

{{concept_template}}
