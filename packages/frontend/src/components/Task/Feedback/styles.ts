export const styles = {
  base: `
    p-4 rounded-lg border
    relative z-30
  `,
  content: `
    flex gap-3 items-start
  `,
  icon: {
    base: `
      h-5 w-5 flex-shrink-0
      relative top-0.5
    `,
    success: `
      text-success-400
    `,
    error: `
      text-error-400
    `,
    warning: `
      text-warning-400
    `,
    info: `
      text-info-400
    `
  },
  message: `
    font-medium
  `,
  variant: {
    success: `
      bg-success-50 text-success-800 border-success-200
    `,
    error: `
      bg-error-50 text-error-800 border-error-200
    `,
    warning: `
      bg-warning-50 text-warning-800 border-warning-200
    `,
    info: `
      bg-info-50 text-info-800 border-info-200
    `
  }
} as const 