export const styles = {
  base: 'flex flex-col gap-4',
  grid: 'grid grid-cols-2 gap-4',
  option: {
    base: 'w-full h-full',
    content: 'flex items-center justify-center p-4 text-lg font-medium'
  },
  feedback: 'flex flex-col gap-2',
  action: {
    base: 'opacity-0 translate-y-2',
    ready: 'opacity-100 translate-y-0 transition-all duration-200'
  },
  loading: {
    option: 'h-16 bg-gray-200 rounded animate-pulse',
    button: 'h-12 w-48 mx-auto bg-gray-200 rounded animate-pulse'
  }
} 