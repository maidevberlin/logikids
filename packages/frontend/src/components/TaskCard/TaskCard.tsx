import { ReactNode } from 'react'
import { LoadingSpinner } from '../LoadingSpinner'
import { TaskHeader } from './TaskHeader'
import { TaskContent } from './TaskContent'
import { HintSection } from './HintSection'
import { MultipleChoiceAnswer } from './MultipleChoiceAnswer'
import { Task, Difficulty, Subject } from '../../types/task'
import { DifficultySelect } from '../TaskOptions/DifficultySelect'
import { SubjectSelect } from '../TaskOptions/SubjectSelect'

interface TaskCardProps {
  isLoading: boolean
  task: Task
  selectedAnswer: number | null
  isCorrect: boolean | null
  difficulty: Difficulty
  subject: Subject
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
  onAnswerSelect,
  onAnswerSubmit,
  onNextTask,
  onDifficultyChange,
  onSubjectChange,
  children
}: TaskCardProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <TaskHeader />
        
        <div className="bg-white rounded-xl shadow-lg p-8 relative">
          <div className="flex justify-between items-center mb-8">
            <div className="w-40">
              <SubjectSelect
                subject={subject}
                onSubjectChange={onSubjectChange}
              />
            </div>
            <div className="w-40">
              <DifficultySelect
                difficulty={difficulty}
                onDifficultyChange={onDifficultyChange}
              />
            </div>
          </div>
          
          <div className="min-h-[200px]">
            {isLoading || !task ? (
              <div className="flex items-center justify-center h-[200px]">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-8">
                <TaskContent 
                  title={task.title}
                  description={task.task}
                />

                <MultipleChoiceAnswer
                  options={task.options}
                  selectedAnswer={selectedAnswer}
                  isCorrect={isCorrect}
                  onAnswerSelect={onAnswerSelect}
                  onSubmit={onAnswerSubmit}
                  onNextTask={onNextTask}
                />

                <HintSection 
                  hints={task.hints}
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