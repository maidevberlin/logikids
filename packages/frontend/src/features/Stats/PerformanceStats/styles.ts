export const styles = {
  base: `
    grid grid-cols-1 md:grid-cols-2 gap-8
  `,
  card: {
    base: `
      p-6 rounded-lg
    `,
    success: `
      bg-green-50
    `,
    hints: `
      bg-purple-50
    `
  },
  title: {
    base: `
      text-lg font-semibold text-center mb-4
    `,
    success: `
      text-green-800
    `,
    hints: `
      text-purple-800
    `
  },
  value: `
    text-lg text-center mt-4
  `,
  gaugeMeter: {
    base: `
      h-48 w-full flex items-center justify-center relative
    `,
    container: `
      w-48
    `,
    needle: `
      fill-gray-900
    `,
    scale: `
      absolute bottom-8 left-0 right-0 flex justify-between px-4 text-sm text-gray-600
    `
  },
  hintUsage: {
    base: `
      h-48 w-full flex flex-col items-center justify-center space-y-4
    `,
    value: `
      text-3xl font-bold text-purple-800
    `,
    max: `
      text-lg text-purple-600 font-normal
    `,
    progress: `
      w-full max-w-xs space-y-2
    `,
    track: `
      h-8 w-full bg-gray-100 rounded-full overflow-hidden
    `,
    barFill: {
      base: `
        h-full transition-all duration-500 ease-out rounded-full
      `,
      success: `
        bg-success-500
      `,
      warning: `
        bg-warning-500
      `,
      orange: `
        bg-orange-500
      `,
      error: `
        bg-error-500
      `
    },
    scale: {
      base: `
        flex justify-between text-sm text-gray-500 px-1
      `,
      mark: `
        flex flex-col items-center
      `,
      line: `
        h-1 w-0.5 bg-gray-300 mb-1
      `
    }
  }
} as const 