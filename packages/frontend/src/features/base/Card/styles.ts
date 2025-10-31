export const styles = {
  base: `
    rounded-xl border p-6
  `,

  // Card Styles
  elevated: `
    shadow-lg
  `,
  shadow: `
    shadow-xs
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
    info: 'bg-white border-info-200 hover:border-info-300',
    // Colorful variants
    softBlue: 'bg-blue-50 border-2 border-blue-300 hover:border-blue-400 hover:bg-blue-100',
    softOrange: 'bg-orange-50 border-2 border-orange-300 hover:border-orange-400 hover:bg-orange-100',
    softPurple: 'bg-purple-50 border-2 border-purple-300 hover:border-purple-400 hover:bg-purple-100',
    softTeal: 'bg-teal-50 border-2 border-teal-300 hover:border-teal-400 hover:bg-teal-100',
    // Selected variants with inverted colors
    selectedBlue: 'bg-blue-500 border-2 border-blue-600 text-white hover:bg-blue-600',
    selectedOrange: 'bg-orange-500 border-2 border-orange-600 text-white hover:bg-orange-600',
    selectedPurple: 'bg-purple-500 border-2 border-purple-600 text-white hover:bg-purple-600',
    selectedTeal: 'bg-teal-500 border-2 border-teal-600 text-white hover:bg-teal-600'
  }
} as const 