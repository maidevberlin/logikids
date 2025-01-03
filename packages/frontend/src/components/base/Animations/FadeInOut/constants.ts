export const FADE_TIMING = {
  duration: {
    default: 200,
    long: 300
  },
  easing: {
    default: [0.4, 0, 0.2, 1],
    spring: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  }
} as const 