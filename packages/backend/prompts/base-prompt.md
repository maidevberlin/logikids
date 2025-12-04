---
id: base-prompt
name: Base Prompt
description: Master template showing prompt composition structure
---

# Task Brief

Generate an educational task for this student:

|              |                                      |
| ------------ | ------------------------------------ |
| **Student**  | Grade [[grade]]                      |
| **Subject**  | [[subject_name]]                     |
| **Concept**  | [[concept_name]] ([[concept_focus]]) |
| **Language** | [[language]]                         |

---

# Task Requirements

**Learning Objective:** [[selected_objective]]

**Problem Type:** [[selected_problem_type]]

**Difficulty ([[difficulty]]):**
[[difficulty_guidelines]]

**Avoid:**
[[anti_patterns]]

<%concept_template%>

---

# Creative Framing

<%variations_template%>

**Real-world context options:**
[[real_world_context]]

---

# Output Format

<%task_type_template%>

---

# Reference

## Task vs Solution Separation

The `task` field is what students see. It must NOT contain answers, explanations, or hints.

The `explanation` field contains the solution reasoning (shown after correct answer).

## Formatting Options

<%subject_base_template%>
