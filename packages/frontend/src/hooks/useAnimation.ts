import { useState, useCallback } from 'react'
import { AnimationControls, useAnimation } from 'framer-motion'
import { variants, transitions, durations } from '../theme/animations'

export function useShakeAnimation(): [boolean, () => void] {
  const [isShaking, setIsShaking] = useState(false)

  const triggerShake = useCallback(() => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), durations.default)
  }, [])

  return [isShaking, triggerShake]
}

export function usePulseAnimation(): [boolean, () => void] {
  const [isPulsing, setIsPulsing] = useState(false)

  const triggerPulse = useCallback(() => {
    setIsPulsing(true)
    setTimeout(() => setIsPulsing(false), durations.slow)
  }, [])

  return [isPulsing, triggerPulse]
}

export function useGlowAnimation(interval = 30000): [boolean, () => void, () => void] {
  const [isGlowing, setIsGlowing] = useState(false)
  
  const startGlow = useCallback(() => {
    setIsGlowing(true)
  }, [])

  const stopGlow = useCallback(() => {
    setIsGlowing(false)
  }, [])

  return [isGlowing, startGlow, stopGlow]
}

export function useSequenceAnimation(): AnimationControls {
  const controls = useAnimation()

  const sequence = useCallback(async () => {
    await controls.start(variants.fadeInOut.animate)
    await controls.start(variants.scaleInOut.animate)
    return await controls.start(variants.slideInOut.animate)
  }, [controls])

  return controls
}

export function useSpinAnimation(): [boolean, () => void, () => void] {
  const [isSpinning, setIsSpinning] = useState(false)
  
  const startSpin = useCallback(() => {
    setIsSpinning(true)
  }, [])

  const stopSpin = useCallback(() => {
    setIsSpinning(false)
  }, [])

  return [isSpinning, startSpin, stopSpin]
}

export const motionProps = {
  fadeInOut: {
    initial: variants.fadeInOut.initial,
    animate: variants.fadeInOut.animate,
    exit: variants.fadeInOut.exit,
    transition: transitions.default
  },
  slideInOut: {
    initial: variants.slideInOut.initial,
    animate: variants.slideInOut.animate,
    exit: variants.slideInOut.exit,
    transition: transitions.spring
  },
  scaleInOut: {
    initial: variants.scaleInOut.initial,
    animate: variants.scaleInOut.animate,
    exit: variants.scaleInOut.exit,
    transition: transitions.bounce
  }
} 