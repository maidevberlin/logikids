import { motion } from 'framer-motion'

interface HintBoxProps {
  hint: string
  index: number
}

export function HintBox({ hint, index }: HintBoxProps) {
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