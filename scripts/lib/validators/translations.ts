/**
 * Translation validator - checks concept translation completeness
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import type { CheckResult, CheckIssue } from '../types'
import { SUPPORTED_LANGUAGES } from '@logikids/content/schema'

function getLocalesPath(): string {
  // Root scripts run from repo root
  return join(import.meta.dir, '../../../packages/frontend/public/locales')
}

export function checkTranslations(conceptId: string, subject: string): CheckResult {
  const localesPath = getLocalesPath()
  const issues: CheckIssue[] = []

  for (const lang of SUPPORTED_LANGUAGES) {
    const translationPath = join(localesPath, lang, 'subjects', `${subject}.json`)

    if (!existsSync(translationPath)) {
      issues.push({
        message: `${lang}: Translation file not found at ${translationPath}`,
        fix: `Create translation file for ${lang}`,
      })
      continue
    }

    try {
      const translations = JSON.parse(readFileSync(translationPath, 'utf-8'))

      if (!translations.concepts || !translations.concepts[conceptId]) {
        issues.push({
          message: `${lang}: Missing key "concepts.${conceptId}"`,
          fix: `Add translation to ${translationPath}`,
        })
        continue
      }

      const concept = translations.concepts[conceptId]
      if (!concept.name) {
        issues.push({
          message: `${lang}: Missing "name" in "concepts.${conceptId}"`,
          fix: `Add name field to ${translationPath}`,
        })
      }
      if (!concept.description) {
        issues.push({
          message: `${lang}: Missing "description" in "concepts.${conceptId}"`,
          fix: `Add description field to ${translationPath}`,
        })
      }
    } catch (error) {
      issues.push({
        message: `${lang}: Error reading translation file: ${error}`,
        fix: `Check JSON syntax in ${translationPath}`,
      })
    }
  }

  return {
    status: issues.length > 0 ? 'fail' : 'pass',
    issues,
  }
}
