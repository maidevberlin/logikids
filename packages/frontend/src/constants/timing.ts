export const TIMING = {
  // Task-related timings
  WRONG_ANSWER_RESET: 3000, // 3 seconds before auto-resetting wrong answer

  // Hint-related timings
  HINT_GLOW_TIMEOUT: 10000, // 10 seconds of inactivity before starting to glow
  HINT_WRONG_ANSWER_DELAY: 5000, // 3 seconds after wrong answer before showing hint automatically

  // Animation durations
  FADE_DURATION: 200, // 200ms for fade animations
  TRANSITION_DURATION: {
    FAST: 100,
    DEFAULT: 200,
    SLOW: 300,
    SLOWER: 500
  }
} as const 