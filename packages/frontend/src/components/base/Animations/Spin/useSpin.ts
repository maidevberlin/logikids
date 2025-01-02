import { useState, useCallback } from 'react'
import { UseSpinReturn } from './types'

export function useSpin(): UseSpinReturn {
  const [isSpinning, setIsSpinning] = useState(false)
  
  const startSpin = useCallback(() => {
    setIsSpinning(true)
  }, [])

  const stopSpin = useCallback(() => {
    setIsSpinning(false)
  }, [])

  return [isSpinning, startSpin, stopSpin]
} 