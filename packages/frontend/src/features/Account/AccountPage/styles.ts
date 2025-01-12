export const styles = {
  card: `
    bg-white
    rounded-xl
    shadow-md
    py-8 sm:py-12
    px-6 sm:px-8
    border-2 border-primary-200
    bg-gradient-to-b from-white to-primary-50/30
  `,
  title: `
    mb-10
    text-primary-600
    flex items-center gap-4
    text-3xl
  `,
  icon: `
    w-16 h-16
    text-primary-500
    drop-shadow-sm
  `,
  content: `
    space-y-8
    relative
  `,
  container: `
    pt-8 sm:pt-16
    px-4 sm:px-6
    bg-gradient-to-b from-primary-50/50 to-transparent
    min-h-[calc(100vh-4rem)]
  `
} as const 