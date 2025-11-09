# Logikids Data Tracking - Code Examples

## 1. Accessing User Progress Data

### Example 1: Get Subject Success Rate

```typescript
import { useProgress } from '@/app/stats'

function SubjectAnalysis() {
  const { progress } = useProgress()
  
  // Get stats for math medium difficulty
  const mathMediumStats = progress['math']?.['medium']
  
  if (!mathMediumStats) {
    return <div>No math medium tasks yet</div>
  }
  
  const successRate = (mathMediumStats.correct / 
    (mathMediumStats.correct + mathMediumStats.wrong)) * 100
  
  return (
    <div>
      <p>Math Medium Difficulty</p>
      <p>Correct: {mathMediumStats.correct}</p>
      <p>Incorrect: {mathMediumStats.wrong}</p>
      <p>Success Rate: {successRate.toFixed(1)}%</p>
      <p>Hints Used: {mathMediumStats.hintsUsed}</p>
    </div>
  )
}
```

### Example 2: Get All Subjects Performance Summary

```typescript
import { useProgress } from '@/app/stats'

function ProgressSummary() {
  const { progress, gameStats } = useProgress()
  
  // Calculate metrics for each subject
  const subjectMetrics = Object.entries(progress).map(([subject, difficulties]) => {
    let totalCorrect = 0
    let totalTasks = 0
    let totalHints = 0
    
    Object.values(difficulties).forEach((stats: any) => {
      totalCorrect += stats.correct
      totalTasks += stats.correct + stats.wrong
      totalHints += stats.hintsUsed
    })
    
    const successRate = totalTasks > 0 ? (totalCorrect / totalTasks) * 100 : 0
    const masteryStars = gameStats.subjectMastery[subject]?.stars ?? 0
    
    return {
      subject,
      totalTasks,
      successRate,
      masteryStars,
      avgHints: totalTasks > 0 ? totalHints / totalTasks : 0
    }
  })
  
  // Sort by weakest first
  const weakestSubjects = subjectMetrics.sort((a, b) => a.masteryStars - b.masteryStars)
  
  return (
    <div>
      {weakestSubjects.map(metric => (
        <div key={metric.subject}>
          <h3>{metric.subject}</h3>
          <p>Mastery: {metric.masteryStars}/5 stars</p>
          <p>Success Rate: {metric.successRate.toFixed(1)}%</p>
          <p>Total Tasks: {metric.totalTasks}</p>
          <p>Avg Hints: {metric.avgHints.toFixed(2)}</p>
        </div>
      ))}
    </div>
  )
}
```

### Example 3: Identify Weak Subjects for Practice Mode

```typescript
import { useProgress } from '@/app/stats'

function PracticeMode() {
  const { gameStats } = useProgress()
  
  // Get subjects with 3 or fewer stars (weak areas)
  const weakSubjects = Object.entries(gameStats.subjectMastery)
    .filter(([_, mastery]) => mastery.stars <= 3)
    .sort((a, b) => a[1].stars - b[1].stars)
    .map(([subject, _]) => subject)
  
  if (weakSubjects.length === 0) {
    return <div>Great job! All subjects are strong!</div>
  }
  
  return (
    <div>
      <h2>Practice Your Weak Areas</h2>
      {weakSubjects.map(subject => (
        <button key={subject} onClick={() => practiceSubject(subject)}>
          Practice {subject}
        </button>
      ))}
    </div>
  )
}
```

## 2. Recording Task Completion

### Example: How updateStats is Called

```typescript
// From packages/frontend/src/app/tasks/TaskPage.tsx

import { useProgress } from '@/app/stats'

function TaskPage() {
  const { updateStats } = useProgress()
  
  const handleTaskCompletion = async (isCorrect: boolean, hintsUsed: number) => {
    const taskParams = {
      subject: 'math',      // or use dynamic value
      difficulty: 'medium', // or use dynamic value
      concept: 'fractions'  // Available in URL params
    }
    
    // Record the task completion
    await updateStats({
      subject: taskParams.subject,
      difficulty: taskParams.difficulty,
      correct: isCorrect,     // true or false
      hintsUsed: hintsUsed    // 0, 1, 2, 3, 4
    })
    
    // After this call:
    // 1. progress['math']['medium'] is updated with correct/wrong/hintsUsed
    // 2. gameStats.streaks is updated (if correct)
    // 3. gameStats.perfectRun is updated
    // 4. gameStats.weekly.noHintTasks incremented if hintsUsed === 0
    // 5. gameStats.subjectMastery['math'] recalculated
    // 6. Achievements checked
    // 7. All data persisted to encrypted localStorage
  }
  
  return (
    <div>
      {/* Task content */}
    </div>
  )
}
```

## 3. Accessing GameStats

### Example 1: Display Streaks and Achievements

```typescript
import { useProgress } from '@/app/stats'

function StatsDisplay() {
  const { gameStats } = useProgress()
  
  return (
    <div>
      {/* Streaks */}
      <div>
        <h3>Current Streak</h3>
        <p>Days: {gameStats.streaks.currentDays}</p>
        <p>Best: {gameStats.streaks.bestDays}</p>
        <p>Last Active: {gameStats.streaks.lastActiveDate}</p>
      </div>
      
      {/* Perfect Run */}
      <div>
        <h3>Perfect Run</h3>
        <p>Current: {gameStats.perfectRun.current}</p>
        <p>All-Time Best: {gameStats.perfectRun.allTimeBest}</p>
      </div>
      
      {/* Weekly Challenge */}
      <div>
        <h3>This Week (No Hints)</h3>
        <p>Tasks: {gameStats.weekly.noHintTasks}</p>
        <p>Week Started: {gameStats.weekly.weekStart}</p>
      </div>
      
      {/* Unlocked Achievements */}
      <div>
        <h3>Achievements</h3>
        {Object.entries(gameStats.achievements).map(([id, achievement]) => (
          achievement.unlocked && (
            <div key={id}>
              <p>{id}</p>
              <p>Unlocked: {achievement.date}</p>
            </div>
          )
        ))}
      </div>
    </div>
  )
}
```

### Example 2: Display Subject Mastery Stars

```typescript
import { useProgress } from '@/app/stats'

function SubjectSkillBars() {
  const { gameStats } = useProgress()
  
  return (
    <div>
      {Object.entries(gameStats.subjectMastery).map(([subject, mastery]) => (
        <div key={subject}>
          <h4>{subject}</h4>
          <div className="stars">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < mastery.stars ? 'filled' : 'empty'}>
                ★
              </span>
            ))}
          </div>
          <small>Last calculated: {mastery.lastCalculated}</small>
        </div>
      ))}
    </div>
  )
}
```

## 4. Low-Level Data Access

### Example: Direct UserData Access

```typescript
import { getData, updateProgress, updateGameStats } from '@/data'

async function performBatchUpdate() {
  // Get raw user data
  const userData = await getData()
  
  if (!userData) {
    console.log('No user data yet')
    return
  }
  
  // Read current stats
  const currentProgress = userData.progress
  const currentGameStats = userData.gameStats
  
  // Modify them (e.g., manual correction)
  const newProgress = {
    ...currentProgress,
    'physics.hard': {
      correct: 15,
      wrong: 3,
      hintsUsed: 8
    }
  }
  
  // Persist changes
  await updateProgress(newProgress)
  
  // Or update gameStats directly
  const updatedGameStats = {
    ...currentGameStats,
    personalBests: {
      successRate: 95.5
    }
  }
  await updateGameStats(updatedGameStats)
}
```

## 5. Real-World Use Case: Practice Mode Feature

### Complete Implementation Example

```typescript
import { useProgress } from '@/app/stats'
import { useUserData } from '@/app/account'
import { useCallback, useMemo } from 'react'

interface WeakConceptAnalysis {
  subject: string
  masteryLevel: number  // 0-5 stars
  successRate: number   // percentage
  totalTasks: number
  weakestDifficulty: 'easy' | 'medium' | 'hard'
}

function usePracticeMode() {
  const { progress, gameStats } = useProgress()
  
  // Analyze weak areas
  const weakAreas: WeakConceptAnalysis[] = useMemo(() => {
    const areas: WeakConceptAnalysis[] = []
    
    Object.entries(progress).forEach(([subject, difficulties]) => {
      let totalCorrect = 0
      let totalTasks = 0
      let lowestSuccessRate = 100
      let weakestDifficulty: 'easy' | 'medium' | 'hard' = 'easy'
      
      Object.entries(difficulties).forEach(([difficulty, stats]: any) => {
        totalCorrect += stats.correct
        const taskCount = stats.correct + stats.wrong
        totalTasks += taskCount
        
        if (taskCount > 0) {
          const rate = (stats.correct / taskCount) * 100
          if (rate < lowestSuccessRate) {
            lowestSuccessRate = rate
            weakestDifficulty = difficulty as any
          }
        }
      })
      
      const successRate = totalTasks > 0 ? (totalCorrect / totalTasks) * 100 : 0
      const masteryLevel = gameStats.subjectMastery[subject]?.stars ?? 0
      
      // Only include subjects with room for improvement
      if (masteryLevel < 5 && totalTasks > 0) {
        areas.push({
          subject,
          masteryLevel,
          successRate,
          totalTasks,
          weakestDifficulty
        })
      }
    })
    
    // Sort by lowest mastery first
    return areas.sort((a, b) => a.masteryLevel - b.masteryLevel)
  }, [progress, gameStats])
  
  // Get recommendation for practice
  const getPracticeRecommendation = useCallback((): WeakConceptAnalysis | null => {
    return weakAreas[0] ?? null
  }, [weakAreas])
  
  return {
    weakAreas,
    getPracticeRecommendation,
    hasWeakAreas: weakAreas.length > 0
  }
}

// Usage in a component
export function PracticeModeSelector() {
  const { weakAreas, getPracticeRecommendation } = usePracticeMode()
  const recommendation = getPracticeRecommendation()
  
  return (
    <div>
      <h2>Practice Mode</h2>
      
      {recommendation && (
        <div className="recommendation">
          <p>We recommend practicing:</p>
          <button onClick={() => startPractice(recommendation.subject)}>
            {recommendation.subject} ({recommendation.masteryLevel}/5 stars)
            <small>Success Rate: {recommendation.successRate.toFixed(1)}%</small>
          </button>
        </div>
      )}
      
      <h3>All Areas for Practice</h3>
      {weakAreas.map(area => (
        <div key={area.subject} className="practice-card">
          <h4>{area.subject}</h4>
          <p>Mastery: {area.masteryLevel}/5</p>
          <p>Success Rate: {area.successRate.toFixed(1)}%</p>
          <p>Weakest in: {area.weakestDifficulty}</p>
          <button onClick={() => startPractice(area.subject)}>
            Practice Now
          </button>
        </div>
      ))}
      
      {weakAreas.length === 0 && (
        <p>Excellent! All subjects are strong. Keep learning!</p>
      )}
    </div>
  )
}

function startPractice(subject: string) {
  // Navigate to practice mode or filter task generation
  window.location.href = `/subjects/${subject}/tasks?mode=practice`
}
```

## 6. Important Notes

### Data Persistence Flow

```typescript
// When you call updateStats():
updateStats({
  subject: 'math',
  difficulty: 'medium',
  correct: true,
  hintsUsed: 1
})

// Internally:
// 1. progress['math']['medium'] is updated in local state
// 2. gameStats is updated in local state
// 3. await updateProgress(newProgress)  // Persists progress
// 4. await updateGameStats(newGameStats) // Persists gameStats
// 5. Both are encrypted and stored in localStorage
// 6. If syncEnabled, sent to backend via PUT /api/sync/:userId
```

### Accessing Data Safely

```typescript
// Always check if data exists before accessing
const { progress } = useProgress()

// BAD (can crash):
const stats = progress['math']['medium'].correct

// GOOD (safe):
const stats = progress['math']?.['medium']?.correct ?? 0

// BETTER (with fallback):
const mathMedium = progress['math']?.['medium']
if (!mathMedium) {
  return <div>No data yet</div>
}
const stats = mathMedium.correct
```

### Performance Considerations

```typescript
// useProgress hook is memoized, but components still re-render
// Use useMemo to prevent unnecessary recalculations

function MyStats() {
  const { progress } = useProgress()
  
  // Calculate once, reuse many times
  const weakSubjects = useMemo(() => {
    return Object.keys(progress)
      .filter(subject => /* your logic */)
      .sort((a, b) => /* your sort */)
  }, [progress])
  
  // Now weakSubjects only recalculates when progress changes
  return (
    <>
      {weakSubjects.map(subject => <SubjectCard key={subject} />)}
    </>
  )
}
```

