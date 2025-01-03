export const styles = {
  base: `
    rounded-xl border p-6
  `,

  // Card Styles
  elevated: `
    shadow-lg
  `,
  shadow: `
    shadow-sm
  `,
  interactive: `
    cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]
  `,
  disabled: `
    opacity-50 cursor-not-allowed
  `,

  // Card Variants
  variants: {
    default: 'bg-white border-gray-200 hover:border-gray-300',
    primary: 'bg-white border-2 border-primary-400 hover:border-primary-500',
    secondary: 'bg-white border-secondary-200 hover:border-secondary-300',
    success: 'bg-white border-success-200 hover:border-success-300',
    error: 'bg-white border-error-200 hover:border-error-300',
    warning: 'bg-white border-warning-200 hover:border-warning-300',
    info: 'bg-white border-info-200 hover:border-info-300'
  }
} as const 