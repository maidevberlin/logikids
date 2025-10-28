#!/usr/bin/env bun
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import matter from 'gray-matter';

interface CurriculumConcept {
  name: string;
  focus: string;
  learning_objectives: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  prerequisites?: string[];
  example_tasks?: string[];
  real_world_context?: string;
}

interface CurriculumGrade {
  grade: number;
  ages: number[];
  concepts: CurriculumConcept[];
}

interface Curriculum {
  subject: string;
  country: string;
  source: string;
  scope: string;
  grades: CurriculumGrade[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateConceptId(grade: number, name: string): string {
  const slug = slugify(name);
  return `grade${grade}-${slug}`;
}

async function convertCurriculum(yamlPath: string) {
  console.log(`Reading curriculum from ${yamlPath}...`);

  const yamlContent = fs.readFileSync(yamlPath, 'utf-8');
  const curriculum = yaml.load(yamlContent) as Curriculum;

  const subjectSlug = slugify(curriculum.subject);
  const outputDir = path.join('curriculums', subjectSlug);

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let totalConcepts = 0;

  // Process each grade
  for (const gradeData of curriculum.grades) {
    // Skip grades without concepts (e.g., English not taught in grades 1-2)
    if (!gradeData.concepts || gradeData.concepts.length === 0) {
      console.log(`  Skipping grade ${gradeData.grade} (no concepts defined)`);
      continue;
    }

    for (const concept of gradeData.concepts) {
      const id = generateConceptId(gradeData.grade, concept.name);
      const filename = `${id}.md`;
      const filepath = path.join(outputDir, filename);

      // Build frontmatter
      const frontmatter: any = {
        id,
        name: concept.name,
        description: concept.focus, // Use focus as description for curriculum concepts
        grade: gradeData.grade,
        ages: gradeData.ages,
        focus: concept.focus,
        difficulty: concept.difficulty,
        learning_objectives: concept.learning_objectives,
      };

      if (concept.prerequisites) {
        frontmatter.prerequisites = concept.prerequisites.map(p => slugify(p));
      }

      if (concept.example_tasks) {
        frontmatter.example_tasks = concept.example_tasks;
      }

      if (concept.real_world_context) {
        frontmatter.real_world_context = concept.real_world_context;
      }

      // Generate markdown with frontmatter
      const content = matter.stringify('', frontmatter);

      // Write file
      fs.writeFileSync(filepath, content, 'utf-8');
      totalConcepts++;
    }
  }

  console.log(`✓ Generated ${totalConcepts} concept files in ${outputDir}`);
  console.log(`  Source: ${curriculum.source}`);
  console.log(`  Scope: ${curriculum.scope}`);
}

// Main execution
const yamlPath = process.argv[2];

if (!yamlPath) {
  console.error('Usage: bun run scripts/convert-curriculum.ts <path-to-yaml>');
  process.exit(1);
}

if (!fs.existsSync(yamlPath)) {
  console.error(`Error: File not found: ${yamlPath}`);
  process.exit(1);
}

convertCurriculum(yamlPath).catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
