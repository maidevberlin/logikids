import { Text } from '../base/Typography/Text'
import { Heading } from '../base/Typography/Heading'
import { cn } from '../base/styles/utils'
import { Subject, Difficulty } from '@logikids/backend/tasks/types'

const SUBJECTS: Subject[] = ['math', 'logic']
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']
const DIFFICULTY_CLASSES = {
  easy: 'text-green-600',
  medium: 'text-yellow-600',
  hard: 'text-red-600'
}

const SubjectStatsBar = ({ 
  difficulty, 
  successRate, 
  totalTasks 
}: { 
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
          style={{ width: '100%' }} 
        />
        <div 
          className="h-full transition-all duration-500 ease-out rounded-full bg-green-500 -mt-4"
          style={{ width: `${successRate}%` }} 
        />
      </div>
    </div>
  )
}

interface SubjectStatsProps {
  getSuccessRate: (subject: Subject, difficulty: Difficulty) => number
  getTotalTasks: (subject: Subject, difficulty: Difficulty) => number
}

export const SubjectStats = ({ getSuccessRate, getTotalTasks }: SubjectStatsProps) => {
  return (
    <div className="space-y-8">
      <Heading level={2} className="text-2xl">
        By Subject
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
              {subject}
            </Heading>
            <div className="space-y-6">
              {DIFFICULTIES.map(difficulty => (
                <SubjectStatsBar
                  key={difficulty}
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
  )
} 