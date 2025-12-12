export { StatsPage } from './StatsPage'
export { LevelBadge } from './LevelBadge'
export { SubjectSkillBars } from './SubjectSkillBars'
export { CompetitiveMetrics } from './CompetitiveMetrics'
export { AchievementsGrid } from './AchievementsGrid'
export { MetricCard } from './MetricCard'
export { AchievementBadge } from './AchievementBadge'
export { AchievementDetailDialog } from './AchievementDetailDialog'

// Game types
export type { GameStats } from './gameTypes'

// Achievements
export {
  ACHIEVEMENTS,
  getTotalCorrectTasks,
  getCurrentLevel,
  getLevelThreshold,
  checkAchievements,
  unlockAchievements,
} from './achievements'
export type { Achievement } from './achievements'

// Levels
export { TASK_LEVELS } from './levels'
export type { TaskLevel } from './levels'
