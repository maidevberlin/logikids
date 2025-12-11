import { YesNoAnswer } from './YesNoAnswer'
import { SingleChoiceAnswer } from './SingleChoiceAnswer'
import { FillInBlankAnswer } from './FillInBlankAnswer'
import { NumberInputAnswer } from './NumberInputAnswer'
import { OrderingAnswer } from './OrderingAnswer'
import { MultiSelectAnswer } from './MultiSelectAnswer'

export {
  YesNoAnswer,
  SingleChoiceAnswer,
  FillInBlankAnswer,
  NumberInputAnswer,
  OrderingAnswer,
  MultiSelectAnswer,
}

// Shared components
export { AnswerOptionCard } from './AnswerOptionCard'

// Component registry for dynamic rendering
export const answerTypeComponents = {
  yes_no: YesNoAnswer,
  single_choice: SingleChoiceAnswer,
  fill_in_blank: FillInBlankAnswer,
  number_input: NumberInputAnswer,
  ordering: OrderingAnswer,
  multi_select: MultiSelectAnswer,
} as const
