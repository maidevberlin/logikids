import { useTranslation } from 'react-i18next'
import { useSettings } from '../hooks/useSettings'
import { useProgress } from '../hooks/useProgress'
import { Breadcrumb } from '../components/base/Breadcrumb/Breadcrumb'
import { Heading } from '../components/base/Typography/Heading'
import { Text } from '../components/base/Typography/Text'
import { cn } from '../components/base/styles/utils'
import { container, background } from '../components/base/styles/common'
import { Subject, Difficulty } from '../types/task'
import { PieChart, Pie, Cell, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'

const SUBJECTS: Subject[] = ['math', 'logic']
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']
const TASK_LEVELS = [
  { threshold: 20, color: '#93C5FD' },  // blue-300
  { threshold: 50, color: '#60A5FA' },  // blue-400
  { threshold: 100, color: '#3B82F6' }, // blue-500
  { threshold: 200, color: '#2563EB' }, // blue-600
]

const TaskProgressBar = ({ value }: { value: number }) => {
  const currentLevel = TASK_LEVELS.findIndex(level => value < level.threshold) 
  const previousThreshold = currentLevel > 0 ? TASK_LEVELS[currentLevel - 1].threshold : 0
  const nextThreshold = currentLevel >= 0 ? TASK_LEVELS[currentLevel].threshold : TASK_LEVELS[0].threshold
  const progress = ((value - previousThreshold) / (nextThreshold - previousThreshold)) * 100

  return (
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
  )
}

// Add these helper components for better organization
const DonutChart = ({ value, total, color }: { value: number, total: number, color: string }) => {
  const data = [
    { name: 'Complete', value: value },
    { name: 'Remaining', value: total - value }
  ]
  
  return (
    <div className="h-48 w-full flex items-center justify-center">
      <div className="w-48">
        <ResponsiveContainer width="100%" height={192}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
            >
              <Cell fill={color} />
              <Cell fill="#E5E7EB" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const GaugeMeter = ({ value }: { value: number }) => {
  const data = [{ value: 100 }] // Always fill the background
  // Ensure value is between 0 and 100
  const boundedValue = Math.min(Math.max(value, 0), 100)
  // Calculate angle: -90° is 0%, 90° is 100%
  const angle = -90 + (boundedValue * 180 / 100)
  
  return (
    <div className="h-48 w-full flex items-center justify-center relative">
      <div className="w-48">
        <ResponsiveContainer width="100%" height={192}>
          <RadialBarChart 
            innerRadius={60}
            outerRadius={80}
            data={data} 
            startAngle={180} 
            endAngle={0}
            barSize={20}
          >
            <defs>
              <linearGradient id="successGradient" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#22C55E" /> {/* green-500 */}
                <stop offset="50%" stopColor="#EAB308" /> {/* yellow-500 */}
                <stop offset="100%" stopColor="#EF4444" /> {/* red-500 */}
              </linearGradient>
            </defs>
            <RadialBar
              dataKey="value"
              fill="url(#successGradient)"
              background={{ fill: '#E5E7EB' }}
            />
            {/* Arrow indicator */}
            <g transform={`translate(100, 100) rotate(${angle})`}>
              <path
                d="M0,-40 L5,0 L-5,0 Z"
                fill="#1F2937"
                className="transition-transform duration-500 ease-out"
              />
              <circle r="6" fill="#1F2937" />
            </g>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      {/* Percentage labels */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-between px-4 text-sm text-gray-600">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  )
}

const HintUsageBar = ({ value }: { value: number }) => {
  const MAX_HINTS = 4
  const percentage = (value / MAX_HINTS) * 100
  
  return (
    <div className="h-48 w-full flex flex-col items-center justify-center space-y-4">
      {/* Hint count display */}
      <div className="text-3xl font-bold text-purple-800">
        {value.toFixed(1)}
        <span className="text-lg text-purple-600 font-normal"> / {MAX_HINTS}</span>
      </div>
      
      {/* Bar chart */}
      <div className="w-full max-w-xs space-y-2">
        <div className="h-8 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-500 ease-out rounded-full"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: percentage <= 25 ? '#22C55E' : // green if using 0-1 hints
                            percentage <= 50 ? '#EAB308' : // yellow if using 1-2 hints
                            percentage <= 75 ? '#F97316' : // orange if using 2-3 hints
                            '#EF4444'  // red if using 3-4 hints
            }} 
          />
        </div>
        {/* Scale markers */}
        <div className="flex justify-between text-sm text-gray-500 px-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="h-1 w-0.5 bg-gray-300 mb-1" />
              <span>{i}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const DIFFICULTY_CLASSES = {
  easy: 'text-green-600',
  medium: 'text-yellow-600',
  hard: 'text-red-600'
}

const SubjectStatsBar = ({ 
  subject, 
  difficulty, 
  successRate, 
  totalTasks 
}: { 
  subject: Subject
  difficulty: Difficulty
  successRate: number
  totalTasks: number 
}) => {
  if (totalTasks === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Text 
          className={cn(
            'capitalize font-medium',
            DIFFICULTY_CLASSES[difficulty]
          )}
        >
          {difficulty}
        </Text>
        <Text className="text-gray-600">
          {successRate.toFixed(1)}% ({totalTasks})
        </Text>
      </div>
      <div className="h-4 w-full bg-red-100 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-500 ease-out rounded-full bg-red-500"
          style={{ 
            width: '100%',
          }} 
        />
        <div 
          className="h-full transition-all duration-500 ease-out rounded-full bg-green-500 -mt-4"
          style={{ 
            width: `${successRate}%`,
          }} 
        />
      </div>
    </div>
  )
}

export default function StatsPage() {
  const { t } = useTranslation()
  const { settings } = useSettings()
  const { 
    getTotalTasksOverall,
    getOverallSuccessRate,
    getOverallAverageHints,
    getSuccessRate,
    getAverageHints,
    getTotalTasks
  } = useProgress()

  const totalTasks = getTotalTasksOverall()
  const overallSuccessRate = getOverallSuccessRate()
  const overallAverageHints = getOverallAverageHints()

  if (totalTasks === 0) {
    return (
      <>
        <Breadcrumb currentPage={t('stats.title')} />
        <div className={cn(
          'min-h-screen py-12',
          background.solid.gray
        )}>
          <div className={cn(
            container.base,
            container.maxWidth.md
          )}>
            <div className={cn(
              'bg-white rounded-xl shadow-xl p-8',
              'transform transition-all duration-300'
            )}>
              <Heading level={1} className="mb-8">
                {t('stats.title')}
              </Heading>

              <div className="space-y-6">
                {settings.name && (
                  <Text size="lg">
                    {t('stats.greeting', { name: settings.name })}
                  </Text>
                )}
                
                <div className="p-8 bg-gray-50 rounded-lg text-center">
                  <Text className="text-gray-600">
                    {t('stats.noTasksYet')}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumb currentPage={t('stats.title')} />
      <div className={cn(
        'min-h-screen py-12',
        background.solid.gray
      )}>
        <div className={cn(
          container.base,
          container.maxWidth.md
        )}>
          <div className={cn(
            'bg-white rounded-xl shadow-xl p-8',
            'transform transition-all duration-300'
          )}>
            <Heading level={1} className="mb-8">
              {t('stats.title')}
            </Heading>

            <div className="space-y-8">
              {settings.name && (
                <Text size="lg">
                  {t('stats.greeting', { name: settings.name })}
                </Text>
              )}

              {/* Task Progress */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <Text size="lg" className="text-gray-800 font-semibold mb-4">
                  {t('stats.totalTasks')}
                </Text>
                <TaskProgressBar value={totalTasks} />
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-green-50 p-6 rounded-lg">
                  <Text size="lg" className="text-green-800 font-semibold text-center mb-4">
                    {t('stats.successRate')}
                  </Text>
                  <GaugeMeter value={overallSuccessRate} />
                  <Text size="lg" className="text-center mt-4">
                    {overallSuccessRate.toFixed(1)}%
                  </Text>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <Text size="lg" className="text-purple-800 font-semibold text-center mb-4">
                    {t('stats.averageHints')}
                  </Text>
                  <HintUsageBar value={overallAverageHints} />
                  <Text size="lg" className="text-center mt-4">
                    {overallAverageHints.toFixed(1)} {t('stats.hints')}
                  </Text>
                </div>
              </div>

              {/* Stats by Subject */}
              <div className="space-y-8">
                <Heading level={2} className="text-2xl">
                  {t('stats.bySubject')}
                </Heading>
                {SUBJECTS.map(subject => {
                  const subjectTotal = DIFFICULTIES.reduce(
                    (sum, diff) => sum + getTotalTasks(subject, diff),
                    0
                  )

                  if (subjectTotal === 0) return null

                  return (
                    <div key={subject} className="space-y-4">
                      <Heading level={3} className="text-xl capitalize">
                        {t(`subjects.${subject}`)}
                      </Heading>
                      <div className="space-y-6">
                        {DIFFICULTIES.map(difficulty => (
                          <SubjectStatsBar
                            key={difficulty}
                            subject={subject}
                            difficulty={difficulty}
                            successRate={getSuccessRate(subject, difficulty)}
                            totalTasks={getTotalTasks(subject, difficulty)}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 