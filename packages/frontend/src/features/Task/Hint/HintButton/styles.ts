export const styles = {
  base: `
    flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-all duration-200
  `,
  icon: `
    w-5 h-5
  `,
  glow: `
    animate-pulse text-primary-500
  `,
  shake: `
    animate-shake
  `,
  disabled: `
    opacity-50 cursor-not-allowed hover:text-gray-700
  `
} as const 