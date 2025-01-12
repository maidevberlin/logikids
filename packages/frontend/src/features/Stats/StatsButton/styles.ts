export const styles = {
  button: `
    inline-flex items-center justify-center
    p-1 rounded-lg
    hover:bg-gray-50
    transition-colors
  `,
  level: {
    base: `
      flex items-center gap-2
      px-1
    `,
    text: `
      flex items-center justify-center
      w-6 h-6
      text-sm font-semibold
      bg-gray-100 rounded-full
      text-gray-700
    `,
    progress: `
      w-12 h-1.5
      bg-gray-100
      rounded-full
      overflow-hidden
    `,
    bar: `
      h-full
      transition-all duration-300
    `
  }
} as const 