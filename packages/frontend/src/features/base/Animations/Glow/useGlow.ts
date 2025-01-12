import { useState, useCallback } from 'react'
import { UseGlowReturn } from './types'

export function useGlow(): UseGlowReturn {
  const [isGlowing, setIsGlowing] = useState(false)
  
  const startGlow = useCallback(() => {
    setIsGlowing(true)
  }, [])

  const stopGlow = useCallback(() => {
    setIsGlowing(false)
  }, [])

  return [isGlowing, startGlow, stopGlow]
} 