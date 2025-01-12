export const styles = {
  container: `
    flex flex-col items-center justify-start min-h-screen
    pt-16 p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100
  `,
  content: `
    flex flex-col items-center
  `,
  logo: {
    wrapper: `
      w-48 h-48 mb-8
      transform transition-all duration-500
      hover:scale-105 hover:rotate-3
      animate-float
    `,
    image: `
      w-full h-full object-contain
    `
  },
  text: {
    wrapper: `
      text-center space-y-4 mb-8
    `,
    title: `
      text-5xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent
    `,
    subtitle: `
      text-gray-600 text-xl max-w-lg mx-auto leading-relaxed
    `
  },
  buttons: {
    wrapper: `
      flex flex-col space-y-4 w-full max-w-sm
    `,
    group: `
      flex space-x-4
    `,
    primary: `
      w-full inline-flex items-center justify-center px-8 py-4
      text-lg font-semibold rounded-xl
      text-white bg-gradient-to-r from-blue-600 to-blue-700
      transform transition-all duration-200
      hover:translate-y-[-2px] hover:shadow-lg
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    `,
    secondary: `
      flex-1 inline-flex items-center justify-center px-6 py-3
      text-sm font-medium rounded-xl
      text-blue-700 bg-white/90 backdrop-blur-sm border border-blue-200
      transform transition-all duration-200
      hover:bg-blue-50 hover:border-blue-300
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    `
  }
} as const
