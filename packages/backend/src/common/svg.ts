/**
 * Converts inline SVG elements in markdown to data URL images.
 * This ensures reliable SVG rendering across all markdown renderers.
 */

/**
 * Converts all <svg>...</svg> elements in a string to base64 data URL images.
 * Handles SVGs wrapped in <figure> tags by preserving the figure/figcaption structure.
 *
 * @param content - Markdown string potentially containing inline SVG
 * @returns Content with SVGs converted to data URL images
 */
export function convertSvgToDataUrl(content: string): string {
  if (!content || typeof content !== 'string') {
    return content
  }

  // Match <figure> containing SVG - preserve figcaption
  const figurePattern = /<figure[^>]*>([\s\S]*?)<svg([\s\S]*?)<\/svg>([\s\S]*?)<\/figure>/gi

  let result = content.replace(figurePattern, (_match, before, svgContent, after) => {
    const fullSvg = `<svg${svgContent}</svg>`
    const base64 = Buffer.from(fullSvg).toString('base64')
    const dataUrl = `data:image/svg+xml;base64,${base64}`

    // Extract figcaption if present
    const figcaptionMatch = after.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i)
    const caption = figcaptionMatch ? figcaptionMatch[1].trim() : ''

    // Return markdown image with optional caption as alt text
    return `![${caption}](${dataUrl})`
  })

  // Match standalone SVG elements (not inside figure)
  const svgPattern = /<svg[\s\S]*?<\/svg>/gi

  result = result.replace(svgPattern, (svg) => {
    const base64 = Buffer.from(svg).toString('base64')
    return `![diagram](data:image/svg+xml;base64,${base64})`
  })

  return result
}

/**
 * Applies SVG conversion to all string fields in a task response.
 * Handles: task, explanation, and option labels.
 */
export function convertTaskSvgs<T extends Record<string, unknown>>(response: T): T {
  const result: Record<string, unknown> = { ...response }

  // Convert 'task' field
  if (typeof result.task === 'string') {
    result.task = convertSvgToDataUrl(result.task)
  }

  // Convert 'explanation' field
  if (typeof result.explanation === 'string') {
    result.explanation = convertSvgToDataUrl(result.explanation)
  }

  // Convert options array (for single_choice, multi_select)
  if (Array.isArray(result.options)) {
    result.options = result.options.map((opt: unknown) => {
      if (typeof opt === 'string') {
        return convertSvgToDataUrl(opt)
      }
      if (opt && typeof opt === 'object' && 'label' in opt) {
        const optObj = opt as Record<string, unknown>
        if (typeof optObj.label === 'string') {
          return { ...optObj, label: convertSvgToDataUrl(optObj.label) }
        }
      }
      return opt
    })
  }

  return result as T
}
