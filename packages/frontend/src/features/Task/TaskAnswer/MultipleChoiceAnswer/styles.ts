export const styles = {
  base: `
    relative
    space-y-4
  `,
  grid: `
    grid grid-cols-2 gap-4
    relative z-10
  `,
  option: {
    base: `
      p-4
      relative
    `,
    content: `
      prose prose-blue max-w-none text-left
    `,
    selected: `
      prose prose-invert max-w-none text-left text-white
      **:text-white
    `
  },
  loading: {
    base: `
      space-y-4
    `,
    option: `
      h-4 bg-gray-200 rounded w-3/4 mx-auto
    `,
    button: `
      h-10 bg-gray-200 rounded w-full
    `
  },
  feedback: `
    relative z-20
    space-y-4
  `,
  action: {
    base: `
      w-full
      relative z-10
    `,
    ready: `
      border-2 border-primary-300 hover:bg-primary-50
    `
  }
} as const 