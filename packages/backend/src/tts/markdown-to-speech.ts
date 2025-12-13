/**
 * Converts markdown content to TTS-friendly plain text.
 *
 * - LaTeX math ($...$, $$...$$) → speech via speech-rule-engine
 * - Tables → "Header: A, B. Row 1: C, D."
 * - SVG/images/code blocks → removed
 * - Bold/italic/links → text only
 *
 * Translations: packages/backend/locales/{lang}/tts.json
 */

import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import strip from 'strip-markdown'
import latexToSpeech from 'latex-to-speech'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Language, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '/content/schema'

interface TTSTranslations {
  table: {
    header: string
    row: string
  }
}

// Load TTS translations from backend locales
function loadTTSTranslations(): Record<Language, TTSTranslations> {
  const translations = {} as Record<Language, TTSTranslations>
  const localesPath = join(import.meta.dir, '../../locales')

  for (const lang of SUPPORTED_LANGUAGES) {
    try {
      const filePath = join(localesPath, lang, 'tts.json')
      translations[lang] = JSON.parse(readFileSync(filePath, 'utf-8'))
    } catch {
      // Fallback to English if translation file missing
      console.warn(`TTS translations missing for ${lang}, using defaults`)
      translations[lang] = { table: { header: 'Header', row: 'Row' } }
    }
  }

  return translations
}

const ttsTranslations = loadTTSTranslations()

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
async function convertLatex(content: string, locale: Language): Promise<string> {
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
function convertTables(content: string, locale: Language): string {
  const labels = ttsTranslations[locale] || ttsTranslations[DEFAULT_LANGUAGE]
  const { header, row } = labels.table
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

  const locale: Language = language.startsWith('de') ? 'de' : DEFAULT_LANGUAGE

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
