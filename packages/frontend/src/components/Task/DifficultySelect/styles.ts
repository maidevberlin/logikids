export const styles = {
  button: `
    flex items-center space-x-1 text-sm transition-all duration-200
  `,
  menu: `
    absolute right-0 mt-1 bg-white rounded-md shadow-lg py-1 w-48 z-20
  `,
  item: {
    base: `
      block w-full text-left px-4 py-1 text-sm
    `,
    active: `
      bg-primary-50
    `
  },
  difficulty: {
    easy: `
      inline-flex px-2.5 py-0.5 rounded-full text-sm font-medium
      bg-success-100 text-success-800
    `,
    medium: `
      inline-flex px-2.5 py-0.5 rounded-full text-sm font-medium
      bg-warning-100 text-warning-800
    `,
    hard: `
      inline-flex px-2.5 py-0.5 rounded-full text-sm font-medium
      bg-error-100 text-error-800
    `
  }
} as const 