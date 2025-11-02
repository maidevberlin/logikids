import { useNavigate } from 'react-router-dom'
import { useUserData } from '@/app/account'
import { useProgress } from '@/app/stats'
import { ACHIEVEMENTS } from '@/app/stats/achievements'
import { TASK_LEVELS } from '@/app/stats/types'

export function HeaderGameStats() {
  const navigate = useNavigate()
  const { data } = useUserData()
  const { gameStats, progress } = useProgress()

  // Calculate level and progress
  const totalTasks = Object.values(progress.stats).reduce((sum, subject) => {
    return sum + Object.values(subject).reduce((s, stats) => s + stats.correct + stats.wrong, 0)
  }, 0)

  const currentLevelIndex = TASK_LEVELS.findIndex(threshold => totalTasks < threshold)
  const level = currentLevelIndex === -1 ? TASK_LEVELS.length : currentLevelIndex + 1

  const prevThreshold = level > 1 ? TASK_LEVELS[level - 2] : 0
  const nextThreshold = level <= TASK_LEVELS.length
    ? TASK_LEVELS[level - 1]
    : TASK_LEVELS[TASK_LEVELS.length - 1]
  const progressInLevel = totalTasks - prevThreshold
  const tasksForLevel = nextThreshold - prevThreshold
  const progressPercent = (progressInLevel / tasksForLevel) * 100

  // Get level color
  const getLevelColor = (lvl: number) => {
    if (lvl <= 4) return 'bg-blue-500'
    if (lvl <= 8) return 'bg-indigo-500'
    if (lvl <= 12) return 'bg-purple-500'
    if (lvl <= 16) return 'bg-violet-500'
    return 'bg-fuchsia-500'
  }

  // Get unlocked achievements
  const unlockedAchievements = ACHIEVEMENTS.filter(
    achievement => gameStats.achievements[achievement.id]?.unlocked
  )

  // Get tier 3 and 4 achievements to display (max 3)
  const highlightAchievements = unlockedAchievements
    .filter(a => a.tier >= 3)
    .slice(0, 3)

  return (
    <button
      onClick={() => navigate('/stats')}
      className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
    >
      {/* Compact Level Badge */}
      <div className="relative flex items-center gap-2">
        <div className={`w-6 h-6 rounded-full ${getLevelColor(level)} flex items-center justify-center text-white font-bold text-[10px] shadow-md group-hover:scale-110 transition-transform`}>
          {level}
        </div>

        {/* Progress bar with text inside */}
        <div className="relative w-24 h-5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getLevelColor(level)} transition-all duration-300`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-gray-700">
            {progressInLevel}/{tasksForLevel}
          </span>
        </div>
      </div>

      {/* Achievement Icons */}
      {highlightAchievements.length > 0 && (
        <div className="flex gap-1 border-l border-gray-200 pl-2">
          {highlightAchievements.map(achievement => (
            <span
              key={achievement.id}
              className="text-lg group-hover:scale-125 transition-transform"
              title={achievement.name}
            >
              {achievement.icon}
            </span>
          ))}
          {unlockedAchievements.length > 3 && (
            <span className="text-xs text-gray-500 self-center">
              +{unlockedAchievements.length - 3}
            </span>
          )}
        </div>
      )}
    </button>
  )
}
