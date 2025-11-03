import { useNavigate } from 'react-router-dom'
import { useProgress } from '@/app/stats'

export function HeaderGameStats() {
  const navigate = useNavigate()
  const { levelInfo, getLevelColor, unlockedAchievements } = useProgress()

  const { level, progressInLevel, tasksForLevel, progressPercent } = levelInfo

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
