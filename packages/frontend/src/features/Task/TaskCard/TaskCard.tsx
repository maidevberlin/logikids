import { memo } from 'react'
import { Card } from '../../base/Card'
import { ErrorDisplay } from '../../base/Error/ErrorDisplay'
import { Heading } from '../../base/Typography/Heading'
import { cn } from '../../../utils/cn'
import { TaskAnswer } from '../TaskAnswer'
import { TaskCardProps } from './types'
import { styles } from './styles'
import { DifficultySelect } from '../DifficultySelect'

function TaskCardComponent({
  isLoading,
  task,
  selectedAnswer,
  difficulty,
  error,
  isCorrect,
  onAnswerSelect,
  onAnswerSubmit,
  onNextTask,
  onDifficultyChange,
  onHintUsed,
  hints,
  requestHint,
  hintLoading,
  hintError,
  canRequestHint
}: TaskCardProps) {

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
          <TaskAnswer
            task={{
              type: 'multiple_choice',
              options: [],
              title: '',
              task: '',
              taskId: ''
            }}
            selectedAnswer={null}
            isLoading={true}
            isCorrect={null}
            onAnswerSelect={() => {}}
            onAnswerSubmit={() => {}}
            onNextTask={() => {}}
            onHintUsed={() => {}}
            hints={[]}
            requestHint={() => {}}
            hintLoading={false}
            hintError={null}
            canRequestHint={false}
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
            <DifficultySelect
              value={difficulty}
              onChange={onDifficultyChange}
            />
          </div>
          <div 
            className={styles.task}
            dangerouslySetInnerHTML={{ __html: task.task }} 
          />
          
          <TaskAnswer
            task={task}
            selectedAnswer={selectedAnswer}
            isLoading={isLoading}
            isCorrect={isCorrect}
            onAnswerSelect={onAnswerSelect}
            onAnswerSubmit={onAnswerSubmit}
            onNextTask={onNextTask}
            onHintUsed={onHintUsed}
            hints={hints}
            requestHint={requestHint}
            hintLoading={hintLoading}
            hintError={hintError}
            canRequestHint={canRequestHint}
          />
        </div>
      </Card>
    </div>
  )
}

export const TaskCard = memo(TaskCardComponent) 