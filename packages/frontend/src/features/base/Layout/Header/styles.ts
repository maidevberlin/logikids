export const styles = {
  base: 'fixed top-0 left-0 right-0 z-50 bg-white shadow-md',
  content: 'container mx-auto px-4 h-16 flex items-center justify-between',
  left: 'flex items-center flex-1',
  right: 'flex items-center gap-2',
  button: 'inline-flex items-center justify-center p-2 text-gray-500 hover:text-primary-600 hover:scale-105 transition-all duration-200 [&>svg]:w-6 [&>svg]:h-6'
} as const 