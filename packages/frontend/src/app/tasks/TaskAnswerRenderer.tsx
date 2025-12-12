import { answerTypeComponents } from './answer-types'
import {
  Task,
  SingleChoiceTask,
  NumberInputTask,
  MultiSelectTask,
  OrderingTask,
  FillInBlankTask,
} from './types'

interface TaskAnswerRendererProps {
  task: Task
  selectedAnswer:
    | number
    | boolean
    | string[]
    | number[]
    | { value: number | null; unit?: string }
    | null
  onAnswerSelect: (
    answer: number | boolean | string[] | number[] | { value: number | null; unit?: string } | null
  ) => void
  isCorrect: boolean | null
}

export function TaskAnswerRenderer({
  task,
  selectedAnswer,
  onAnswerSelect,
  isCorrect,
}: TaskAnswerRendererProps) {
  // Render the appropriate answer component based on task type
  switch (task.type) {
    case 'single_choice': {
      const scTask = task as SingleChoiceTask
      const AnswerComponent = answerTypeComponents.single_choice
      return (
        <AnswerComponent
          taskId={task.taskId}
          options={scTask.options}
          selectedAnswer={selectedAnswer as number | null}
          onAnswerSelect={(index) => onAnswerSelect(index)}
          isLocked={isCorrect === true}
        />
      )
    }
    case 'yes_no': {
      const AnswerComponent = answerTypeComponents.yes_no
      return (
        <AnswerComponent
          selectedAnswer={selectedAnswer as boolean | null}
          onAnswerSelect={(answer) => onAnswerSelect(answer)}
          isLocked={isCorrect === true}
        />
      )
    }
    case 'number_input': {
      const niTask = task as NumberInputTask
      const AnswerComponent = answerTypeComponents.number_input
      return (
        <AnswerComponent
          expectedAnswer={niTask.answer}
          unit={niTask.unit}
          unitOptions={niTask.unitOptions}
          selectedAnswer={selectedAnswer as { value: number | null; unit?: string } | null}
          onAnswerSelect={(answer) => onAnswerSelect(answer)}
          isLocked={isCorrect === true}
        />
      )
    }
    case 'multi_select': {
      const msTask = task as MultiSelectTask
      const AnswerComponent = answerTypeComponents.multi_select
      return (
        <AnswerComponent
          taskId={task.taskId}
          options={msTask.options}
          expectedCount={msTask.expectedCount}
          selectedAnswer={selectedAnswer as number[] | null}
          onAnswerSelect={(indices) => onAnswerSelect(indices)}
          isLocked={isCorrect === true}
        />
      )
    }
    case 'ordering': {
      const oTask = task as OrderingTask
      const AnswerComponent = answerTypeComponents.ordering
      return (
        <AnswerComponent
          taskId={task.taskId}
          items={oTask.items}
          selectedAnswer={selectedAnswer as string[] | null}
          onAnswerSelect={(order) => onAnswerSelect(order)}
          isLocked={isCorrect === true}
        />
      )
    }
    case 'fill_in_blank': {
      const fibTask = task as FillInBlankTask
      const AnswerComponent = answerTypeComponents.fill_in_blank
      return (
        <AnswerComponent
          fillableText={fibTask.fillableText}
          blanksCount={fibTask.blanks.length}
          selectedAnswer={selectedAnswer as string[] | null}
          onAnswerSelect={(answers) => onAnswerSelect(answers)}
          isLocked={isCorrect === true}
        />
      )
    }
    default:
      // This should never happen with a properly typed Task union
      return <div className="text-red-500">Unknown task type</div>
  }
}
