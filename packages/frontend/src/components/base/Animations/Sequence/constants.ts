import { ANIMATION_TIMING } from '../constants'

export const SEQUENCE_TIMING = {
  duration: ANIMATION_TIMING.duration.default,
  easing: ANIMATION_TIMING.easing.default
}

export const SEQUENCE_VARIANTS = {
  fadeInOut: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideInOut: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 }
  },
  scaleInOut: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 }
  }
} 