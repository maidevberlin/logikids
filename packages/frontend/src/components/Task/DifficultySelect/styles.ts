export const styles = {
  button: `
    text-gray-500 hover:text-primary-600 flex items-center space-x-1 text-sm transition-all duration-200
  `,
  menu: `
    absolute right-0 mt-1 bg-white rounded-md shadow-lg py-1 w-48 z-20
  `,
  item: {
    base: `
      block w-full text-left px-4 py-1 text-sm text-gray-700
    `,
    active: `
      bg-primary-50 text-primary-600
    `
  },
  difficulty: {
    easy: `
      bg-success-50 text-success-800 border-success-200
    `,
    medium: `
      bg-warning-50 text-warning-800 border-warning-200
    `,
    hard: `
      bg-error-50 text-error-800 border-error-200
    `
  }
} as const 