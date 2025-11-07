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
      className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
    >
      {/* Circular progress around level badge (now used for all screen sizes) */}
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
            className="text-gray-200"
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
            className={`transition-all duration-300 ${
              level === 1 ? 'text-blue-500' :
              level === 2 ? 'text-green-500' :
              level === 3 ? 'text-yellow-500' :
              level === 4 ? 'text-orange-500' :
              level === 5 ? 'text-red-500' :
              'text-purple-500'
            }`}
          />
        </svg>
        {/* Level badge in center */}
        <div className={`absolute inset-0 m-auto w-6 h-6 rounded-full ${getLevelColor(level)} flex items-center justify-center text-white font-bold text-[10px] shadow-md group-hover:scale-110 transition-transform`}>
          {level}
        </div>
      </div>

      {/* Achievement Icons */}
      {highlightAchievements.length > 0 && (
        <div className="hidden sm:flex gap-1 border-l border-gray-200 pl-2">
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
