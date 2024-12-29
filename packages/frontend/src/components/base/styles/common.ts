// Layout
export const container = {
  base: 'mx-auto px-4 sm:px-6 lg:px-8 w-full',
  maxWidth: {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full'
  }
}

// Typography
export const text = {
  size: {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  },
  weight: {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  },
  color: {
    default: 'text-gray-900',
    muted: 'text-gray-600',
    primary: 'text-primary-600',
    success: 'text-green-600',
    error: 'text-red-600',
    white: 'text-white'
  }
}

// Interactive Elements
export const interactive = {
  focus: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
  disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  transition: 'transition-all duration-200',
  hover: {
    scale: 'hover:scale-105',
    opacity: 'hover:opacity-90'
  }
}

// Backgrounds
export const background = {
  gradient: {
    blue: 'bg-gradient-to-b from-blue-50 to-blue-100',
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600',
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    error: 'bg-gradient-to-r from-red-500 to-red-600'
  },
  solid: {
    white: 'bg-white',
    gray: 'bg-gray-50',
    blue: 'bg-blue-50',
    primary: 'bg-primary-500',
    success: 'bg-green-500',
    error: 'bg-red-500'
  },
  hover: {
    primary: 'hover:bg-primary-600',
    success: 'hover:bg-green-600',
    error: 'hover:bg-red-600'
  }
}

// Borders
export const border = {
  base: 'border rounded-md',
  rounded: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  },
  color: {
    default: 'border-gray-300',
    primary: 'border-primary-500',
    success: 'border-green-500',
    error: 'border-red-500'
  },
  hover: {
    primary: 'hover:border-primary-300',
    success: 'hover:border-green-300',
    error: 'hover:border-red-300'
  }
}

// Spacing
export const spacing = {
  padding: {
    none: '',
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  },
  margin: {
    none: '',
    xs: 'm-1',
    sm: 'm-2',
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8'
  },
  gap: {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }
}

// Flex
export const flex = {
  center: 'flex items-center justify-center',
  between: 'flex items-center justify-between',
  start: 'flex items-center justify-start',
  end: 'flex items-center justify-end',
  col: 'flex flex-col',
  wrap: 'flex flex-wrap',
  gap: {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }
}

// Grid
export const grid = {
  cols: {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  },
  gap: {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }
}

// Shadows
export const shadow = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl'
}

// Position
export const position = {
  relative: 'relative',
  absolute: 'absolute',
  fixed: 'fixed',
  inset: {
    0: 'inset-0',
    y0: 'inset-y-0',
    x0: 'inset-x-0'
  }
}

// Size
export const size = {
  full: 'w-full h-full',
  screen: 'w-screen h-screen',
  width: {
    auto: 'w-auto',
    full: 'w-full',
    screen: 'w-screen'
  },
  height: {
    auto: 'h-auto',
    full: 'h-full',
    screen: 'h-screen'
  }
} 