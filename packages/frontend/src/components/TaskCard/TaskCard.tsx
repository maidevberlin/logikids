import { memo } from 'react'
import { Task, Difficulty } from '../../types/task'
import { Card } from '../base/Card'
import { ErrorDisplay } from '../ErrorDisplay'
import { MultipleChoiceAnswer } from './MultipleChoiceAnswer'
import { Heading } from '../base/Typography/Heading'
import { HintSection } from './Hint/HintSection'
import { SkipLink } from './SkipLink'
import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { cn } from '../base/styles/utils'
import { interactive } from '../base/styles'
import { useTranslation } from 'react-i18next'

interface TaskCardProps {
  isLoading: boolean
  task: Task
  selectedAnswer: number | null
  isCorrect: boolean | null
  difficulty: Difficulty
  error: string | null
  onAnswerSelect: (index: number | null) => void
  onAnswerSubmit: () => void
  onNextTask: () => void
  onDifficultyChange: (difficulty: Difficulty) => void
}

function TaskCardComponent({
  isLoading,
  task,
  selectedAnswer,
  isCorrect,
  difficulty,
  error,
  onAnswerSelect,
  onAnswerSubmit,
  onNextTask,
  onDifficultyChange,
}: TaskCardProps) {
  const { t } = useTranslation()
  
  const difficulties: { value: Difficulty, label: string, color: string }[] = [
    { value: 'easy', label: t('difficulty.easy'), color: 'text-green-600' },
    { value: 'medium', label: t('difficulty.medium'), color: 'text-amber-500' },
    { value: 'hard', label: t('difficulty.hard'), color: 'text-red-600' }
  ]

  return (
    <div className="space-y-4">
      <Card variant={error ? 'error' : 'default'}>
        <div className="space-y-4">
          {error ? (
            <ErrorDisplay 
              message={error} 
              onRetry={onNextTask} 
              isLoading={isLoading}
              standalone={false}
            />
          ) : (
            <>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <Heading level={2}>{task.title}</Heading>
                    <Menu as="div" className="relative">
                      <Menu.Button className={cn(
                        difficulties.find(d => d.value === difficulty)?.color,
                        'hover:opacity-80',
                        'flex items-center space-x-1',
                        'text-sm',
                        interactive.transition
                      )}>
                        <span>{difficulties.find(d => d.value === difficulty)?.label}</span>
                        <ChevronDownIcon className="w-3 h-3" />
                      </Menu.Button>
                      <Menu.Items className={cn(
                        'absolute right-0 mt-1',
                        'bg-white rounded-md shadow-lg',
                        'py-1 w-24',
                        'z-20'
                      )}>
                        {difficulties.map((diff) => (
                          <Menu.Item key={diff.value}>
                            {({ active }) => (
                              <button
                                className={cn(
                                  'block w-full text-left px-4 py-1 text-sm',
                                  diff.color,
                                  active ? 'bg-gray-50' : ''
                                )}
                                onClick={() => onDifficultyChange(diff.value)}
                              >
                                {diff.label}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Menu>
                  </div>
                  <div 
                    className="prose prose-blue max-w-none"
                    dangerouslySetInnerHTML={{ __html: task.task }} 
                  />
                </>
              )}
              
              <MultipleChoiceAnswer
                options={isLoading ? [] : task.options}
                selectedAnswer={selectedAnswer}
                isCorrect={isCorrect}
                onAnswerSelect={onAnswerSelect}
                onSubmit={onAnswerSubmit}
                onNextTask={onNextTask}
                solutionExplanation={isLoading ? '' : task.solution.explanation}
                isLoading={isLoading}
              />

              {!isLoading && isCorrect !== true && (
                <HintSection
                  hints={task.hints}
                  hasWrongAnswer={isCorrect === false}
                />
              )}
            </>
          )}
        </div>
      </Card>

      {!isLoading && !error && isCorrect !== true && (
        <div className="flex justify-end">
          <SkipLink onClick={onNextTask} />
        </div>
      )}
    </div>
  )
}

// Memoize TaskCard to prevent unnecessary re-renders
export const TaskCard = memo(TaskCardComponent, (prevProps, nextProps) => {
  // Custom comparison function to determine if re-render is needed
  return (
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.error === nextProps.error &&
    prevProps.selectedAnswer === nextProps.selectedAnswer &&
    prevProps.isCorrect === nextProps.isCorrect &&
    prevProps.difficulty === nextProps.difficulty &&
    prevProps.task === nextProps.task // Compare the entire task object
  )
}) 