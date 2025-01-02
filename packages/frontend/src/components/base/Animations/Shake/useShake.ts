import { useState, useCallback } from 'react'
import { UseShakeReturn } from './types'

export function useShake(): UseShakeReturn {
  const [isShaking, setIsShaking] = useState(false)
  
  const startShake = useCallback(() => {
    setIsShaking(true)
  }, [])

  const stopShake = useCallback(() => {
    setIsShaking(false)
  }, [])

  return [isShaking, startShake, stopShake]
} 