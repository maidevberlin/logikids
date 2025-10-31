export const styles = {
  // Base Button
  base: `
    rounded-lg font-medium transition-all duration-200
    inline-flex items-center justify-center
    focus:outline-hidden focus:ring-2 focus:ring-offset-2
  `,

  // Button Sizes
  sizes: {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5'
  },

  // Icon Button Sizes
  iconSizes: {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  },

  // Icon Element Sizes
  iconElementSizes: {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  },

  // Button Variants
  variants: {
    default: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500',
    success: 'bg-success-600 hover:bg-success-700 text-white focus:ring-success-500',
    error: 'bg-error-600 hover:bg-error-700 text-white focus:ring-error-500',
    warning: 'bg-warning-600 hover:bg-warning-700 text-white focus:ring-warning-500',
    info: 'bg-info-600 hover:bg-info-700 text-white focus:ring-info-500',
    outline: 'border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
  },

  // Button States
  states: {
    disabled: 'opacity-50 cursor-not-allowed',
    enabled: 'hover:shadow-md active:scale-95',
    fullWidth: 'w-full'
  }
} as const 