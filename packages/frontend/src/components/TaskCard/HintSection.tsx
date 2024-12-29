import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { LightBulbIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
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
  const [shouldShake, setShouldShake] = useState(false)
  const hasMoreHints = visibleHints < hints.length
  const hasHints = hints.length > 0

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasMoreHints) {
        setShouldShake(true)
      }
    }, 30000)

    return () => clearTimeout(timer)
  }, [hasMoreHints])

  const handleRequestHint = () => {
    if (hasMoreHints) {
      setVisibleHints(prev => prev + 1)
      setShouldShake(false)
    }
  }

  if (!hasHints) {
    return (
      <div className="flex justify-end">
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          Skip
          <ArrowRightIcon className="h-5 w-5" />
        </Link>
      </div>
    )
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
      
      <div className="flex justify-between">
        <motion.div animate={{ scale: shouldShake ? 1.05 : 1 }} className={shouldShake ? 'animate-shake' : ''}>
          <TaskOption 
            onSelect={handleRequestHint}
            label={
              <span className="inline-flex items-center gap-2">
                <LightBulbIcon className="h-5 w-5" />
                {visibleHints === 0 ? 'Get Hint' : 'Get Another Hint'}
              </span>
            }
            disabled={!hasMoreHints}
            variant="secondary"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          />
        </motion.div>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          Skip
          <ArrowRightIcon className="h-5 w-5" />
        </Link>
      </div>
    </div>
  )
} 