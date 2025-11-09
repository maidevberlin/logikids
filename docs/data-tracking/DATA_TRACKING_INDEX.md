# Logikids Data Tracking Documentation Index

This directory contains comprehensive documentation about how user progress and performance data is tracked in Logikids.

## Documents

### 1. [USER_DATA_TRACKING_ANALYSIS.md](USER_DATA_TRACKING_ANALYSIS.md) - **START HERE**
The most comprehensive analysis of the data tracking system (19 KB, 11 sections)

**What you'll learn**:
- Complete data structure definitions
- How task statistics are stored and calculated
- Gamification metrics (streaks, achievements, levels)
- What data IS tracked vs. what's NOT
- Why certain gaps exist (privacy-first architecture)
- Recommendations for practice mode features
- Full API and endpoint documentation
- Data flow diagrams

**Best for**: Understanding the entire system, decision-making for new features

---

### 2. [DATA_TRACKING_QUICK_REFERENCE.md](DATA_TRACKING_QUICK_REFERENCE.md) - **FOR QUICK LOOKUP**
A condensed, visual reference guide (5.7 KB)

**What you'll find**:
- Data structure overview (visual)
- What happens when a user completes a task
- Key metrics and thresholds
- Critical limitations highlighted
- Subject mastery calculation rules
- File locations
- One-page data persistence diagram

**Best for**: Quick answers, during development, visual learners

---

### 3. [CODE_EXAMPLES_DATA_ACCESS.md](CODE_EXAMPLES_DATA_ACCESS.md) - **FOR IMPLEMENTATION**
Practical code examples and patterns (12 KB, 6 examples)

**What's included**:
- Example 1: Get subject success rate
- Example 2: Get all subjects performance summary
- Example 3: Identify weak subjects for practice mode
- Example 4: Record task completion
- Example 5: Display streaks and achievements
- Example 6: Complete practice mode hook implementation
- Best practices and performance notes

**Best for**: Copy-paste ready code, patterns to follow, practice mode implementation

---

## Key Findings Summary

### What's Currently Tracked ✓

```
UserData
├── Task Statistics (per subject, per difficulty)
│   ├── Correct answers
│   ├── Incorrect answers
│   └── Hints used (total only)
├── Gamification Metrics
│   ├── Daily streaks
│   ├── Perfect runs (consecutive correct)
│   ├── Weekly no-hint challenges
│   ├── Personal best success rate
│   ├── Subject mastery (0-5 stars)
│   └── 8 achievements across 4 tiers
└── Metadata
    ├── User settings (name, age, grade, language, gender)
    ├── Last task accessed
    └── Timestamps
```

### Critical Gap: No Concept-Level Tracking ✗

Currently, statistics are aggregated **at subject level only**:
- Can identify that "Math" is weak (3 stars)
- **Cannot identify which specific math concepts are weak**
  - Is it fractions? Algebra? Geometry?
- No per-task history or timestamps
- No time-spent metrics

**Impact for Practice Mode**: 
- Can implement "practice weak subjects"
- Cannot implement "practice weak concepts" without architectural changes

---

## Quick Navigation

### By Use Case

**I want to...**

| Goal | Read | Time |
|------|------|------|
| Understand the entire system | [USER_DATA_TRACKING_ANALYSIS.md](USER_DATA_TRACKING_ANALYSIS.md) | 15 min |
| Implement practice mode quickly | [CODE_EXAMPLES_DATA_ACCESS.md](CODE_EXAMPLES_DATA_ACCESS.md#5-real-world-use-case-practice-mode-feature) | 5 min |
| Check data thresholds | [DATA_TRACKING_QUICK_REFERENCE.md](DATA_TRACKING_QUICK_REFERENCE.md#subject-mastery-thresholds) | 1 min |
| See data structure | [DATA_TRACKING_QUICK_REFERENCE.md](DATA_TRACKING_QUICK_REFERENCE.md#data-structure-overview) | 2 min |
| Find where stats are updated | [USER_DATA_TRACKING_ANALYSIS.md](USER_DATA_TRACKING_ANALYSIS.md#where-stats-are-updated) | 3 min |
| Access stats in my component | [CODE_EXAMPLES_DATA_ACCESS.md](CODE_EXAMPLES_DATA_ACCESS.md#1-accessing-user-progress-data) | 5 min |
| Understand GameStats | [DATA_TRACKING_QUICK_REFERENCE.md](DATA_TRACKING_QUICK_REFERENCE.md#key-metrics--how-theyre-calculated) | 2 min |
| Add concept-level tracking | [USER_DATA_TRACKING_ANALYSIS.md](USER_DATA_TRACKING_ANALYSIS.md#9-recommendations-for-practice-mode-feature) | 10 min |

### By Topic

**Data Storage & Access**
- Structure: [Quick Reference](DATA_TRACKING_QUICK_REFERENCE.md#data-structure-overview)
- Details: [Full Analysis §1](USER_DATA_TRACKING_ANALYSIS.md#1-data-storage-architecture)
- Code: [Examples §1 & §4](CODE_EXAMPLES_DATA_ACCESS.md#1-accessing-user-progress-data)

**Task Statistics**
- What's tracked: [Full Analysis §2](USER_DATA_TRACKING_ANALYSIS.md#2-progress-tracking-task-statistics)
- How recorded: [Code Examples §2](CODE_EXAMPLES_DATA_ACCESS.md#2-recording-task-completion)
- Visual: [Quick Reference](DATA_TRACKING_QUICK_REFERENCE.md#what-gets-recorded-when-user-completes-a-task)

**Gamification (Streaks, Achievements, Levels)**
- Full details: [Full Analysis §3](USER_DATA_TRACKING_ANALYSIS.md#3-gamification-metrics)
- Quick overview: [Quick Reference](DATA_TRACKING_QUICK_REFERENCE.md#key-metrics--how-theyre-calculated)
- Display code: [Code Examples §3](CODE_EXAMPLES_DATA_ACCESS.md#3-accessing-gamestats)

**Practice Mode Feature**
- Requirements: [Full Analysis §8](USER_DATA_TRACKING_ANALYSIS.md#8-is-this-data-sufficient-for-a-practice-mode-feature)
- Recommendations: [Full Analysis §9](USER_DATA_TRACKING_ANALYSIS.md#9-recommendations-for-practice-mode-feature)
- Implementation: [Code Examples §5](CODE_EXAMPLES_DATA_ACCESS.md#5-real-world-use-case-practice-mode-feature)

**Data Gaps & Limitations**
- What's missing: [Full Analysis §5](USER_DATA_TRACKING_ANALYSIS.md#5-what-data-is-not-currently-tracked)
- Why: [Full Analysis §5](USER_DATA_TRACKING_ANALYSIS.md#why-these-gaps-exist)
- Critical gap highlighted: [Quick Reference](DATA_TRACKING_QUICK_REFERENCE.md#critical-limitation-for-practice-mode)

---

## File Locations in Codebase

### Key Implementation Files

```
packages/frontend/src/
├── data/core/
│   ├── types.ts                 ← UserData structure
│   ├── userData.ts              ← Read/write operations
│   └── crypto.ts                ← Encryption/decryption
├── app/stats/
│   ├── types.ts                 ← Progress structure
│   ├── gameTypes.ts             ← GameStats structure
│   ├── useProgress.ts           ← Central hook (USE THIS!)
│   ├── gameStatsService.ts      ← Calculations
│   ├── progressService.ts       ← Helpers
│   ├── achievements.ts          ← Achievement logic
│   └── StatsPage.tsx            ← Display component
└── app/tasks/
    └── TaskPage.tsx             ← Where updateStats() is called

packages/backend/src/
└── sync/                        ← Encrypted blob storage (no analytics)
```

### See Also

- [DATA_TRACKING_QUICK_REFERENCE.md](DATA_TRACKING_QUICK_REFERENCE.md#file-locations) - Quick file reference table
- [USER_DATA_TRACKING_ANALYSIS.md](USER_DATA_TRACKING_ANALYSIS.md#11-file-references) - Comprehensive file reference

---

## Common Questions

### Q: Where do I access user stats in a component?

**A**: Use the `useProgress()` hook:
```typescript
import { useProgress } from '@/app/stats'

const { progress, gameStats } = useProgress()
// progress['math']['medium'] = { correct, wrong, hintsUsed }
// gameStats.subjectMastery['math'] = { stars: 0-5, lastCalculated }
```

[See Code Examples §1](CODE_EXAMPLES_DATA_ACCESS.md#1-accessing-user-progress-data)

### Q: How do I identify weak subjects for practice mode?

**A**: Filter by mastery stars:
```typescript
const weakSubjects = Object.entries(gameStats.subjectMastery)
  .filter(([_, m]) => m.stars <= 3)
  .map(([subject, _]) => subject)
```

[See Code Examples §3](CODE_EXAMPLES_DATA_ACCESS.md#example-3-identify-weak-subjects-for-practice-mode)

### Q: Can I track per-concept performance now?

**A**: No. Currently only subject-level. See [Full Analysis §5](USER_DATA_TRACKING_ANALYSIS.md#5-what-data-is-not-currently-tracked) for how to add it.

### Q: Where is task completion stats updated?

**A**: `packages/frontend/src/app/tasks/TaskPage.tsx` calls `updateStats()` when user completes a task.

[See Quick Reference](DATA_TRACKING_QUICK_REFERENCE.md#data-persistence)

### Q: Is data stored on the server?

**A**: Only encrypted blobs. Server has zero-knowledge of plaintext data. All stats calculation happens client-side.

[See Full Analysis §1](USER_DATA_TRACKING_ANALYSIS.md#1-data-storage-architecture)

### Q: How are subject mastery stars calculated?

**A**: Based on total tasks and success rate thresholds.

[See Quick Reference](DATA_TRACKING_QUICK_REFERENCE.md#subject-mastery-thresholds)

---

## For Different Audiences

### For Product Managers
Read: [Full Analysis §4-5 & §8](USER_DATA_TRACKING_ANALYSIS.md) - What we track, what we don't, practice mode feasibility

### For Frontend Developers
Read: [Code Examples](CODE_EXAMPLES_DATA_ACCESS.md) first, then [Full Analysis](USER_DATA_TRACKING_ANALYSIS.md) for context

### For Data Analysts
Read: [Full Analysis §6-7](USER_DATA_TRACKING_ANALYSIS.md) - APIs and data structure details

### For Designers Building Stats UI
Read: [Quick Reference](DATA_TRACKING_QUICK_REFERENCE.md) - Visual overview and thresholds

---

## Document Statistics

| Document | Size | Lines | Sections | Tables | Code Examples |
|----------|------|-------|----------|--------|----------------|
| [USER_DATA_TRACKING_ANALYSIS.md](USER_DATA_TRACKING_ANALYSIS.md) | 19 KB | 599 | 11 | 7 | 20+ |
| [DATA_TRACKING_QUICK_REFERENCE.md](DATA_TRACKING_QUICK_REFERENCE.md) | 5.7 KB | 172 | 8 | 4 | 3 |
| [CODE_EXAMPLES_DATA_ACCESS.md](CODE_EXAMPLES_DATA_ACCESS.md) | 12 KB | 471 | 6 | 2 | 11 |
| **TOTAL** | **36.7 KB** | **1,242** | **25** | **13** | **34+** |

---

## Version History

- **2025-11-07**: Initial comprehensive documentation created
  - Complete analysis of current data tracking
  - Quick reference guide
  - 11 code examples with real-world use cases
  - Documentation for practice mode feature planning

