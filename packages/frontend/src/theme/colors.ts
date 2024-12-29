export const colors = {
  primary: {
    50: 'var(--color-primary-50)',
    100: 'var(--color-primary-100)',
    200: 'var(--color-primary-200)',
    300: 'var(--color-primary-300)',
    400: 'var(--color-primary-400)',
    500: 'var(--color-primary-500)',
    600: 'var(--color-primary-600)',
    700: 'var(--color-primary-700)',
    800: 'var(--color-primary-800)',
    900: 'var(--color-primary-900)',
  },
  gray: {
    50: 'var(--color-gray-50)',
    100: 'var(--color-gray-100)',
    200: 'var(--color-gray-200)',
    300: 'var(--color-gray-300)',
    400: 'var(--color-gray-400)',
    500: 'var(--color-gray-500)',
    600: 'var(--color-gray-600)',
    700: 'var(--color-gray-700)',
    800: 'var(--color-gray-800)',
    900: 'var(--color-gray-900)',
  },
  success: {
    50: 'var(--color-success-50)',
    100: 'var(--color-success-100)',
    500: 'var(--color-success-500)',
    600: 'var(--color-success-600)',
    700: 'var(--color-success-700)',
    800: 'var(--color-success-800)',
  },
  error: {
    50: 'var(--color-error-50)',
    100: 'var(--color-error-100)',
    500: 'var(--color-error-500)',
    600: 'var(--color-error-600)',
    700: 'var(--color-error-700)',
    800: 'var(--color-error-800)',
  },
  warning: {
    50: 'var(--color-warning-50)',
    100: 'var(--color-warning-100)',
    500: 'var(--color-warning-500)',
    600: 'var(--color-warning-600)',
    700: 'var(--color-warning-700)',
    800: 'var(--color-warning-800)',
  }
} as const

export const colorScheme = {
  background: {
    primary: colors.primary[50],
    success: colors.success[50],
    error: colors.error[50],
    warning: colors.warning[50],
    gray: colors.gray[50],
    white: 'white',
  },
  text: {
    primary: colors.primary[600],
    success: colors.success[600],
    error: colors.error[600],
    warning: colors.warning[600],
    default: colors.gray[900],
    muted: colors.gray[600],
    white: 'white',
  },
  border: {
    primary: colors.primary[500],
    success: colors.success[500],
    error: colors.error[500],
    warning: colors.warning[500],
    default: colors.gray[300],
  },
  gradient: {
    primary: `bg-gradient-to-r from-[${colors.primary[500]}] to-[${colors.primary[600]}]`,
    success: `bg-gradient-to-r from-[${colors.success[500]}] to-[${colors.success[600]}]`,
    error: `bg-gradient-to-r from-[${colors.error[500]}] to-[${colors.error[600]}]`,
    warning: `bg-gradient-to-r from-[${colors.warning[500]}] to-[${colors.warning[600]}]`,
  }
} as const 