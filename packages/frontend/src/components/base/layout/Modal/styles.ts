export const styles = {
  overlay: `
    fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-modal
  `,
  container: `
    fixed inset-0 flex items-center justify-center p-4 z-modal
  `,
  content: `
    bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto
  `,
  header: `
    p-6 border-b border-gray-200
  `,
  body: `
    p-6
  `,
  footer: `
    p-6 border-t border-gray-200 flex justify-end gap-4
  `
} as const 