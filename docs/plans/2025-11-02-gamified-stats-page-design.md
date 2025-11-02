# Gamified Stats Page Design

**Date:** 2025-11-02
**Status:** Design Complete
**Goal:** Transform the stats page from an adult-oriented analytics view into a game-like character profile that appeals to teenagers through competitive elements.

## Overview

Replace the current simple stats display with a hero-focused game character profile featuring:
- Level badge with progression ring (existing level system)
- Subject skill bars showing mastery (RPG-style)
- Competitive metrics (streaks, records, achievements)
- Achievement badges system

## Design Goals

1. **Primary Focus:** Competitive elements to motivate teenagers
2. **Visual Style:** Game character profile (like RPG stat screens)
3. **Data Policy:** Client-first, all data stored in UserData
4. **Leverage Existing:** Keep current level system (20 levels, 5-4000 tasks)

## Hero Section - Character Profile

### Layout
```
┌─────────────────────────────────────────────────────┐
│                  [User Name]                        │
│                                                     │
│     ┌─────────────┐         ┌──────────────────┐   │
│     │   LEVEL X   │         │ MATH      ████░  │   │
│     │   [ring]    │         │ LOGIC     ███░░  │   │
│     │  125/200    │         │ PHYSICS   ███░░  │   │
│     └─────────────┘         │ GERMAN    ██░░░  │   │
│                             │ MUSIC     █░░░░  │   │
│                             └──────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Level Badge (Left)
- Large circular badge displaying current level number
- Progress ring showing advancement to next level
- XP display: "X / Y tasks" to next level
- Color matches current tier from TASK_LEVELS:
  - Levels 1-4: Blue shades
  - Levels 5-8: Indigo shades
  - Levels 9-12: Purple shades
  - Levels 13-16: Violet shades
  - Levels 17-20: Fuchsia shades

### Subject Skill Bars (Right)
- Each subject gets a 5-dot/square skill bar
- Filled dots use subject accent colors (math=blue, logic=purple, etc.)
- Empty dots in gray
- Show top 5 subjects sorted by mastery, then tasks

### Mastery Calculation (per subject)
Combines total tasks, success rate, and difficulty performance:

- **1 Star:** < 10 tasks OR < 40% success
- **2 Stars:** 10-25 tasks with 40-60% success
- **3 Stars:** 25-50 tasks with 60-75% success
- **4 Stars:** 50-100 tasks with 75-90% success
- **5 Stars:** 100+ tasks with 90%+ success

Algorithm weights harder difficulties more heavily in success calculation.

## Competitive Metrics Grid

Four key metrics displayed as cards below the hero:

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   🔥 STREAK  │ │  🏆 RECORD   │ │  ⚡ PERFECT  │ │  🎯 ACCURACY │
│              │ │              │ │              │ │              │
│      7       │ │     12       │ │      3       │ │    94.5%     │
│     days     │ │  in a row    │ │  no hints    │ │   success    │
│              │ │              │ │              │ │              │
│  Best: 12    │ │  Today: 8/8  │ │  This week   │ │  Personal    │
│              │ │    ✓ All     │ │              │ │    Best!     │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### 1. Streak Card 🔥
- **Current:** Consecutive days with ≥1 correct task
- **Best:** Personal record for longest streak
- **Reset:** Resets if a day is missed (UTC-based)
- **Data:** `lastActiveDate` tracks last completion

### 2. Perfect Run Record 🏆
- **Current:** Longest active streak of consecutive correct tasks (no wrongs)
- **All-Time Best:** Highest ever achieved
- **Reset:** Any wrong answer breaks the streak
- **Display:** Shows current if active, otherwise shows record

### 3. No-Hint Master ⚡
- **Count:** Tasks solved without ANY hints this week
- **Period:** Resets weekly (Monday)
- **Goal:** Beat your own record each week

### 4. Accuracy 🎯
- **Value:** Overall success rate (existing metric)
- **Highlight:** Shows "Personal Best!" if new high
- **Trend:** Optional up/down indicator from last week

## Achievements System

```
┌─────────────────────────────────────────────────────┐
│               🏅 ACHIEVEMENTS                       │
│                                                     │
│  [🌟 First Steps]  [🔥 Week Warrior]  [🎯 Sharpshooter]  │
│   Complete 5        7-day streak      10 tasks      │
│   tasks ✓          ✓                 100% ✓         │
│                                                     │
│  [⚡ Speed Demon]  [🧠 Brain Master]  [🎓 Scholar]  │
│   5 in a row       50 tasks          Level 10       │
│   no hints ⏳      no hints ⏳       ⏳              │
└─────────────────────────────────────────────────────┘
```

### Achievement Definitions

**Tier 1 - Beginner:**
- **First Steps** 🌟: Complete 5 tasks
- **Quick Learner** 📚: Complete 3 tasks in one day
- **Dedicated** 💪: Maintain 3-day streak

**Tier 2 - Intermediate:**
- **Week Warrior** 🔥: Maintain 7-day streak
- **Sharpshooter** 🎯: Complete 10 tasks with 100% accuracy
- **Subject Explorer** 🗺️: Try all available subjects

**Tier 3 - Advanced:**
- **Speed Demon** ⚡: 5 consecutive correct tasks without hints
- **Brain Master** 🧠: Complete 50 total tasks without using any hints
- **Polymath** 🌍: Get 3+ stars in all subjects

**Tier 4 - Expert:**
- **Scholar** 🎓: Reach level 10
- **Master** 👑: Max out (5 stars) in any subject
- **Perfectionist** 💎: Complete 20 hard difficulty tasks with 90%+ success
- **Legend** 🏆: Reach level 20

**Special:**
- **Comeback Kid** 🎪: Answer correctly after getting 3 wrong in a row
- **Persistent** 🔄: Continue a broken streak (complete task after missing a day)

### Visual States
- **Unlocked:** Full color with checkmark, shows unlock date on hover
- **Locked:** Grayscale with progress indicator
- **In Progress:** Highlighted if close to unlocking (within 80% of goal)

## Data Structure Extensions

### Add to UserData
```typescript
interface UserData {
  // ... existing fields
  gameStats: GameStats
}

interface GameStats {
  version: 1  // for future migrations

  streaks: {
    currentDays: number
    bestDays: number
    lastActiveDate: string  // ISO date string (UTC)
  }

  perfectRun: {
    current: number          // current consecutive correct
    allTimeBest: number
  }

  weekly: {
    noHintTasks: number
    weekStart: string        // ISO date of Monday
  }

  personalBests: {
    successRate: number
  }

  achievements: {
    [achievementId: string]: {
      unlocked: boolean
      date?: string          // ISO timestamp when unlocked
    }
  }

  subjectMastery: {
    [subject: string]: {
      stars: number          // 0-5
      lastCalculated: string // ISO timestamp
    }
  }
}
```

## Technical Implementation

### Component Structure
```
packages/frontend/src/app/stats/
├── StatsPage.tsx              # Main container
├── HeroProfile.tsx            # Level + skills container
│   ├── LevelBadge.tsx         # Circular badge with ring
│   └── SubjectSkillBars.tsx   # 5-bar display per subject
├── CompetitiveMetrics.tsx     # 4-card grid
│   ├── StreakCard.tsx
│   ├── PerfectRunCard.tsx
│   ├── NoHintCard.tsx
│   └── AccuracyCard.tsx
└── AchievementsGrid.tsx       # Badge display
    └── AchievementBadge.tsx   # Individual badge
```

### New Service Layer
```
packages/frontend/src/app/stats/
├── gameStatsService.ts        # Game stats calculations
│   ├── calculateSubjectMastery()
│   ├── updateStreaks()
│   ├── updatePerfectRun()
│   ├── checkAchievements()
│   └── checkPersonalBests()
└── achievements.ts            # Achievement definitions & logic
```

### Task Completion Flow

**Existing flow (unchanged):**
1. Update progress stats (correct/wrong/hints per subject/difficulty)
2. Store in UserData via `updateProgress()`

**New additions:**
1. Calculate if task was perfect (correct + no hints)
2. Update streak tracking (check date, increment or reset)
3. Update perfect run counter (increment or reset)
4. Update weekly no-hint counter
5. Check and unlock achievements
6. Recalculate subject mastery scores
7. Check for new personal bests
8. Trigger celebration animations if achievement unlocked

### Migration Strategy

Initialize on first access:
```typescript
if (!userData.gameStats) {
  userData.gameStats = createDefaultGameStats()
}
```

No need to backfill historical data - start fresh when feature launches.

## Visual Design

### Color System
- **Hero badge:** TASK_LEVELS colors (blue → indigo → purple → violet → fuchsia)
- **Skill bars:** Subject accent colors from tailwind config
- **Metric cards:** White background with colored accents
- **Achievements:** Full color when unlocked, grayscale when locked

### Animations
- **Level badge ring:** Smooth progress animation on load
- **Skill bars:** Staggered fill animation (sequential)
- **Metric cards:** Number count-up animation
- **Achievement unlock:** Celebratory bounce + color reveal
- **Streak fire emoji:** Subtle pulse when active

### Responsive Breakpoints

**Desktop (>768px):**
- Hero: Badge left, skill bars right (side-by-side)
- Metrics: 4 cards in a row
- Achievements: 3-4 per row

**Mobile (<768px):**
- Hero: Badge top, skills below (stacked)
- Metrics: 2 cards per row
- Achievements: 2 per row

### Micro-interactions
- Hover on achievements: Scale up + tooltip
- Hover on metrics: Slight lift shadow
- Tap skill bar: Show detailed subject stats
- Level badge: Gentle rotate on hover

### Empty States
- **No streak:** "Start your streak today! 🔥"
- **No achievements:** Highlight first achievable badge
- **Low skill bars:** "Keep practicing to level up!"

## shadcn/ui Components

Use existing components from `@/components/ui/`:
- `Card` - Metric cards and hero container
- `Badge` - Level indicator and achievement states
- `Progress` - Circular ring and skill bars (may need custom circular variant)
- Custom components for achievement badges

## Translation Keys

Add to `packages/frontend/public/locales/*/stats.json`:

```json
{
  "hero": {
    "level": "Level {{level}}",
    "tasksToNext": "{{current}} / {{next}} tasks",
    "skills": "Skills"
  },
  "metrics": {
    "streak": "Streak",
    "days": "days",
    "bestStreak": "Best: {{days}}",
    "perfectRun": "Perfect Run",
    "inARow": "in a row",
    "allTimeBest": "Record: {{count}}",
    "noHints": "No-Hint Master",
    "thisWeek": "this week",
    "accuracy": "Accuracy",
    "personalBest": "Personal Best!",
    "success": "success"
  },
  "achievements": {
    "title": "Achievements",
    "unlocked": "Unlocked",
    "locked": "Locked",
    "progress": "{{current}} / {{total}}"
  },
  "empty": {
    "noStreak": "Start your streak today! 🔥",
    "noAchievements": "Complete tasks to unlock achievements!",
    "keepPracticing": "Keep practicing to level up!"
  }
}
```

## Implementation Notes

1. **No demo data needed** - will test with real usage
2. **No migration concerns** - fresh feature for all users
3. **Aggressive iteration** - can freely adjust thresholds and calculations
4. **Performance:** All calculations client-side, no backend changes
5. **Data sync:** GameStats included in existing UserData sync flow

## Success Criteria

- Stats page feels like a game character profile
- Teenagers find it more engaging than pure analytics
- Clear goals for improvement (level up, unlock achievements, max skills)
- Competitive elements create motivation without external comparison
- Smooth animations enhance the game-like feel
- Works well on both desktop and mobile
