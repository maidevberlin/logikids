/**
 * Converts TikZ code blocks in markdown to SVG.
 * Uses node-tikzjax to render TikZ server-side.
 */

import tex2svg from 'node-tikzjax'

// Regex to match ```tikz code blocks
const TIKZ_CODE_BLOCK_REGEX = /```tikz\s*([\s\S]*?)```/gi

/**
 * Wraps TikZ code in the required document structure for node-tikzjax.
 *
 * node-tikzjax has a preloaded LaTeX format, so:
 * - Do NOT include \documentclass (it's already loaded)
 * - MUST include \begin{document} and \end{document}
 * - Can use \usepackage for additional packages
 */
function wrapTikzCode(tikzCode: string): string {
  const trimmed = tikzCode.trim()

  // If already has \begin{document}, check if it also has \documentclass
  if (trimmed.includes('\\begin{document}')) {
    // Remove \documentclass if present (node-tikzjax has preloaded format)
    return trimmed.replace(/\\documentclass(\[.*?\])?\{.*?\}\s*/g, '')
  }

  // Check if it's just tikzpicture content (no \begin{tikzpicture})
  const hasTikzpictureEnv = trimmed.includes('\\begin{tikzpicture}')

  const tikzContent = hasTikzpictureEnv
    ? trimmed
    : `\\begin{tikzpicture}\n${trimmed}\n\\end{tikzpicture}`

  // node-tikzjax already has tikz loaded, but we add common libraries
  return `\\usetikzlibrary{angles,quotes,calc,patterns,arrows.meta,shapes.geometric,intersections,through}
\\begin{document}
${tikzContent}
\\end{document}`
}

/**
 * Converts a single TikZ code block to SVG.
 * Returns the SVG string or an error placeholder.
 */
async function renderTikzToSvg(tikzCode: string): Promise<string> {
  try {
    const wrappedCode = wrapTikzCode(tikzCode)

    const svg = await tex2svg(wrappedCode, {
      showConsole: false,
      embedFontCss: true,
    })

    return svg
  } catch (error) {
    // Return an error placeholder that's visible to the user
    return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="100" viewBox="0 0 400 100">
      <rect width="100%" height="100%" fill="#fee2e2" rx="8"/>
      <text x="200" y="50" text-anchor="middle" fill="#dc2626" font-family="sans-serif" font-size="14">
        TikZ rendering error
      </text>
    </svg>`
  }
}

/**
 * Converts all ```tikz code blocks in a string to inline SVG.
 *
 * @param content - Markdown string potentially containing TikZ code blocks
 * @returns Content with TikZ blocks replaced by SVG
 */
export async function convertTikzToSvg(content: string): Promise<string> {
  if (!content || typeof content !== 'string') {
    return content
  }

  // Find all TikZ code blocks
  const matches = [...content.matchAll(TIKZ_CODE_BLOCK_REGEX)]

  if (matches.length === 0) {
    return content
  }

  // Process each match sequentially (node-tikzjax doesn't support parallel execution)
  let result = content
  for (const match of matches) {
    const fullMatch = match[0]
    const tikzCode = match[1]

    const svg = await renderTikzToSvg(tikzCode)

    // Wrap SVG in a centered container for consistent display
    const wrappedSvg = `<figure class="tikz-diagram">\n${svg}\n</figure>`

    result = result.replace(fullMatch, wrappedSvg)
  }

  return result
}

/**
 * Applies TikZ conversion to all string fields in a task response.
 * Handles: task, explanation, and option labels.
 *
 * Note: This should be called BEFORE convertTaskSvgs since the SVG conversion
 * will handle the resulting SVG elements.
 */
export async function convertTaskTikz<T extends Record<string, unknown>>(response: T): Promise<T> {
  const result: Record<string, unknown> = { ...response }

  // Convert 'task' field
  if (typeof result.task === 'string') {
    result.task = await convertTikzToSvg(result.task)
  }

  // Convert 'explanation' field
  if (typeof result.explanation === 'string') {
    result.explanation = await convertTikzToSvg(result.explanation)
  }

  // Convert options array (for single_choice, multi_select)
  if (Array.isArray(result.options)) {
    const convertedOptions = []
    for (const opt of result.options) {
      if (typeof opt === 'string') {
        convertedOptions.push(await convertTikzToSvg(opt))
      } else if (opt && typeof opt === 'object' && 'label' in opt) {
        const optObj = opt as Record<string, unknown>
        if (typeof optObj.label === 'string') {
          convertedOptions.push({
            ...optObj,
            label: await convertTikzToSvg(optObj.label),
          })
        } else {
          convertedOptions.push(opt)
        }
      } else {
        convertedOptions.push(opt)
      }
    }
    result.options = convertedOptions
  }

  return result as T
}
