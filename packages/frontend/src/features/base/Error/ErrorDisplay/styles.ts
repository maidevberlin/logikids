export const styles = {
  content: `
    text-center space-y-6
  `,
  icon: {
    base: `
      h-16 w-16 mx-auto
    `,
    variants: {
      error: 'text-error-400',
      warning: 'text-warning-400',
      fatal: 'text-error-600'
    }
  },
  message: `
    space-y-2
  `,
  details: `
    font-mono break-all
  `,
  actions: `
    flex flex-col gap-4
  `,
  button: {
    content: `
      inline-flex items-center gap-2
    `,
    icon: `
      h-6 w-6
    `
  },
  standalone: {
    base: `
      min-h-screen flex items-center justify-center p-4 bg-linear-to-b
    `,
    gradients: {
      error: 'from-error-50 to-error-100',
      warning: 'from-warning-50 to-warning-100',
      fatal: 'from-error-100 to-error-200'
    }
  },
  card: `
    p-8 max-w-md mx-auto
  `
} as const 