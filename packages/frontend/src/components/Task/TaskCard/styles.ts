export const styles = {
  base: `
    space-y-4 opacity-95 pb-16
  `,
  content: `
    space-y-8
  `,
  header: `
    flex justify-between items-center
  `,
  task: `
    prose prose-blue max-w-none
  `,
  menu: {
    base: `
      relative
    `,
    button: `
      text-gray-500 hover:text-primary-600 flex items-center space-x-1 text-sm transition-all duration-200
    `,
    label: `
      inline-flex rounded-md px-2 py-1 text-sm font-medium
    `,
    icon: `
      h-3 w-3
    `,
    items: `
      absolute right-0 mt-1 bg-white rounded-md shadow-lg py-1 w-32 z-20
    `,
    item: {
      base: `
        block w-full text-left px-4 py-1 text-sm flex items-center space-x-2
      `,
      active: `
        bg-gray-50
      `,
      dot: `
        w-2 h-2 rounded-full
      `
    }
  },
  loading: {
    base: `
      space-y-8
    `,
    title: `
      h-8 bg-gray-200 rounded w-3/4 animate-pulse
    `,
    difficulty: `
      h-8 w-24 bg-gray-200 rounded animate-pulse
    `,
    content: `
      space-y-4
    `,
    line: {
      base: `
        h-4 bg-gray-200 rounded animate-pulse
      `,
      full: `
        w-full
      `,
      threeFourths: `
        w-3/4
      `,
      fiveSixths: `
        w-5/6
      `
    }
  },
  footer: `
    flex justify-end
  `
} as const 