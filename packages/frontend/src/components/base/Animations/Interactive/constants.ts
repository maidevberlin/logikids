export const INTERACTIVE_TIMING = {
  duration: {
    fast: 100
  },
  easing: {
    default: [0.4, 0, 0.2, 1],
    spring: {
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  }
} as const 