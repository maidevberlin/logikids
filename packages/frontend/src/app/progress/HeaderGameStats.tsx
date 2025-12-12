import { useNavigate } from 'react-router-dom'
import { useProgress } from './useProgress'
import { ACHIEVEMENTS, TASK_LEVELS } from '@/app/gamification'

function getLevelFromTasks(totalTasks: number): { level: number; progressPercent: number } {
  const currentLevelIndex = TASK_LEVELS.findIndex((lvl) => totalTasks < lvl.threshold)
  const level = currentLevelIndex === -1 ? TASK_LEVELS.length : currentLevelIndex

  const previousThreshold = level > 0 ? TASK_LEVELS[level - 1].threshold : 0
  const nextThreshold =
    level >= TASK_LEVELS.length
      ? TASK_LEVELS[TASK_LEVELS.length - 1].threshold
      : TASK_LEVELS[level].threshold
  const progressPercent =
    ((totalTasks - previousThreshold) / (nextThreshold - previousThreshold)) * 100

  return { level: level + 1, progressPercent: Math.min(progressPercent, 100) }
}

function getLevelColorClass(level: number): string {
  // level is 1-indexed, TASK_LEVELS is 0-indexed
  const index = Math.min(level - 1, TASK_LEVELS.length - 1)
  return TASK_LEVELS[index].colorClass
}

export function HeaderGameStats() {
  const navigate = useNavigate()
  const { gameStats, getOverallStats } = useProgress()

  const overallStats = getOverallStats()
  const { level, progressPercent } = getLevelFromTasks(overallStats.totalCorrect)
  const colorClass = getLevelColorClass(level)

  // Get tier 3 and 4 achievements to display (max 3)
  const highlightAchievements = gameStats
    ? ACHIEVEMENTS.filter((a) => gameStats.achievements[a.id]?.unlocked && a.tier >= 3).slice(0, 3)
    : []

  return (
    <button
      onClick={() => navigate('/stats')}
      className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 rounded-xl hover:bg-muted transition-all duration-200 group"
    >
      {/* Circular progress around level badge */}
      <div className="relative w-8 h-8">
        {/* SVG circular progress */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
          {/* Background circle */}
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${progressPercent} ${100 - progressPercent}`}
            strokeLinecap="round"
            className={`transition-all duration-300 ${colorClass.replace('bg-', 'text-')}`}
          />
        </svg>
        {/* Level badge in center */}
        <div
          className={`absolute inset-0 m-auto w-6 h-6 rounded-full ${colorClass} flex items-center justify-center text-white font-bold text-[10px] shadow-md group-hover:scale-110 transition-transform`}
        >
          {level}
        </div>
      </div>

      {/* Achievement Icons */}
      {highlightAchievements.length > 0 && (
        <div className="hidden sm:flex gap-1 border-l border-border pl-2">
          {highlightAchievements.map((achievement) => (
            <span
              key={achievement.id}
              className="text-lg group-hover:scale-125 transition-transform"
              title={achievement.name}
            >
              {achievement.icon}
            </span>
          ))}
          {gameStats &&
            Object.keys(gameStats.achievements).filter((id) => gameStats.achievements[id]?.unlocked)
              .length > 3 && (
              <span className="text-xs text-muted-foreground self-center">
                +
                {Object.keys(gameStats.achievements).filter(
                  (id) => gameStats.achievements[id]?.unlocked
                ).length - 3}
              </span>
            )}
        </div>
      )}
    </button>
  )
}
