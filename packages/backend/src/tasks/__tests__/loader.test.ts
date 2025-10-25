import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { PromptLoader } from '../loader';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('PromptLoader', () => {
  const testPromptsDir = path.join(process.cwd(), 'test-prompts');
  let loader: PromptLoader;

  beforeAll(async () => {
    // Create test prompts directory
    await fs.mkdir(path.join(testPromptsDir, 'subjects', 'test'), { recursive: true });

    // Create test base.md
    await fs.writeFile(
      path.join(testPromptsDir, 'subjects', 'test', 'base.md'),
      `---
id: test
name: Test Subject
description: A test subject for unit testing
---

This is the base prompt template with {{placeholders}}.`
    );

    // Create test concept.md
    await fs.writeFile(
      path.join(testPromptsDir, 'subjects', 'test', 'testConcept.md'),
      `---
id: testConcept
name: Test Concept
description: A test concept
---

This is the concept prompt template.`
    );

    loader = new PromptLoader(testPromptsDir);
  });

  afterAll(async () => {
    // Cleanup
    await fs.rm(testPromptsDir, { recursive: true, force: true });
    loader.destroy();
  });

  test('loads subject base.md with valid frontmatter', async () => {
    const subject = await loader.loadSubject('test');

    expect(subject.id).toBe('test');
    expect(subject.name).toBe('Test Subject');
    expect(subject.description).toBe('A test subject for unit testing');
    expect(subject.basePromptTemplate).toContain('{{placeholders}}');
  });

  test('loads all concept files for subject', async () => {
    const subject = await loader.loadSubject('test');

    expect(subject.concepts.size).toBe(1);
    expect(subject.concepts.has('testConcept')).toBe(true);

    const concept = subject.concepts.get('testConcept');
    expect(concept?.id).toBe('testConcept');
    expect(concept?.name).toBe('Test Concept');
    expect(concept?.promptTemplate).toContain('concept prompt template');
  });

  test('throws error on missing required fields in frontmatter', async () => {
    // Create invalid file
    await fs.mkdir(path.join(testPromptsDir, 'subjects', 'invalid'), { recursive: true });
    await fs.writeFile(
      path.join(testPromptsDir, 'subjects', 'invalid', 'base.md'),
      `---
name: Invalid
---

Missing id field`
    );

    await expect(loader.loadSubject('invalid')).rejects.toThrow();
  });

  test('caches loaded prompts', async () => {
    const subject1 = await loader.loadSubject('test');
    const subject2 = await loader.loadSubject('test');

    // Should return same instance from cache
    expect(subject1).toBe(subject2);
  });
});
