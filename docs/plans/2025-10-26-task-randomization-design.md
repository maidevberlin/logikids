# Task Randomization System Design

**Date:** 2025-10-26
**Status:** Design Complete
**Goal:** Add randomization to task generation to prevent repetitive content and increase student engagement

---

## Problem Statement

Currently, the LLM starts fresh with each task request, resulting in repetitive task contexts. Students see similar scenarios repeatedly (e.g., "apples and oranges" problems), which reduces engagement despite the educational content being correct.

## Goals

1. **Engagement:** Make learning more engaging through diverse, interesting scenarios
2. **Variety:** Generate hundreds of unique variations without code changes
3. **Maintainability:** Non-technical editors can add/edit variations in markdown files
4. **Performance:** Maintain fast response times (<3s), minimal token overhead (<100 tokens/task)

## Solution Architecture

### Core Variation System

Every task gets **3 baseline variations** (always applied):

1. **Scenario Context:** Random context/setting from 100+ options (e.g., "birthday party", "space station", "soccer game")
2. **Age-Based Language Style:** Tone presets based on age brackets (8-10, 11-13, 14-16)
3. **Gender Context:** User's gender (if provided) mentioned to LLM for natural variation

### Enrichment System

**30-50% of tasks** get 1-2 additional variations randomly selected from:

- **Problem Framing:** Presentation format (letter, news article, recipe, scoreboard, diary entry, etc.)
- **Complexity Noise:** Irrelevant information students must filter out
- **Multi-Character Dynamics:** Social configurations (solo, collaboration, competition, helping)
- **Temporal Framing:** Time perspectives (past, present, future, conditional)
- **Metacognitive Prompts:** Thinking prompts (explain reasoning, what-if, alternatives)
- **Mystery/Discovery:** Reverse engineering, answer given first
- **Real-World Connections:** Explicit applications to daily life
- **Emotional/Motivational Framing:** Achievement, curiosity, helpfulness angles
- **Problem Structure Variation:** Multi-step, comparison, estimation approaches

## File Structure

### Backend: Variation Files

```
/prompts/variations/
  scenarios.md                    # 100+ contexts with age ranges
  problem-framings.md             # 20-30 presentation formats
  character-dynamics.md           # 15-20 social configurations
  temporal-contexts.md            # 12-15 time perspectives
  metacognitive-prompts.md        # 20-25 thinking prompts
  mystery-framings.md             # 15-20 discovery patterns
  real-world-connections.md       # 30-40 application contexts
  emotional-framings.md           # 20-25 motivational angles
  structure-variations.md         # 15-20 problem structures

  GENERATE-NEW-DIMENSION.md       # Meta-prompt for new dimensions
  GENERATE-scenarios.md           # Expansion prompt for scenarios
  GENERATE-framings.md            # Expansion prompt for framings
  # ... one GENERATE-*.md per dimension
```

### Variation File Format

**Example: scenarios.md**

```yaml
---
scenarios:
  - context: "birthday party celebration"
    minAge: 8
    maxAge: 16
  - context: "space station operations"
    minAge: 10
    maxAge: 16
  - context: "farmer's market shopping"
    minAge: 8
    maxAge: 12
  # ... 100+ more
---
```

**Example: problem-framings.md**

```yaml
---
framings:
  - "Present this as a letter from a friend"
  - "Format this as a news article"
  - "Write this as a recipe with steps"
  - "Present as a game scoreboard with statistics"
  # ... 20-30 more
---
```

### Content Generation Strategy

Since variation lists need 100+ entries, use **LLM-assisted generation**:

1. Hand-craft 5-10 seed examples per dimension
2. Use `GENERATE-{dimension}.md` prompts to expand to 50-100+ entries
3. Review generated content for appropriateness
4. Commit to repository

**Workflow:**
- Copy generation prompt template
- Paste current examples
- Run through LLM (Claude, GPT, etc.)
- Review and edit output
- Append to variation file

## Backend Implementation

### New Components

**1. VariationLoader** (`variation.loader.ts`)

```typescript
class VariationLoader {
  private scenarios: Scenario[] = [];
  private framings: string[] = [];
  // ... other dimensions

  async loadAll() {
    // Load all variation files from /prompts/variations/
    // Parse YAML frontmatter with gray-matter
    // Cache in memory for fast access
  }

  getScenario(age?: number): string {
    // Filter scenarios by age range if age provided
    // Pick random from eligible scenarios
  }

  getRandomEnrichment(): { type: string, value: string } | null {
    // 30-50% chance to return enrichment
    // Pick random dimension, random value
  }
}
```

**2. Variation Types** (`variation.types.ts`)

```typescript
interface Scenario {
  context: string;
  minAge: number;
  maxAge: number;
}

interface Enrichment {
  type: 'framing' | 'character' | 'temporal' | 'metacognitive' | 'mystery' | /* ... */;
  value: string;
}
```

### Modified Components

**1. PromptBuilder** (`prompt.builder.ts`)

Add variation variables to existing template variables:

```typescript
buildPrompt(params: TaskGenerationParams): string {
  const baseVariables = { /* existing vars */ };

  // Add variation variables
  const variationVariables: any = {
    scenario: variationLoader.getScenario(params.age),
  };

  // Conditionally add user context if available
  if (params.age) {
    variationVariables.language_style = this.getLanguageStyle(params.age);
  }

  if (params.gender) {
    variationVariables.student_gender = params.gender;
  }

  // Add enrichment (30-50% chance)
  const enrichment = variationLoader.getRandomEnrichment();
  if (enrichment) {
    variationVariables.enrichment_instruction = enrichment.value;
  }

  const allVariables = { ...baseVariables, ...variationVariables };
  return TemplateProcessor.replace(template, allVariables);
}

private getLanguageStyle(age: number): string {
  if (age <= 10) return "Use very simple, playful language with short sentences.";
  if (age <= 13) return "Use casual but structured language. Explain clearly.";
  return "Use sophisticated, respectful tone. Assume critical thinking.";
}
```

**2. TaskService** (`task.service.ts`)

Load variations on startup, pass to PromptBuilder:

```typescript
export class TaskService {
  private readonly variationLoader: VariationLoader;

  constructor(private readonly aiClient: AIClient) {
    this.variationLoader = new VariationLoader();
    await this.variationLoader.loadAll();
  }

  async generateTask(request: TaskRequest, language: string) {
    // Existing logic...
    const promptBuilder = new PromptBuilder(
      subject,
      selectedTaskType,
      hintPrompt,
      this.variationLoader  // NEW: pass variations
    );
  }
}
```

**3. TaskRequest Type** (`types.ts`)

Add optional gender parameter:

```typescript
interface TaskRequest {
  subject: string;
  concept: string;
  taskType?: string;
  age: number;
  difficulty: string;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
}
```

### Template Changes

Modify all subject `base.md` files to include variation sections:

```markdown
---
id: math
name: Math
---

## Scenario Context
Set this task in the following context: {{scenario}}

{{#if enrichment_instruction}}
## Additional Variation
{{enrichment_instruction}}
{{/if}}

{{#if language_style}}
## Language Style
{{language_style}}
{{/if}}

{{#if student_gender}}
## Student Context
The student identifies as {{student_gender}}.
{{/if}}

## Your Role
You are a creative math teacher...
```

## Frontend Implementation

### User Profile Storage

**localStorage Schema:**

```typescript
interface UserProfile {
  age: number;              // Age when entered (e.g., 10)
  ageEnteredAt: string;     // ISO date when user provided age
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | null;
}

// Key: 'logikids_user_profile'
```

**Age Calculation:**

```typescript
function getCurrentAge(profile: UserProfile): number {
  const enteredDate = new Date(profile.ageEnteredAt);
  const now = new Date();
  const yearsElapsed = Math.floor(
    (now.getTime() - enteredDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );
  return profile.age + yearsElapsed;
}
```

### New Components

```
features/Profile/
  ProfilePrompt/
    ProfilePrompt.tsx       # Modal with age input + gender radio buttons
  useUserProfile.ts         # Hook to get/set/calculate profile data
```

**ProfilePrompt UX:**
- Shows before first task if localStorage empty
- Friendly copy: "Help us personalize your learning experience!"
- Age input (number, 8-16 range)
- Gender radio buttons: Male / Female / Non-binary / Prefer not to say
- Skip button (omits data, uses no profile)
- Accessible from Account settings later

### Task Request Integration

Modify `features/Task/useTask.ts`:

```typescript
const profile = useUserProfile();
const currentAge = profile ? getCurrentAge(profile) : undefined;
const gender = profile?.gender || undefined;

const { data: task } = useQuery({
  queryKey: ['task', subject, concept, currentAge, gender, /* ... */],
  queryFn: () => api.getTask({
    subject,
    concept,
    age: currentAge,
    gender: gender,
    // ... other params
  })
});
```

### API Changes

```
GET /api/task?subject=...&concept=...&age=10&gender=female&...
```

Both `age` and `gender` are optional query parameters.

## Handling Missing Data

**Simple Rules (pre-production app, no backward compatibility needed):**

- If `gender` not in localStorage → don't send to backend, don't add to prompt
- If `age` not in localStorage → don't send to backend, don't add to prompt
- Scenario selection: if no age provided, pick from all scenarios (no filtering)
- Language style: if no age provided, omit language_style variable
- Variations (scenario, enrichment) still work without user profile

## Technical Validation

**What to Test:**

1. ✓ Variation files load without errors (check server startup logs)
2. ✓ Variables appear in final prompt (enable `NODE_ENV=development`)
3. ✓ Age filtering works (scenarios match age range)
4. ✓ Enrichment appears ~30-50% of time
5. ✓ Profile data flows from frontend → backend → prompt

**LLM output quality is tested during real usage, not in this implementation phase.**

## Success Metrics

- 20 consecutive tasks have 15+ different scenarios (75% variety)
- Enrichments appear in 30-50% of tasks
- Token count increase <100 tokens per task
- Response time stays under 3 seconds
- No errors in variation loading

## Future Enhancements (Not in Scope)

- Track which variations user has seen, avoid repetition across sessions
- User-selected interests to weight scenario selection
- Subject-specific scenarios (currently universal)
- A/B testing different enrichment probability rates
- Analytics on which variations drive best engagement

## Implementation Checklist

**Backend:**
- [ ] Create `/prompts/variations/` directory structure
- [ ] Hand-craft 5-10 seed examples per dimension (9 dimensions)
- [ ] Create `GENERATE-*.md` prompt templates
- [ ] Use LLM to expand seed examples to 50-100+ per dimension
- [ ] Review and commit variation files
- [ ] Implement `VariationLoader` class
- [ ] Implement `variation.types.ts`
- [ ] Modify `PromptBuilder` to inject variations
- [ ] Modify `TaskService` to initialize VariationLoader
- [ ] Add `gender` to `TaskRequest` type
- [ ] Update all subject `base.md` templates
- [ ] Test variation loading and prompt injection

**Frontend:**
- [ ] Create `UserProfile` interface and localStorage helpers
- [ ] Implement `useUserProfile` hook with age calculation
- [ ] Create `ProfilePrompt` component (modal)
- [ ] Add profile prompt to task flow (before first task)
- [ ] Modify `useTask` to send age/gender to backend
- [ ] Add translations for profile prompt (EN/DE)
- [ ] Test profile storage and task request flow

**Validation:**
- [ ] Verify variations load on server startup
- [ ] Check final prompts include variation variables
- [ ] Generate 20 tasks, verify variety
- [ ] Test age filtering (8 vs 16 year old)
- [ ] Test with/without profile data

---

**End of Design Document**