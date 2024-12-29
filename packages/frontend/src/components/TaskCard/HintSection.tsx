import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TaskOption } from './TaskOption'

interface HintProps {
  hint: string
  index: number
}

function Hint({ hint, index }: HintProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.1 }}
      className="bg-blue-50 p-4 rounded-lg"
    >
      <p className="text-blue-700">{hint}</p>
    </motion.div>
  )
}

interface HintSectionProps {
  hints: string[]
  onSkip: () => void
}

export function HintSection({ hints, onSkip }: HintSectionProps) {
  const [visibleHints, setVisibleHints] = useState(0)
  const hasMoreHints = visibleHints < hints.length
  const hasHints = hints.length > 0

  const handleRequestHint = () => {
    if (hasMoreHints) {
      setVisibleHints(prev => prev + 1)
    }
  }

  if (!hasHints) {
    return null
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {visibleHints > 0 && (
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {hints.slice(0, visibleHints).map((hint, index) => (
              <Hint key={index} hint={hint} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex gap-4">
        <TaskOption 
          onSelect={handleRequestHint}
          label={visibleHints === 0 ? 'Get Hint' : 'Get Another Hint'}
          disabled={!hasMoreHints}
          variant="secondary"
        />
        {visibleHints > 0 && (
          <TaskOption 
            onSelect={onSkip}
            label="Skip"
            variant="secondary"
          />
        )}
      </div>
    </div>
  )
} 