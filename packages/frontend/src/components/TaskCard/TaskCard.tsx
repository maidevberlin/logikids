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
  onHintUsed: () => void
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
  onHintUsed,
}: TaskCardProps) {
  const { t } = useTranslation()

  if (error) {
    return (
      <Card variant="error" elevated>
        <ErrorDisplay message={error} onRetry={onNextTask} />
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card elevated>
        <div className="space-y-8">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-32 bg-gray-200 rounded" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <Heading level={2}>{task.title}</Heading>
                <Menu as="div" className="relative">
                  <Menu.Button className={cn(
                    'inline-flex items-center gap-2 px-4 py-2',
                    'text-sm font-medium rounded-md',
                    'text-gray-700 bg-white',
                    'border border-gray-300',
                    interactive.hover.opacity,
                    interactive.focus
                  )}>
                    {t('task.difficulty')}: {t(`difficulty.${difficulty}`)}
                    <ChevronDownIcon className="h-5 w-5" />
                  </Menu.Button>
                  <Menu.Items className={cn(
                    'absolute right-0 mt-2 w-48',
                    'bg-white rounded-md shadow-lg',
                    'border border-gray-100',
                    'z-10'
                  )}>
                    {(['easy', 'medium', 'hard'] as const).map((d) => (
                      <Menu.Item key={d}>
                        {({ active }) => (
                          <button
                            onClick={() => onDifficultyChange(d)}
                            className={cn(
                              'block w-full text-left px-4 py-2',
                              'text-sm',
                              active ? 'bg-gray-50' : ''
                            )}
                          >
                            {t(`difficulty.${d}`)}
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
              onHintUsed={onHintUsed}
            />
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

export const TaskCard = memo(TaskCardComponent) 