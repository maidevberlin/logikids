import { describe, test, expect, beforeAll } from 'bun:test';
import { TaskTypeRegistry } from '../registry';

describe('TaskTypeRegistry', () => {
  let registry: TaskTypeRegistry;

  beforeAll(async () => {
    registry = new TaskTypeRegistry();
    await registry.initialize();
  });

  test('initializes with all task types from /prompts/task-types/', async () => {
    const taskTypes = registry.getAll();

    // Should have multipleChoice and yesNo
    expect(taskTypes.length).toBeGreaterThanOrEqual(2);
    expect(taskTypes.some(t => t.id === 'multipleChoice')).toBe(true);
    expect(taskTypes.some(t => t.id === 'yesNo')).toBe(true);
  });

  test('returns task type by id', () => {
    const multipleChoice = registry.get('multipleChoice');

    expect(multipleChoice).toBeDefined();
    expect(multipleChoice?.id).toBe('multipleChoice');
    expect(multipleChoice?.name).toBe('Multiple Choice');
    expect(multipleChoice?.promptTemplate).toBeDefined();
  });

  test('returns all task types', () => {
    const taskTypes = registry.getAll();

    expect(taskTypes.length).toBeGreaterThan(0);
    taskTypes.forEach(taskType => {
      expect(taskType.id).toBeDefined();
      expect(taskType.name).toBeDefined();
      expect(taskType.promptTemplate).toBeDefined();
    });
  });

  test('returns undefined for non-existent task type', () => {
    const taskType = registry.get('nonexistent');
    expect(taskType).toBeUndefined();
  });
});
