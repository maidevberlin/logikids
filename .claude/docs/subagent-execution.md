# Subagent Execution Constraint

## The Limitation

**Claude Code blocks recursive agent spawning:**

- Main session → HAS Task tool → CAN spawn subagents ✅
- Spawned subagent → NO Task tool → CANNOT spawn further agents ❌

**Detection:** Check if Task tool is in your available tools list.

## Two Execution Strategies

### Strategy 1: Orchestration (Main Agent Only)

**When you have Task tool:**

Use it to spawn agents that do work and report back to you. You orchestrate.

**Examples:**
- Spawn 20 parallel generation agents → collect results → spawn review agents → iterate
- Spawn single agent for task → receive result → spawn next agent based on outcome
- Resume failed agents with fixes

**Your role:** Orchestrator - spawn agents, collect results, make decisions, repeat.

---

### Strategy 2: Execute and Report (Subagent)

**When you DON'T have Task tool:**

Execute what you can inline (bash, file operations, analysis), then report results back to whoever spawned you.

**If multi-step process needed:**
- Do current step
- Report results with clear next action
- Let main agent orchestrate next step

**Examples:**
- Generate file → report "file created, needs review" → main agent spawns reviewer
- Review work → report "FAIL: issues X, Y, Z" → main agent spawns fixer
- Test output → report "analysis results: ..." → main agent decides next step

**Your role:** Worker - execute task, provide clear results, suggest next step.

## Implications for Skills

**All skills should be aware of this constraint.**

Load this document at the start of your skill to understand the execution context.

**If you're main agent:**
- Your spawned agents will execute tasks and report back
- You orchestrate the workflow (spawn → collect → decide → spawn)
- Multi-step processes: you drive the iteration

**If you're subagent:**
- You execute the current task
- You report results clearly
- You tell the main agent what should happen next
- You DON'T try to spawn agents (won't work)

## Practical Patterns

**Pattern: Review Loop**
- Main: Spawn generator → receive result → spawn reviewer → receive verdict
- If PASS: done
- If FAIL: Resume generator with fixes → repeat

**Pattern: Parallel Work**
- Main: Spawn N agents in one message → all run concurrently → collect N results

**Pattern: Inline Execution**
- Subagent: Can't spawn sub-skill? Run the same logic inline (bash commands, file operations).

**Pattern: Clear Handoff**
- Subagent: "I've completed X. Next step: Y. Main agent should spawn Z with parameters [...]"

## That's It

Agents are smart enough to figure out the implications. Just be aware of the constraint and act accordingly based on whether you have Task tool access.