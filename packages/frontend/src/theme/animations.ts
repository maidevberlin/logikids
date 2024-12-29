export const durations = {
  fast: 100,
  default: 200,
  slow: 300,
  slower: 500
} as const

export const transitions = {
  default: {
    type: 'tween',
    duration: durations.default,
    ease: 'easeInOut'
  },
  spring: {
    type: 'spring',
    stiffness: 400,
    damping: 30
  },
  bounce: {
    type: 'spring',
    stiffness: 300,
    damping: 10
  }
} as const

export const variants = {
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
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 }
  },
  shake: {
    initial: { scale: 1 },
    animate: { scale: [1, 1.02, 1] }
  }
} as const

export const scales = {
  hover: 1.02,
  active: 0.95,
  shake: 1.05
} as const

export const easings = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
} as const

export const delays = {
  stagger: 0.1,
  hint: 30000, // 30 seconds for hint reveal
  tooltip: 300
} as const 