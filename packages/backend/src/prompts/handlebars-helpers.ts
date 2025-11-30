import Handlebars from 'handlebars'

/**
 * Register custom Handlebars helpers for template conditionals
 */
export function registerHandlebarsHelpers(): void {
  // Comparison helpers
  Handlebars.registerHelper('eq', (a, b) => a === b)
  Handlebars.registerHelper('ne', (a, b) => a !== b)
  Handlebars.registerHelper('lt', (a, b) => a < b)
  Handlebars.registerHelper('lte', (a, b) => a <= b)
  Handlebars.registerHelper('gt', (a, b) => a > b)
  Handlebars.registerHelper('gte', (a, b) => a >= b)

  // Logical helpers
  Handlebars.registerHelper('and', (...args) => {
    // Last arg is Handlebars options object, exclude it
    const values = args.slice(0, -1)
    return values.every(Boolean)
  })

  Handlebars.registerHelper('or', (...args) => {
    // Last arg is Handlebars options object, exclude it
    const values = args.slice(0, -1)
    return values.some(Boolean)
  })

  Handlebars.registerHelper('not', (value) => !value)
}
