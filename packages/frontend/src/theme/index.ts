import { TIMING } from '../constants/timing'

// Type definitions
type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type Variant = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'

interface ThemeConfig {
  colors: {
    [key in Variant]: {
      [shade in ColorShade]?: string
    }
  }
  spacing: {
    [key in Size]: string
  }
  borderRadius: {
    [key in Size | 'none' | 'full']: string
  }
  animation: {
    duration: typeof TIMING.TRANSITION_DURATION
    timing: {
      [key: string]: string
    }
    keyframes: {
      [key: string]: string
    }
  }
  typography: {
    fontSize: {
      [key in Size]: string
    }
    fontWeight: {
      normal: string
      medium: string
      semibold: string
      bold: string
    }
  }
  layout: {
    container: {
      padding: string
      maxWidth: {
        [key in Size | 'full']: string
      }
    }
    zIndex: {
      modal: string
      dropdown: string
      tooltip: string
      header: string
    }
  }
}

// Theme configuration
export const theme: ThemeConfig = {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    success: {
      500: '#22c55e',
      600: '#16a34a',
    },
    error: {
      500: '#ef4444',
      600: '#dc2626',
    },
    warning: {
      500: '#f59e0b',
      600: '#d97706',
    },
    info: {
      500: '#3b82f6',
      600: '#2563eb',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    none: '0',
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  animation: {
    duration: TIMING.TRANSITION_DURATION,
    timing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    keyframes: {
      spin: 'spin 1s linear infinite',
      ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      bounce: 'bounce 1s infinite',
    },
  },
  typography: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  layout: {
    container: {
      padding: '1rem',
      maxWidth: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        full: '100%',
      },
    },
    zIndex: {
      modal: '50',
      dropdown: '40',
      tooltip: '30',
      header: '20',
    },
  },
} 