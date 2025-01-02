export const styles = {
  base: `
    inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
  `,
  icon: `
    w-4 h-4
  `,
  variant: {
    primary: `
      bg-primary-600 text-white hover:bg-primary-700
    `,
    outline: `
      bg-white text-gray-700 border border-gray-200 hover:bg-gray-50
    `
  },
  disabled: `
    opacity-50 cursor-not-allowed
  `
} as const 