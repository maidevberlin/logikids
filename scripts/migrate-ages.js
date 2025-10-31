#!/usr/bin/env node

/**
 * Migration script to convert ages arrays to [min, max] format
 *
 * Converts:
 *   ages: [8, 9, 10, 11, 12, 13, 14, 15, 16]
 * To:
 *   ages: [8, 16]
 */

const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

const SUBJECTS_DIR = path.join(__dirname, '..', 'packages', 'content', 'subjects');

async function findMarkdownFiles(dir) {
  const files = [];

  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  await walk(dir);
  return files;
}

async function migrateAgesInFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const parsed = matter(content);

  // Skip if no ages field
  if (!parsed.data.ages) {
    return { path: filePath, changed: false, reason: 'no ages field' };
  }

  const ages = parsed.data.ages;

  // Skip if not an array
  if (!Array.isArray(ages)) {
    return { path: filePath, changed: false, reason: 'ages is not an array' };
  }

  // Skip if already in [min, max] format
  if (ages.length === 2) {
    // Verify it's properly ordered
    if (ages[0] <= ages[1]) {
      return { path: filePath, changed: false, reason: 'already [min, max]' };
    }
    // Fix reversed order
    console.log(`⚠️  Fixing reversed ages in ${path.relative(SUBJECTS_DIR, filePath)}: [${ages[0]}, ${ages[1]}] → [${ages[1]}, ${ages[0]}]`);
    parsed.data.ages = [ages[1], ages[0]];
  } else {
    // Convert to [min, max]
    const min = Math.min(...ages);
    const max = Math.max(...ages);
    const oldFormat = JSON.stringify(ages);
    parsed.data.ages = [min, max];
    console.log(`✓ Converting ${path.relative(SUBJECTS_DIR, filePath)}: ${oldFormat} → [${min}, ${max}]`);
  }

  // Write back
  const newContent = matter.stringify(parsed.content, parsed.data);
  await fs.writeFile(filePath, newContent, 'utf8');

  return { path: filePath, changed: true, ages: parsed.data.ages };
}

async function main() {
  console.log('🔍 Finding all markdown files in subjects...\n');

  const files = await findMarkdownFiles(SUBJECTS_DIR);
  console.log(`Found ${files.length} markdown files\n`);

  const results = {
    total: files.length,
    changed: 0,
    skipped: 0,
    errors: 0
  };

  for (const file of files) {
    try {
      const result = await migrateAgesInFile(file);
      if (result.changed) {
        results.changed++;
      } else {
        results.skipped++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
      results.errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Migration Summary:');
  console.log('='.repeat(60));
  console.log(`Total files:    ${results.total}`);
  console.log(`Changed:        ${results.changed}`);
  console.log(`Skipped:        ${results.skipped}`);
  console.log(`Errors:         ${results.errors}`);
  console.log('='.repeat(60));

  if (results.changed > 0) {
    console.log('\n✅ Migration complete! Review changes and commit.');
  } else {
    console.log('\n✅ No changes needed.');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
