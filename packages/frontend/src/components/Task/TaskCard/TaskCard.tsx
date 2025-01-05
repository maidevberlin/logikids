import { memo } from 'react'
import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { useTranslation } from 'react-i18next'
import { Card } from '../../base/Card'
import { ErrorDisplay } from '../../base/Error/ErrorDisplay'
import { Heading } from '../../base/Typography/Heading'
import { cn } from '../../../utils/cn'
import { MultipleChoiceAnswer } from '../MultipleChoiceAnswer'
import { HintSection } from '../Hint/HintSection'
import { SkipLink } from './SkipLink/SkipLink'
import { TaskCardProps } from './types'
import { styles } from './styles'

function TaskCardComponent({
  isLoading,
  task,
  selectedAnswer,
  difficulty,
  error,
  onAnswerSelect,
  onAnswerSubmit,
  onNextTask,
  onDifficultyChange,
  onHintUsed,
}: TaskCardProps) {
  const { t } = useTranslation()

  // Check if current answer is correct
  const isCorrect = task && selectedAnswer !== null ? task.options[selectedAnswer]?.isCorrect : null

  if (error) {
    return (
      <Card variant="error" elevated>
        <ErrorDisplay message={error} onRetry={onNextTask} />
      </Card>
    )
  }

  if (isLoading || !task) {
    return (
      <Card elevated>
        <div className={styles.loading.base}>
          <div className={styles.header}>
            <div className={styles.loading.title} />
            <div className={styles.loading.difficulty} />
          </div>
          <div className={styles.loading.content}>
            <div className={cn(styles.loading.line.base, styles.loading.line.full)} />
            <div className={cn(styles.loading.line.base, styles.loading.line.threeFourths)} />
            <div className={cn(styles.loading.line.base, styles.loading.line.fiveSixths)} />
          </div>
          <MultipleChoiceAnswer
            options={[]}
            selectedAnswer={null}
            onAnswerSelect={() => {}}
            onSubmit={() => {}}
            onNextTask={() => {}}
            isLoading={true}
          />
        </div>
      </Card>
    )
  }

  return (
    <div className={styles.base}>
      <Card elevated>
        <div className={styles.content}>
          <div className={styles.header}>
            <Heading level={2}>{task.title}</Heading>
            <Menu as="div" className={styles.menu.base}>
              <Menu.Button className={styles.menu.button}>
                <span className={cn(
                  styles.menu.label,
                  `difficulty-${difficulty}`
                )}>
                  {t(`difficulty.${difficulty}`)}
                </span>
                <ChevronDownIcon className={styles.menu.icon} />
              </Menu.Button>
              <Menu.Items className={styles.menu.items}>
                {(['easy', 'medium', 'hard'] as const).map((d) => (
                  <Menu.Item key={d}>
                    {({ active }) => (
                      <button
                        className={cn(
                          styles.menu.item.base,
                          active && styles.menu.item.active,
                          `difficulty-${d}`
                        )}
                        onClick={() => onDifficultyChange(d)}
                      >
                        <span className={cn(
                          styles.menu.item.dot,
                          `difficulty-${d}-dot`
                        )} />
                        <span>{t(`difficulty.${d}`)}</span>
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Menu>
          </div>
          <div 
            className={styles.task}
            dangerouslySetInnerHTML={{ __html: task.task }} 
          />
          
          <MultipleChoiceAnswer
            options={task.options}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={onAnswerSelect}
            onSubmit={onAnswerSubmit}
            onNextTask={onNextTask}
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
        <div className={styles.footer}>
          <SkipLink onClick={onNextTask} />
        </div>
      )}
    </div>
  )
}

export const TaskCard = memo(TaskCardComponent) 