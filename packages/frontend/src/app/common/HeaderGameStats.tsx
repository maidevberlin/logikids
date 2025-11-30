import { useNavigate } from 'react-router-dom'
import { useProgress } from '@/data/progress/hooks'
import { ACHIEVEMENTS } from '@/app/stats/achievements'

// Level thresholds for progress display
const LEVEL_THRESHOLDS = [0, 5, 15, 30, 50, 75, 100, 150, 200, 300, 400, 550, 700, 900, 1100, 1350, 1600, 2000, 2500, 3000, 4000]

function getLevelFromTasks(totalTasks: number): { level: number; progressPercent: number } {
  let level = 0
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalTasks >= LEVEL_THRESHOLDS[i]) {
      level = i
    } else {
      break
    }
  }

  const previousThreshold = level > 0 ? LEVEL_THRESHOLDS[level] : 0
  const nextThreshold = level < LEVEL_THRESHOLDS.length - 1 ? LEVEL_THRESHOLDS[level + 1] : LEVEL_THRESHOLDS[level]
  const progressPercent = ((totalTasks - previousThreshold) / (nextThreshold - previousThreshold)) * 100

  return { level: level + 1, progressPercent: Math.min(progressPercent, 100) }
}

function getLevelColor(level: number): string {
  if (level === 1) return 'bg-blue-500'
  if (level === 2) return 'bg-green-500'
  if (level === 3) return 'bg-yellow-500'
  if (level === 4) return 'bg-orange-500'
  if (level === 5) return 'bg-red-500'
  return 'bg-purple-500'
}

export function HeaderGameStats() {
  const navigate = useNavigate()
  const { gameStats, getOverallStats } = useProgress()

  const overallStats = getOverallStats()
  const { level, progressPercent } = getLevelFromTasks(overallStats.totalCorrect)

  // Get tier 3 and 4 achievements to display (max 3)
  const highlightAchievements = gameStats
    ? ACHIEVEMENTS
        .filter((a) => gameStats.achievements[a.id]?.unlocked && a.tier >= 3)
        .slice(0, 3)
    : []

  return (
    <button
      onClick={() => navigate('/stats')}
      className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 rounded-xl hover:bg-muted transition-all duration-200 group"
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
          {gameStats && Object.keys(gameStats.achievements).filter(id => gameStats.achievements[id]?.unlocked).length > 3 && (
            <span className="text-xs text-muted-foreground self-center">
              +{Object.keys(gameStats.achievements).filter(id => gameStats.achievements[id]?.unlocked).length - 3}
            </span>
          )}
        </div>
      )}
    </button>
  )
}
