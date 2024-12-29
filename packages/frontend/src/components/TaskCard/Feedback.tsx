import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-4 rounded-lg ${
        isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
      }`}
      role="alert"
      aria-live="polite"
    >
      <p className="font-medium">
        {message || defaultMessage}
      </p>
    </motion.div>
  )
} 