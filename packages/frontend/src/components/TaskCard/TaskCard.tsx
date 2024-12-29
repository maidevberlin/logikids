import { ReactNode } from 'react'
import { LoadingSpinner } from '../LoadingSpinner'
import { TaskContent } from './TaskContent'
import { HintSection } from './HintSection'
import { MultipleChoiceAnswer } from './MultipleChoiceAnswer'
import { Task, Difficulty, Subject } from '../../types/task'
import { DifficultySelect } from '../TaskOptions/DifficultySelect'
import { SubjectSelect } from '../TaskOptions/SubjectSelect'
import { ErrorDisplay } from '../ErrorDisplay'

interface TaskCardProps {
  isLoading: boolean
  task: Task
  selectedAnswer: number | null
  isCorrect: boolean | null
  difficulty: Difficulty
  subject: Subject
  error: string | null
  onAnswerSelect: (index: number) => void
  onAnswerSubmit: () => void
  onNextTask: () => void
  onDifficultyChange: (difficulty: Difficulty) => void
  onSubjectChange: (subject: Subject) => void
  children?: ReactNode
}

export function TaskCard({ 
  isLoading,
  task,
  selectedAnswer = null,
  isCorrect = null,
  difficulty,
  subject,
  error,
  onAnswerSelect,
  onAnswerSubmit,
  onNextTask,
  onDifficultyChange,
  onSubjectChange,
  children
}: TaskCardProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end mb-4">
          <div className="flex gap-2">
            <div className="w-36">
              <SubjectSelect
                subject={subject}
                onSubjectChange={onSubjectChange}
              />
            </div>
            <div className="w-36">
              <DifficultySelect
                difficulty={difficulty}
                onDifficultyChange={onDifficultyChange}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 relative min-h-[400px]">
          {isLoading ? (
            <div className="absolute inset-0 bg-white flex items-center justify-center rounded-xl">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <ErrorDisplay 
                message={error} 
                onRetry={onNextTask}
              />
            </div>
          ) : !task?.title ? (
            <div className="absolute inset-0 bg-white flex items-center justify-center rounded-xl">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <TaskContent 
                title={task.title}
                description={task.task}
              />
              
              <div className="space-y-8">
                <MultipleChoiceAnswer
                  options={task.options}
                  selectedAnswer={selectedAnswer}
                  isCorrect={isCorrect}
                  onAnswerSelect={onAnswerSelect}
                  onSubmit={onAnswerSubmit}
                  onNextTask={onNextTask}
                  solutionExplanation={task.solution.explanation}
                />
                
                {isCorrect !== true && (
                  <HintSection 
                    hints={task.hints}
                    onSkip={onNextTask}
                  />
                )}
              </div>
              
              {children}
            </>
          )}
        </div>
      </div>
    </div>
  )
} 