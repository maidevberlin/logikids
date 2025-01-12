export const styles = {
  base: `
    relative inline-block text-left
  `,
  button: `
    text-gray-500 hover:text-primary-600 flex items-center space-x-1 transition-all duration-200
  `,
  menu: `
    absolute left-0 mt-1 bg-white rounded-md shadow-lg py-1 w-48 z-20
  `,
  item: {
    base: `
      block w-full text-left px-4 py-1 text-gray-700
    `,
    active: `
      bg-primary-50 text-primary-600
    `
  }
} as const 