// Color variants
export type ColorVariant = 
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'default'

// Color shades
export type ColorShade = 
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900

// Color utilities
export function getColorClass(variant: ColorVariant, shade: ColorShade = 500): string {
  const colorMap: Record<ColorVariant, string> = {
    primary: 'blue',
    secondary: 'gray',
    success: 'green',
    warning: 'yellow',
    error: 'red',
    info: 'indigo',
    default: 'gray'
  }

  return `${colorMap[variant]}-${shade}`
}

export function getBgClass(variant: ColorVariant, shade: ColorShade = 500): string {
  return `bg-${getColorClass(variant, shade)}`
}

export function getTextClass(variant: ColorVariant, shade: ColorShade = 500): string {
  return `text-${getColorClass(variant, shade)}`
}

export function getBorderClass(variant: ColorVariant, shade: ColorShade = 500): string {
  return `border-${getColorClass(variant, shade)}`
}

// Hover utilities
export function getHoverBgClass(variant: ColorVariant, shade: ColorShade = 600): string {
  return `hover:${getBgClass(variant, shade)}`
}

export function getHoverTextClass(variant: ColorVariant, shade: ColorShade = 600): string {
  return `hover:${getTextClass(variant, shade)}`
}

export function getHoverBorderClass(variant: ColorVariant, shade: ColorShade = 600): string {
  return `hover:${getBorderClass(variant, shade)}`
}

// Focus utilities
export function getFocusRingClass(variant: ColorVariant, opacity: number = 20): string {
  return `focus:ring-${getColorClass(variant, 500)} focus:ring-opacity-${opacity}`
}

// Gradient utilities
export function getGradientClass(variant: ColorVariant, fromShade: ColorShade = 500, toShade: ColorShade = 600): string {
  const color = getColorClass(variant).split('-')[0]
  return `bg-gradient-to-r from-${color}-${fromShade} to-${color}-${toShade}`
}

// Opacity utilities
export function getOpacityClass(opacity: number): string {
  return `opacity-${opacity}`
}

// Transition utilities
export function getTransitionClass(properties: string[] = ['all']): string {
  return `transition-${properties.join(' transition-')}`
}

interface ColorClassesOptions {
  variant: ColorVariant
  text?: boolean
  bg?: boolean
  border?: boolean
  hover?: boolean
  focus?: boolean
}

export function getColorClasses({
  variant,
  text = false,
  bg = false,
  border = false,
  hover = false,
  focus = false
}: ColorClassesOptions): string {
  const classes: string[] = []

  if (text) classes.push(getTextClass(variant))
  if (bg) classes.push(getBgClass(variant))
  if (border) classes.push(getBorderClass(variant))
  if (hover) {
    if (text) classes.push(getHoverTextClass(variant))
    if (bg) classes.push(getHoverBgClass(variant))
    if (border) classes.push(getHoverBorderClass(variant))
  }
  if (focus) classes.push(getFocusRingClass(variant))

  return classes.join(' ')
} 