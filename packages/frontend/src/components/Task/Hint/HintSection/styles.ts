export const styles = {
  base: `
    space-y-4
  `,
  list: `
    space-y-2
  `,
  item: {
    base: `
      p-4 rounded-lg border
    `,
    content: `
      flex gap-4
    `,
    icon: `
      w-8 h-8 flex-shrink-0
    `,
    text: `
      flex-grow prose
    `
  },
  variants: {
    1: {
      base: `
        bg-info-50 border-info-200
      `,
      icon: `
        text-info-500
      `,
      text: `
        text-info-800
      `
    },
    2: {
      base: `
        bg-warning-50 border-warning-200
      `,
      icon: `
        text-warning-500
      `,
      text: `
        text-warning-800
      `
    },
    3: {
      base: `
        bg-error-50 border-error-200
      `,
      icon: `
        text-error-500
      `,
      text: `
        text-error-800
      `
    }
  }
} as const 