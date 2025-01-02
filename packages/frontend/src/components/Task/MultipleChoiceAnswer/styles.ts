export const styles = {
  base: `
    space-y-4
  `,
  grid: `
    grid grid-cols-2 gap-4
  `,
  option: {
    base: `
      p-4 transition-all duration-200
    `,
    selected: `
      ring-2 ring-primary-500 ring-offset-2
    `,
    content: `
      prose prose-blue max-w-none text-left
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
    space-y-4
  `,
  action: {
    base: `
      w-full
    `,
    ready: `
      border-2 border-primary-300 hover:bg-primary-50
    `
  }
} as const 