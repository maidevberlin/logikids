export const styles = {
  container: `
    relative
    min-h-screen w-full
  `,
  content: `
    relative z-10
    pt-16
  `,
  subjects: {
    math: `
      bg-gradient-to-br from-blue-50 to-purple-50
    `,
    logic: `
      bg-gradient-to-br from-orange-50 to-yellow-50
    `
  },
  pattern: `
    absolute inset-0
    opacity-100 bg-cover
  `
} as const
