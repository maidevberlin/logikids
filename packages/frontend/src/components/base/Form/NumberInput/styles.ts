export const styles = {
  container: `
    flex flex-col items-center gap-1
  `,
  controls: `
    flex items-stretch h-12
  `,
  button: {
    base: `
      flex items-center justify-center w-12 
      border border-gray-300 bg-white 
      hover:bg-gray-50 
      focus:outline-none focus:ring-2 
      focus:ring-primary-500 focus:z-10
    `,
    left: `
      rounded-l-lg
    `,
    right: `
      rounded-r-lg
    `,
    error: `
      border-red-300
    `
  },
  icon: `
    h-5 w-5 text-gray-600
  `,
  field: {
    base: `
      w-16 border-y border-x-0 p-2 
      text-center text-lg 
      focus:outline-none focus:ring-2 focus:z-10
      border-gray-300 focus:ring-primary-500
    `,
    error: `
      border-red-300 text-red-900 focus:ring-red-500
    `
  },
  errorMessage: `
    text-sm text-red-600
  `
} as const 