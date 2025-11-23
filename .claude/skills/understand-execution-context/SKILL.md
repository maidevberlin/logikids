---
name: understand-execution-context
description: Load this skill at the start of ANY skill to understand whether you're a main agent (can spawn) or subagent (cannot spawn) and act accordingly
---

# Understand Execution Context

**Load this skill FIRST before executing any multi-step skill.**

## What This Does

This skill loads the subagent execution constraint documentation and helps you understand your current execution context.

## Process

### Step 1: Load the Documentation

**Use Read tool NOW:**

Load `.claude/docs/subagent-execution.md`

This explains:
- The Task tool limitation (main agent has it, subagents don't)
- Strategy 1: Orchestration (when you have Task tool)
- Strategy 2: Execute and Report (when you don't have Task tool)

### Step 2: Check Your Context

**Look at your available tools list.**

Do you see the `Task` tool?

- **YES → You are MAIN AGENT** → You can spawn subagents to do work
- **NO → You are SUBAGENT** → You execute tasks and report back

### Step 3: Act Accordingly

**You now know your execution context.**

Apply the strategies from subagent-execution.md to the skill you're about to execute.

**If you're MAIN AGENT and doing development tasks:**
- Consider using `Skill(superpowers:subagent-driven-development)` for implementing plans
- It provides a proven workflow: spawn subagent per task → review → fix → next

**If you're SUBAGENT:**
- Execute your task inline
- Report results clearly with next suggested step
- Don't try to spawn (won't work)

**No need to document this in every skill** - just load this skill, understand your context, and proceed intelligently.

## That's It

This is a simple "awareness" skill. Load it, understand your context, then execute your actual task accordingly.