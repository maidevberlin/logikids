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
  answer?: string
  selectedAnswer?: string | null
  isCorrect?: boolean | null
  onAnswerChange?: (value: string) => void
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
  answer = '',
  selectedAnswer = null,
  isCorrect = null,
  onAnswerChange = () => {},
  onAnswerSubmit = () => {},
  onRequestHint,
  onNextTask,
  children
}: TaskCardProps) {
  const handleNextTask = () => {
    // Show loading state immediately when clicking next
    onNextTask()
  }

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

                {isCorrect === true && (
                  <div className="mb-4">
                    <div className="text-green-600 font-semibold mb-2">
                      Congratulations! That's correct! 🎉
                    </div>
                    <button
                      onClick={handleNextTask}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      Next Task
                    </button>
                  </div>
                )}

                {isCorrect !== true && (
                  <AnswerForm
                    answer={answer}
                    selectedAnswer={selectedAnswer}
                    isCorrect={isCorrect}
                    onAnswerChange={onAnswerChange}
                    onSubmit={onAnswerSubmit}
                  />
                )}

                <HintSection 
                  hint={hint} 
                  onRequestHint={onRequestHint} 
                  onSkip={handleNextTask}
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