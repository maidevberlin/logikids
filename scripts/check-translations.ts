#!/usr/bin/env bun

/**
 * Script to check for missing translations between content files and i18n files
 *
 * Usage: bun scripts/check-translations.ts
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

interface ConceptMetadata {
  id: string;
  name: string;
  grade: number;
  subject: string;
  namespace: string;
}

interface TranslationFile {
  path: string;
  namespace: string;
  concepts: Set<string>;
}

// Subjects that are split by grade
const SPLIT_SUBJECTS = ['math', 'german', 'english'];

function getGradeRange(grade: number): 'elementary' | 'middle' | 'high' {
  if (grade >= 1 && grade <= 4) return 'elementary';
  if (grade >= 5 && grade <= 8) return 'middle';
  return 'high';
}

function getNamespace(subject: string, grade: number): string {
  if (!SPLIT_SUBJECTS.includes(subject)) {
    return subject;
  }
  const range = getGradeRange(grade);
  return `${subject}-${range}`;
}

async function scanConceptFiles(contentDir: string): Promise<ConceptMetadata[]> {
  const concepts: ConceptMetadata[] = [];
  const subjectsDir = join(contentDir, 'subjects');

  try {
    const subjects = await readdir(subjectsDir, { withFileTypes: true });

    for (const subject of subjects) {
      if (!subject.isDirectory()) continue;

      const subjectId = subject.name;
      const subjectPath = join(subjectsDir, subjectId);

      // Check both official and custom folders
      for (const folder of ['official', 'custom']) {
        const folderPath = join(subjectPath, folder);

        try {
          const files = await readdir(folderPath);

          for (const file of files) {
            if (!file.endsWith('.md')) continue;

            const filePath = join(folderPath, file);
            const content = await readFile(filePath, 'utf-8');
            const { data } = matter(content);

            if (data.id && data.grade) {
              concepts.push({
                id: data.id,
                name: data.name || data.id,
                grade: data.grade,
                subject: subjectId,
                namespace: getNamespace(subjectId, data.grade),
              });
            }
          }
        } catch (err) {
          // Folder doesn't exist, skip
        }
      }
    }
  } catch (err) {
    console.error('Error scanning concept files:', err);
  }

  return concepts;
}

async function scanTranslationFiles(localesDir: string, lang: string): Promise<Map<string, TranslationFile>> {
  const translations = new Map<string, TranslationFile>();
  const subjectsDir = join(localesDir, lang, 'subjects');

  try {
    const files = await readdir(subjectsDir);

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const filePath = join(subjectsDir, file);
      const namespace = file.replace('.json', '');
      const content = await readFile(filePath, 'utf-8');
      const data = JSON.parse(content);

      const concepts = new Set<string>();
      if (data.concepts) {
        for (const conceptId of Object.keys(data.concepts)) {
          concepts.add(conceptId);
        }
      }

      translations.set(namespace, {
        path: filePath,
        namespace,
        concepts,
      });
    }
  } catch (err) {
    console.error(`Error scanning translation files for ${lang}:`, err);
  }

  return translations;
}

async function main() {
  const projectRoot = join(import.meta.dir, '..');
  const contentDir = join(projectRoot, 'packages/content');
  const localesDir = join(projectRoot, 'packages/frontend/public/locales');

  console.log('🔍 Scanning concept files...');
  const concepts = await scanConceptFiles(contentDir);
  console.log(`Found ${concepts.length} concepts\n`);

  console.log('🔍 Scanning translation files...');
  const enTranslations = await scanTranslationFiles(localesDir, 'en');
  const deTranslations = await scanTranslationFiles(localesDir, 'de');
  console.log(`Found ${enTranslations.size} English translation files`);
  console.log(`Found ${deTranslations.size} German translation files\n`);

  // Check for missing translations
  const missingEn: ConceptMetadata[] = [];
  const missingDe: ConceptMetadata[] = [];

  for (const concept of concepts) {
    const enFile = enTranslations.get(concept.namespace);
    const deFile = deTranslations.get(concept.namespace);

    if (!enFile || !enFile.concepts.has(concept.id)) {
      missingEn.push(concept);
    }

    if (!deFile || !deFile.concepts.has(concept.id)) {
      missingDe.push(concept);
    }
  }

  // Report results
  console.log('📊 Results:');
  console.log('='.repeat(80));

  if (missingEn.length === 0 && missingDe.length === 0) {
    console.log('✅ All translations are complete!');
  } else {
    if (missingEn.length > 0) {
      console.log(`\n❌ Missing English translations (${missingEn.length}):`);
      console.log('-'.repeat(80));

      const byNamespace = new Map<string, ConceptMetadata[]>();
      for (const concept of missingEn) {
        if (!byNamespace.has(concept.namespace)) {
          byNamespace.set(concept.namespace, []);
        }
        byNamespace.get(concept.namespace)!.push(concept);
      }

      for (const [namespace, concepts] of byNamespace) {
        console.log(`\n📄 subjects/${namespace}.json:`);
        for (const concept of concepts) {
          console.log(`  - ${concept.id} (${concept.subject}, grade ${concept.grade})`);
        }
      }
    }

    if (missingDe.length > 0) {
      console.log(`\n❌ Missing German translations (${missingDe.length}):`);
      console.log('-'.repeat(80));

      const byNamespace = new Map<string, ConceptMetadata[]>();
      for (const concept of missingDe) {
        if (!byNamespace.has(concept.namespace)) {
          byNamespace.set(concept.namespace, []);
        }
        byNamespace.get(concept.namespace)!.push(concept);
      }

      for (const [namespace, concepts] of byNamespace) {
        console.log(`\n📄 subjects/${namespace}.json:`);
        for (const concept of concepts) {
          console.log(`  - ${concept.id} (${concept.subject}, grade ${concept.grade})`);
        }
      }
    }

    console.log('\n');
    process.exit(1);
  }
}

main().catch(console.error);
