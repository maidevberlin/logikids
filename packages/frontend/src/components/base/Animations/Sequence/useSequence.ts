import { useCallback } from 'react'
import { useAnimation } from 'framer-motion'
import { UseSequenceReturn } from './types'
import { SEQUENCE_VARIANTS } from './constants'

export function useSequence(): UseSequenceReturn {
  const controls = useAnimation()

  const sequence = useCallback(async () => {
    await controls.start(SEQUENCE_VARIANTS.fadeInOut.animate)
    await controls.start(SEQUENCE_VARIANTS.scaleInOut.animate)
    return await controls.start(SEQUENCE_VARIANTS.slideInOut.animate)
  }, [controls])

  return [controls, sequence]
} 