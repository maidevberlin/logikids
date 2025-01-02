export const styles = {
  container: {
    base: `
      relative
    `,
    fullWidth: `
      w-full
    `
  },
  label: `
    block text-sm font-medium text-gray-700 mb-1
  `,
  button: {
    base: `
      relative w-full cursor-pointer rounded-lg bg-white text-left
      focus:outline-none focus:ring-2 focus:ring-offset-2
      flex items-center justify-between
    `,
    sizes: {
      sm: 'px-2 py-1.5 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg'
    },
    variants: {
      default: `
        border-gray-300 hover:border-gray-400 
        focus:border-primary-500 focus:ring-primary-500
      `,
      error: `
        border-error-300 hover:border-error-400 
        text-error-900 focus:border-error-500 
        focus:ring-error-500
      `
    }
  },
  value: `
    flex-1 min-w-0
  `,
  icon: `
    h-5 w-5 text-gray-400 ml-2 flex-shrink-0
  `,
  options: {
    container: `
      absolute z-10 mt-1 max-h-60 w-full overflow-auto 
      rounded-lg bg-white py-1 shadow-lg 
      ring-1 ring-black ring-opacity-5 focus:outline-none
    `,
    option: {
      base: `
        relative cursor-pointer select-none py-2 pl-3 pr-9
      `,
      active: `
        bg-primary-50
      `,
      container: `
        flex items-center justify-between
      `,
      content: `
        flex-1 min-w-0
      `,
      text: `
        block truncate
      `,
      selected: `
        font-medium
      `,
      notSelected: `
        font-normal
      `,
      variants: {
        default: 'text-gray-900',
        primary: 'text-primary-600',
        secondary: 'text-secondary-600',
        success: 'text-success-600',
        error: 'text-error-600',
        warning: 'text-warning-600',
        info: 'text-info-600'
      }
    }
  },
  errorMessage: `
    mt-1 text-sm text-error-600
  `,
  transition: {
    leave: `
      transition ease-in duration-100
    `,
    leaveFrom: `
      opacity-100
    `,
    leaveTo: `
      opacity-0
    `
  }
} as const 