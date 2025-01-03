export const styles = {
  base: `
    flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-all duration-200
  `,
  variant: {
    primary: `
      bg-white text-primary-600 border-primary-200 hover:bg-primary-50
    `,
    success: `
      bg-white text-success-600 border-success-200 hover:bg-success-50
    `,
    warning: `
      bg-white text-warning-600 border-warning-200 hover:bg-warning-50
    `,
    error: `
      bg-white text-error-600 border-error-200 hover:bg-error-50
    `,
    outline: `
      bg-white text-gray-600 border-gray-200 hover:bg-gray-50
    `
  },
  disabled: `
    opacity-50 cursor-not-allowed hover:bg-white
  `,
  size: {
    lg: `
      text-base px-6 py-3
    `
  }
} as const 