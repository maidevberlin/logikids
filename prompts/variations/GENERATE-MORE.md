# Generate More Variations

Use this template to expand any variation dimension with more examples.

## Instructions

1. Copy the current content from the dimension file you want to expand
2. Paste it in the "Current Examples" section below
3. Specify how many new entries you want to generate (typically 50-100)
4. Run this prompt through an LLM
5. Review the generated content for quality and appropriateness
6. Append approved entries to the actual variation file

## Requirements

Generate variations that are:

- **Age-appropriate:** Suitable for the specified age range (8-16 years)
- **Culturally diverse:** Include examples from different cultures, backgrounds, and contexts
- **Inclusive:** Avoid stereotypes, violence, or sensitive topics
- **Adaptable:** Work across all subjects (math, logic, language, science, music)
- **Clear and simple:** Use straightforward language
- **Varied:** Don't repeat themes or patterns from existing examples

## Format Requirements

### For Scenarios (with age ranges):
```yaml
---
scenarios:
  - context: "description of the scenario"
    minAge: 8
    maxAge: 16
---
```

### For Other Dimensions (simple strings):
```yaml
---
[dimension_key]:
  - "First variation example"
  - "Second variation example"
---
```

## Current Dimension Being Expanded

**Dimension Name:** [REPLACE WITH: scenarios / framings / dynamics / etc.]

## Current Examples

```yaml
[PASTE CURRENT FILE CONTENTS HERE]
```

## Generate Additional Entries

**Number to Generate:** [SPECIFY: e.g., 50, 100]

**LLM generates new entries below in the same YAML format:**

```yaml
---
# Generated variations will appear here
---
```

## Review Checklist

After generation, verify:

- [ ] All entries follow the correct YAML format
- [ ] Age ranges are appropriate (for scenarios)
- [ ] Content is culturally diverse and inclusive
- [ ] No duplicate or near-duplicate entries
- [ ] Language is clear and age-appropriate
- [ ] Examples work across different subjects
- [ ] No sensitive topics or stereotypes

## Usage After Generation

1. Copy approved entries
2. Paste into the actual variation file (`/prompts/variations/[dimension].md`)
3. Commit to repository
4. Server will auto-reload variations (in dev mode with chokidar)
