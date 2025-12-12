import { UserData, TaskCostRecord } from '@/app/user/types'
import { ProgressData, ConceptStats, calculateConceptAggregate } from '@/app/progress'
import { GameStats } from '@/app/gamification/gameTypes'

/**
 * Merge two UserData objects, combining progress from both sources.
 * Uses id-based deduplication for attempts and last-write-wins for settings.
 */
export function mergeUserData(local: UserData, remote: UserData): UserData {
  // Determine which has newer settings (for last-write-wins fields)
  const localIsNewer = local.timestamp >= remote.timestamp

  return {
    userId: local.userId, // Keep local userId (should be same)
    settings: localIsNewer ? local.settings : remote.settings,
    progress: mergeProgress(local.progress, remote.progress),
    gameStats: mergeGameStats(local.gameStats, remote.gameStats),
    lastTask: localIsNewer ? local.lastTask : remote.lastTask,
    costs: mergeCosts(local.costs, remote.costs),
    timestamp: Math.max(local.timestamp, remote.timestamp),
    lastSyncTimestamp: Date.now(),
  }
}

/**
 * Merge progress data by combining attempts arrays and deduplicating by id.
 */
function mergeProgress(local: ProgressData, remote: ProgressData): ProgressData {
  const merged: ProgressData = {}

  // Get all subjects from both
  const allSubjects = new Set([...Object.keys(local), ...Object.keys(remote)])

  for (const subject of allSubjects) {
    const localSubject = local[subject] || {}
    const remoteSubject = remote[subject] || {}

    // Get all concepts from both
    const allConcepts = new Set([...Object.keys(localSubject), ...Object.keys(remoteSubject)])

    merged[subject] = {}

    for (const concept of allConcepts) {
      const localConcept = localSubject[concept]
      const remoteConcept = remoteSubject[concept]

      if (!localConcept && remoteConcept) {
        merged[subject][concept] = remoteConcept
      } else if (localConcept && !remoteConcept) {
        merged[subject][concept] = localConcept
      } else if (localConcept && remoteConcept) {
        merged[subject][concept] = mergeConceptStats(localConcept, remoteConcept)
      }
    }
  }

  return merged
}

/**
 * Merge concept stats by combining attempts and deduplicating by id.
 */
function mergeConceptStats(local: ConceptStats, remote: ConceptStats): ConceptStats {
  // Collect all attempts, deduplicate by id
  const seenIds = new Set<string>()
  const mergedAttempts = []

  // Add local attempts first
  for (const attempt of local.attempts) {
    if (!seenIds.has(attempt.id)) {
      seenIds.add(attempt.id)
      mergedAttempts.push(attempt)
    }
  }

  // Add remote attempts that aren't duplicates
  for (const attempt of remote.attempts) {
    if (!seenIds.has(attempt.id)) {
      seenIds.add(attempt.id)
      mergedAttempts.push(attempt)
    }
  }

  // Sort by timestamp for consistent ordering
  mergedAttempts.sort((a, b) => a.timestamp - b.timestamp)

  // Use the more recent difficulty setting
  const localLastAttempt = local.aggregate.lastAttemptTimestamp
  const remoteLastAttempt = remote.aggregate.lastAttemptTimestamp
  const difficulty = localLastAttempt >= remoteLastAttempt ? local.difficulty : remote.difficulty

  return {
    attempts: mergedAttempts,
    aggregate: calculateConceptAggregate(mergedAttempts),
    difficulty,
  }
}

/**
 * Merge game stats, taking max values where appropriate.
 */
function mergeGameStats(
  local: GameStats | undefined,
  remote: GameStats | undefined
): GameStats | undefined {
  if (!local && !remote) return undefined
  if (!local) return remote
  if (!remote) return local

  return {
    version: 1,
    streaks: {
      currentDays: Math.max(local.streaks.currentDays, remote.streaks.currentDays),
      bestDays: Math.max(local.streaks.bestDays, remote.streaks.bestDays),
      // Take the more recent lastActiveDate
      lastActiveDate:
        local.streaks.lastActiveDate >= remote.streaks.lastActiveDate
          ? local.streaks.lastActiveDate
          : remote.streaks.lastActiveDate,
    },
    perfectRun: {
      // Current depends on context - take max assuming same session context
      current: Math.max(local.perfectRun.current, remote.perfectRun.current),
      allTimeBest: Math.max(local.perfectRun.allTimeBest, remote.perfectRun.allTimeBest),
    },
    weekly: mergeWeeklyStats(local.weekly, remote.weekly),
    personalBests: {
      successRate: Math.max(local.personalBests.successRate, remote.personalBests.successRate),
    },
    achievements: mergeAchievements(local.achievements, remote.achievements),
    subjectMastery: mergeSubjectMastery(local.subjectMastery, remote.subjectMastery),
  }
}

/**
 * Merge weekly stats - use same week data or take more recent.
 */
function mergeWeeklyStats(
  local: GameStats['weekly'],
  remote: GameStats['weekly']
): GameStats['weekly'] {
  if (local.weekStart === remote.weekStart) {
    // Same week - combine
    return {
      noHintTasks: Math.max(local.noHintTasks, remote.noHintTasks),
      weekStart: local.weekStart,
    }
  }
  // Different weeks - take more recent
  return local.weekStart >= remote.weekStart ? local : remote
}

/**
 * Merge achievements - once unlocked, stays unlocked.
 */
function mergeAchievements(
  local: GameStats['achievements'],
  remote: GameStats['achievements']
): GameStats['achievements'] {
  const merged: GameStats['achievements'] = { ...local }

  for (const [id, remoteAchievement] of Object.entries(remote)) {
    if (!merged[id]) {
      merged[id] = remoteAchievement
    } else if (remoteAchievement.unlocked && !merged[id].unlocked) {
      // Remote has it unlocked, local doesn't - use remote
      merged[id] = remoteAchievement
    } else if (merged[id].unlocked && remoteAchievement.unlocked) {
      // Both unlocked - use earliest date
      const localDate = merged[id].date || ''
      const remoteDate = remoteAchievement.date || ''
      if (remoteDate && (!localDate || remoteDate < localDate)) {
        merged[id] = remoteAchievement
      }
    }
  }

  return merged
}

/**
 * Merge subject mastery - will be recalculated anyway, take more recent.
 */
function mergeSubjectMastery(
  local: GameStats['subjectMastery'],
  remote: GameStats['subjectMastery']
): GameStats['subjectMastery'] {
  const merged: GameStats['subjectMastery'] = { ...local }

  for (const [subject, remoteMastery] of Object.entries(remote)) {
    if (!merged[subject]) {
      merged[subject] = remoteMastery
    } else {
      // Take the one with more data (higher totalTasks) or more recent calculation
      const localMastery = merged[subject]
      if (
        remoteMastery.totalTasks > localMastery.totalTasks ||
        (remoteMastery.totalTasks === localMastery.totalTasks &&
          remoteMastery.lastCalculated > localMastery.lastCalculated)
      ) {
        merged[subject] = remoteMastery
      }
    }
  }

  return merged
}

/**
 * Merge cost records, deduplicating by timestamp.
 */
function mergeCosts(
  local: TaskCostRecord[] | undefined,
  remote: TaskCostRecord[] | undefined
): TaskCostRecord[] {
  if (!local && !remote) return []
  if (!local) return remote || []
  if (!remote) return local

  // Deduplicate by timestamp (costs at exact same timestamp are duplicates)
  const seenTimestamps = new Set<number>()
  const merged: TaskCostRecord[] = []

  for (const cost of [...local, ...remote]) {
    if (!seenTimestamps.has(cost.timestamp)) {
      seenTimestamps.add(cost.timestamp)
      merged.push(cost)
    }
  }

  // Sort by timestamp
  merged.sort((a, b) => a.timestamp - b.timestamp)

  return merged
}
