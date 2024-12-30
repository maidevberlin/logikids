import { Text } from '../base/Typography/Text'

const TASK_LEVELS = [
  { threshold: 20, color: '#93C5FD' },  // blue-300
  { threshold: 50, color: '#60A5FA' },  // blue-400
  { threshold: 100, color: '#3B82F6' }, // blue-500
  { threshold: 200, color: '#2563EB' }, // blue-600
]

export const TaskProgress = ({ value }: { value: number }) => {
  const currentLevel = TASK_LEVELS.findIndex(level => value < level.threshold) 
  const previousThreshold = currentLevel > 0 ? TASK_LEVELS[currentLevel - 1].threshold : 0
  const nextThreshold = currentLevel >= 0 ? TASK_LEVELS[currentLevel].threshold : TASK_LEVELS[0].threshold
  const progress = ((value - previousThreshold) / (nextThreshold - previousThreshold)) * 100

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <Text size="lg" className="text-gray-800 font-semibold mb-4">
        Total Tasks
      </Text>
      <div className="w-full space-y-2">
        <div className="flex justify-between items-center">
          <Text size="lg" className="font-medium">
            Level {currentLevel + 1}
          </Text>
          <Text size="lg" className="text-gray-600">
            {value} / {nextThreshold} tasks
          </Text>
        </div>
        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-500 ease-out rounded-full"
            style={{ 
              width: `${progress}%`,
              backgroundColor: TASK_LEVELS[currentLevel >= 0 ? currentLevel : 0].color
            }} 
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{previousThreshold}</span>
          <span>{nextThreshold}</span>
        </div>
      </div>
    </div>
  )
} 