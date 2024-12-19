import { ReactNode } from 'react'
import { LoadingSpinner } from '../LoadingSpinner'
import { TaskHeader } from './TaskHeader'
import { HintSection } from './HintSection'
import { AnswerForm } from './AnswerForm'
import { TaskResponse, Difficulty } from '../../types/task'
import { DifficultySelect } from '../TaskOptions/DifficultySelect'

interface TaskCardProps {
  isLoading: boolean
  task: TaskResponse | null
  hint: string | null
  type: 'arithmetic' | 'geometry'
  answer?: number | null
  selectedAnswer?: number | null
  isCorrect?: boolean | null
  difficulty: Difficulty
  onAnswerChange?: (value: number) => void
  onAnswerSubmit?: (event: React.FormEvent) => void
  onRequestHint: () => void
  onNextTask: () => void
  onDifficultyChange: (difficulty: Difficulty) => void
  children?: ReactNode
}

export function TaskCard({ 
  isLoading,
  task,
  hint,
  type,
  answer = null,
  selectedAnswer = null,
  isCorrect = null,
  difficulty,
  onAnswerChange = () => {},
  onAnswerSubmit = () => {},
  onRequestHint = () => {},
  onNextTask,
  onDifficultyChange,
  children
}: TaskCardProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <TaskHeader type={type} />
        
        <div className="bg-white rounded-xl shadow-lg p-8 relative">
          <div className="absolute top-6 right-6 w-32">
            <DifficultySelect
              difficulty={difficulty}
              onDifficultyChange={onDifficultyChange}
            />
          </div>
          
          <div className="min-h-[200px]">
            {isLoading || !task ? (
              <div className="flex items-center justify-center h-[200px]">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 mt-14">{task.task}</h2>

                <AnswerForm
                  answer={answer}
                  selectedAnswer={selectedAnswer}
                  isCorrect={isCorrect}
                  onAnswerChange={onAnswerChange}
                  onSubmit={onAnswerSubmit}
                  onNextTask={onNextTask}
                  onRequestHint={onRequestHint}
                />

                <HintSection 
                  hint={hint} 
                  onRequestHint={onRequestHint} 
                  onSkip={onNextTask}
                />

                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 