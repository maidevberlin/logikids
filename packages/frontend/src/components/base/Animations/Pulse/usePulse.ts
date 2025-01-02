import { useState, useCallback } from 'react'
import { ANIMATION_TIMING } from '../constants'
import { UsePulseReturn } from './types'

export function usePulse(): UsePulseReturn {
  const [isPulsing, setIsPulsing] = useState(false)

  const triggerPulse = useCallback(() => {
    setIsPulsing(true)
    setTimeout(() => setIsPulsing(false), ANIMATION_TIMING.duration.slow)
  }, [])

  return [isPulsing, triggerPulse]
} 