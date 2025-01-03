export const styles = {
  base: `
    relative z-20
    space-y-4
  `,
  list: `
    space-y-3
  `,
  item: {
    base: `
      rounded-lg p-4
      transition-all duration-300
    `,
    content: `
      flex gap-3 items-start
    `,
    icon: `
      flex-shrink-0 w-5 h-5
      relative top-0.5
    `,
    text: `
      prose prose-sm max-w-none
    `
  },
  variants: {
    1: {
      base: `bg-info-50/90 border border-info-200`,
      icon: `text-info-400`,
      text: `text-info-800`
    },
    2: {
      base: `bg-warning-50/90 border border-warning-200`,
      icon: `text-warning-400`,
      text: `text-warning-800`
    },
    3: {
      base: `bg-error-50/90 border border-error-200`,
      icon: `text-error-400`,
      text: `text-error-800`
    }
  }
} as const 