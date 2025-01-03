export const styles = {
  base: 'relative',
  button: 'flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
  menu: 'absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg',
  item: {
    base: 'block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900',
    active: 'bg-gray-100 text-gray-900'
  }
} as const; 