import { ReactNode } from 'react'
import { LoadingSpinner } from '../LoadingSpinner'
import { TaskHeader } from './TaskHeader'
import { HintSection } from './HintSection'
import { AnswerForm } from './AnswerForm'
import { TaskResponse } from '../../types/task'

interface TaskCardProps {
  isLoading: boolean
  task: TaskResponse | null
  hint: string | null
  type: 'arithmetic' | 'geometry'
  answer?: number | null
  selectedAnswer?: number | null
  isCorrect?: boolean | null
  onAnswerChange?: (value: number) => void
  onAnswerSubmit?: (event: React.FormEvent) => void
  onRequestHint: () => void
  onNextTask: () => void
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
  onAnswerChange = () => {},
  onAnswerSubmit = () => {},
  onRequestHint = () => {},
  onNextTask,
  children
}: TaskCardProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <TaskHeader type={type} />
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="min-h-[200px]">
            {isLoading || !task ? (
              <div className="flex items-center justify-center h-[200px]">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">{task.task}</h2>

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