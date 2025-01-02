export const styles = {
  container: `
    flex flex-col items-center justify-center min-h-screen
    p-4 bg-gradient-to-b from-blue-50 to-blue-100
  `,
  card: `
    max-w-screen-md mx-auto
    bg-white p-8 rounded-xl shadow-xl w-full
    transform transition-all duration-300 hover:scale-102
  `,
  logo: `
    w-64 h-40 mb-4
    transform transition-all duration-500
    hover:scale-105
  `,
  button: {
    primary: `
      inline-flex items-center justify-center px-6 py-3
      text-base font-medium rounded-md
      text-white bg-primary-600
      transform transition-all duration-200
      hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
    `,
    secondary: `
      flex-1 inline-flex items-center justify-center px-4 py-2
      text-sm font-medium rounded-md
      text-primary-600 bg-white border-2 border-primary-600
      transform transition-all duration-200
      hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
    `
  }
} as const
