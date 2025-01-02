import { ReactNode } from 'react'
import { AnimationControls } from 'framer-motion'

export interface SequenceProps {
  children: ReactNode
  controls?: AnimationControls
  className?: string
}

export type UseSequenceReturn = [AnimationControls, () => Promise<void>] 