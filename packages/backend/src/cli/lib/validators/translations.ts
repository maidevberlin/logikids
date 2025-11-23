/**
 * Translation validator - checks concept translation completeness
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import type { CheckResult, CheckIssue } from '../types';

export function checkTranslations(conceptId: string, subject: string): CheckResult {
  // Auto-detect locales path (docker vs local)
  // In docker: /app/../frontend/public/locales (mounted volumes)
  // In development: ../../packages/frontend/public/locales (relative)
  const dockerLocalesPath = '/frontend/public/locales';
  const localLocalesPath = resolve(process.cwd(), '../../packages/frontend/public/locales');
  const localesPath = existsSync(dockerLocalesPath) ? dockerLocalesPath : localLocalesPath;
  const languages = ['de', 'en'];
  const issues: CheckIssue[] = [];

  for (const lang of languages) {
    const translationPath = resolve(localesPath, lang, 'subjects', `${subject}.json`);

    if (!existsSync(translationPath)) {
      issues.push({
        message: `${lang}: Translation file not found at ${translationPath}`,
        fix: `Create translation file for ${lang}`,
      });
      continue;
    }

    try {
      const translations = JSON.parse(readFileSync(translationPath, 'utf-8'));
      const conceptKey = `concepts.${conceptId}`;

      // Check if concept key exists
      if (!translations.concepts || !translations.concepts[conceptId]) {
        issues.push({
          message: `${lang}: Missing key "${conceptKey}"`,
          fix: `Add translation to ${translationPath}`,
          reference: 'review-concept SKILL.md lines 82-87',
        });
        continue;
      }

      // Check if name and description exist
      const concept = translations.concepts[conceptId];
      if (!concept.name) {
        issues.push({
          message: `${lang}: Missing "name" in "${conceptKey}"`,
          fix: `Add name field to ${translationPath}`,
        });
      }
      if (!concept.description) {
        issues.push({
          message: `${lang}: Missing "description" in "${conceptKey}"`,
          fix: `Add description field to ${translationPath}`,
        });
      }

    } catch (error) {
      issues.push({
        message: `${lang}: Error reading translation file: ${error}`,
        fix: `Check JSON syntax in ${translationPath}`,
      });
    }
  }

  return {
    status: issues.length > 0 ? 'fail' : 'pass',
    issues,
  };
}
