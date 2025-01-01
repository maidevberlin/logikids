import { useTranslation } from 'react-i18next'
import { Feedback as BaseFeedback } from '../base/Feedback/Feedback'

interface FeedbackProps {
  isCorrect: boolean
  message?: string
}

export function Feedback({ 
  isCorrect, 
  message 
}: FeedbackProps) {
  const { t } = useTranslation()
  const defaultMessage = isCorrect 
    ? t('feedback.correct')
    : t('feedback.incorrect')

  return (
    <BaseFeedback
      message={message || defaultMessage}
      variant={isCorrect ? 'success' : 'error'}
      animate
      showIcon
    />
  )
} 