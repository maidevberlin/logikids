/**
 * Converts markdown content to TTS-friendly plain text.
 *
 * - LaTeX math ($...$, $$...$$) → speech via speech-rule-engine
 * - Tables → "Header: A, B. Row 1: C, D."
 * - SVG/images/code blocks → removed
 * - Bold/italic/links → text only
 *
 * Supports: en, de (extendable)
 */

import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import strip from 'strip-markdown'
import latexToSpeech from 'latex-to-speech'

export type TTSLocale = 'en' | 'de'

const tableLabels: Record<TTSLocale, { header: string; row: string }> = {
  en: { header: 'Header', row: 'Row' },
  de: { header: 'Kopfzeile', row: 'Zeile' },
}

/** Extract LaTeX expressions ($...$ and $$...$$) */
function extractLatex(content: string): Array<{ match: string; latex: string }> {
  const results: Array<{ match: string; latex: string }> = []

  // Display math: $$...$$
  for (const m of content.matchAll(/\$\$([\s\S]*?)\$\$/g)) {
    results.push({ match: m[0], latex: m[1].trim() })
  }

  // Inline math: $...$ (not $$)
  for (const m of content.matchAll(/(?<!\$)\$(?!\$)([^$]+)\$(?!\$)/g)) {
    results.push({ match: m[0], latex: m[1].trim() })
  }

  return results
}

/** Convert LaTeX to speech, remove on failure */
async function convertLatex(content: string, locale: TTSLocale): Promise<string> {
  const expressions = extractLatex(content)
  if (!expressions.length) return content

  let result = content
  try {
    const speeches = await latexToSpeech(
      expressions.map((e) => e.latex),
      { locale, domain: 'clearspeak' }
    )
    expressions.forEach((expr, i) => {
      result = result.replace(expr.match, speeches[i] || '')
    })
  } catch {
    // On failure, remove all LaTeX
    expressions.forEach((expr) => {
      result = result.replace(expr.match, '')
    })
  }
  return result
}

/** Convert markdown tables to speakable text */
function convertTables(content: string, locale: TTSLocale): string {
  const { header, row } = tableLabels[locale] || tableLabels.en
  const tableRegex = /(\|.+\|)\r?\n(\|[-:\s|]+\|)\r?\n((?:\|.+\|(?:\r?\n|$))+)/g

  return content.replace(tableRegex, (_, headerRow, _sep, bodyRows) => {
    const parseRow = (r: string) =>
      r
        .split('|')
        .map((c) => c.trim())
        .filter(Boolean)

    const lines = [`${header}: ${parseRow(headerRow).join(', ')}`]
    bodyRows
      .trim()
      .split('\n')
      .forEach((r: string, i: number) => {
        const cells = parseRow(r)
        if (cells.length) lines.push(`${row} ${i + 1}: ${cells.join(', ')}`)
      })

    return lines.join('. ') + '.'
  })
}

/** Remove visual-only content (SVG, images, code blocks, HTML) */
function removeVisualContent(content: string): string {
  return (
    content
      // Data URL images (SVG, PNG, etc.)
      .replace(/!\[[^\]]*\]\(data:image\/[^)]+\)/g, '')
      // SVG elements and TikZ figures
      .replace(/<figure[^>]*class="tikz-diagram"[^>]*>[\s\S]*?<\/figure>/gi, '')
      .replace(/<svg[\s\S]*?<\/svg>/gi, '')
      // Code blocks (mermaid, svg, html, generic)
      .replace(/```(?:mermaid|svg|html)?[\s\S]*?```/gi, '')
      // HTML tags (keep figcaption content)
      .replace(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/gi, '$1')
      .replace(/<[^>]+>/g, '')
  )
}

/** Clean up whitespace and stray markdown */
function cleanup(content: string): string {
  return content
    .replace(/\n{3,}/g, '\n\n') // multiple newlines
    .replace(/ {2,}/g, ' ') // multiple spaces
    .replace(/[*`#]+/g, '') // stray markdown chars
    .replace(/_+/g, ' ') // underscores to spaces
    .split('\n')
    .map((l) => l.trim())
    .join('\n')
    .trim()
}

/**
 * Convert markdown to plain text suitable for TTS.
 */
export async function markdownToSpeech(markdown: string, language = 'en'): Promise<string> {
  if (!markdown) return ''

  const locale: TTSLocale = language.startsWith('de') ? 'de' : 'en'

  // 1. LaTeX → speech
  let result = await convertLatex(markdown, locale)

  // 2. Remove visual content, convert tables
  result = removeVisualContent(result)
  result = convertTables(result, locale)

  // 3. Strip markdown formatting
  const file = await remark()
    .use(remarkGfm)
    .use(strip, { keep: ['text', 'inlineCode'] })
    .process(result)

  // 4. Final cleanup
  return cleanup(String(file))
}
