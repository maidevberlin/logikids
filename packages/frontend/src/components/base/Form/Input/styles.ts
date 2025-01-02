export const styles = {
  field: {
    base: `
      w-full
      px-3 py-2
      border border-gray-300
      rounded-md
      text-gray-900
      placeholder:text-gray-500
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    `,
    error: `
      border-error-300
      text-error-900
      focus:ring-error-500
    `
  }
} as const 