import { memo } from 'react'
import { Task, Difficulty, Subject } from '../../types/task'
import { Card } from '../base/Card'
import { ErrorDisplay } from '../ErrorDisplay'
import { MultipleChoiceAnswer } from './MultipleChoiceAnswer'
import { TaskOptions } from './TaskOptions'
import { Heading } from '../base/Typography/Heading'
import { HintSection } from './Hint/HintSection'
import { SkipLink } from './SkipLink'

interface TaskCardProps {
  isLoading: boolean
  task: Task
  selectedAnswer: number | null
  isCorrect: boolean | null
  difficulty: Difficulty
  subject: Subject
  error: string | null
  onAnswerSelect: (index: number | null) => void
  onAnswerSubmit: () => void
  onNextTask: () => void
  onDifficultyChange: (difficulty: Difficulty) => void
  onSubjectChange: (subject: Subject) => void
}

function TaskCardComponent({
  isLoading,
  task,
  selectedAnswer,
  isCorrect,
  difficulty,
  subject,
  error,
  onAnswerSelect,
  onAnswerSubmit,
  onNextTask,
  onDifficultyChange,
  onSubjectChange
}: TaskCardProps) {
  return (
    <div className="space-y-4">
      <TaskOptions
        difficulty={difficulty}
        subject={subject}
        onDifficultyChange={onDifficultyChange}
        onSubjectChange={onSubjectChange}
      />
      
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
                  <Heading level={2}>{task.title}</Heading>
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
    prevProps.subject === nextProps.subject &&
    prevProps.task === nextProps.task // Compare the entire task object
  )
}) 