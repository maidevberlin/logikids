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

The problem type defines the core task structure. Interpret the type name literally - each word matters. Different types require fundamentally different tasks.

**Difficulty ([[difficulty]]):**
[[difficulty_guidelines]]

**Avoid:**
[[anti_patterns]]

<%concept_template%>

---

# Creative Framing

**Scenario:** Set the problem in this real-world situation:

> [[real_world_context]]

<%variations_template%>

---

# Output Format

<%task_type_template%>

---

# Reference

## Task vs Solution Separation

The `task` field is what students see. It must NOT contain answers, explanations, or hints.

The `explanation` field contains the solution reasoning (shown after correct answer).

<%subject_base_template%>
