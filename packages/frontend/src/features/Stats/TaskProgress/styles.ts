export const styles = {
  base: `
    bg-white p-6 rounded-lg border border-gray-200
  `,
  title: `
    text-lg text-gray-800 font-semibold mb-4
  `,
  content: `
    w-full space-y-2
  `,
  header: `
    flex justify-between items-center
  `,
  level: `
    text-lg font-medium
  `,
  count: `
    text-lg text-gray-600
  `,
  bar: {
    base: `
      h-4 w-full bg-gray-100 rounded-full overflow-hidden
    `,
    fill: `
      h-full transition-all duration-500 ease-out rounded-full
    `
  },
  scale: `
    flex justify-between text-sm text-gray-500
  `
} as const 