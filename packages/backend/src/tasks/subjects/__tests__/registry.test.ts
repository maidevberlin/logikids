import { describe, test, expect, beforeAll } from 'bun:test';
import { SubjectRegistry } from '../registry';

describe('SubjectRegistry', () => {
  let registry: SubjectRegistry;

  beforeAll(async () => {
    registry = new SubjectRegistry();
    await registry.initialize();
  });

  test('initializes with all subjects from /prompts/subjects/', async () => {
    const subjects = registry.getAll();

    // Should have at least math and logic
    expect(subjects.length).toBeGreaterThanOrEqual(2);
    expect(subjects.some(s => s.id === 'math')).toBe(true);
    expect(subjects.some(s => s.id === 'logic')).toBe(true);
  });

  test('returns subject by id', () => {
    const math = registry.get('math');

    expect(math).toBeDefined();
    expect(math?.id).toBe('math');
    expect(math?.name).toBe('Math');
    expect(math?.concepts.size).toBeGreaterThan(0);
  });

  test('returns all subjects', () => {
    const subjects = registry.getAll();

    expect(subjects.length).toBeGreaterThan(0);
    subjects.forEach(subject => {
      expect(subject.id).toBeDefined();
      expect(subject.name).toBeDefined();
      expect(subject.concepts).toBeDefined();
    });
  });

  test('returns random concept for subject', () => {
    const concept = registry.getRandomConcept('math');

    expect(concept).toBeDefined();
    expect(concept?.id).toBeDefined();
    expect(concept?.promptTemplate).toBeDefined();
  });

  test('returns undefined for non-existent subject', () => {
    const subject = registry.get('nonexistent');
    expect(subject).toBeUndefined();
  });
});
