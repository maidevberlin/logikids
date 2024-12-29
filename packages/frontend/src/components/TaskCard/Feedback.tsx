import { motion } from 'framer-motion'

interface FeedbackProps {
  isCorrect: boolean
  message?: string
}

export function Feedback({ 
  isCorrect, 
  message 
}: FeedbackProps) {
  const defaultMessage = isCorrect 
    ? 'Correct! Well done!' 
    : 'Not quite right. Try another answer!'

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