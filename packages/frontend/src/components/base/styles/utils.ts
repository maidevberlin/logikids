/**
 * Combines class names, filtering out falsy values and trimming whitespace
 */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
}

/**
 * Creates a variant class string from a styles object and variant key
 */
export function createVariant<T extends Record<string, string>>(
  styles: T,
  variant: keyof T,
  defaultVariant?: keyof T
): string {
  return styles[variant] || styles[defaultVariant as keyof T] || ''
} 