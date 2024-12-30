import { Subject, TaskType } from '../types';

interface TaskTypeConfig {
  displayName: string;
}

type TaskTypesBySubject = {
  [K in Subject]: {
    [T in TaskType]?: TaskTypeConfig;
  };
};

export const taskTypes: TaskTypesBySubject = {
  math: {
    random: { displayName: 'Random' },
    arithmetic: { displayName: 'Arithmetic Operations' },
    number_patterns: { displayName: 'Number Patterns' },
    geometry: { displayName: 'Geometry' },
    fractions: { displayName: 'Fractions and Decimals' },
    measurement: { displayName: 'Measurement' },
    word_problems: { displayName: 'Word Problems' },
    data_analysis: { displayName: 'Data Analysis' },
    probability: { displayName: 'Probability' },
    algebra: { displayName: 'Algebra' },
    mental_math: { displayName: 'Mental Math' }
  },
  logic: {
    random: { displayName: 'Random' },
    sequential: { displayName: 'Sequential Reasoning' },
    categorical: { displayName: 'Categorical Logic' },
    conditional: { displayName: 'Conditional Logic' },
    truth_tables: { displayName: 'Truth Tables' },
    pattern_recognition: { displayName: 'Pattern Recognition' },
    deductive: { displayName: 'Deductive Reasoning' },
    analogical: { displayName: 'Analogical Reasoning' },
    spatial: { displayName: 'Spatial Logic' },
    set_theory: { displayName: 'Set Theory' },
    probability: { displayName: 'Probability Logic' }
  }
};

export function getTaskTypeDisplayName(subject: Subject, taskType: TaskType): string {
  return taskTypes[subject][taskType]?.displayName || taskType;
}

export function getAvailableTaskTypes(subject: Subject): string {
  const types = Object.values(taskTypes[subject])
    .filter(config => config.displayName !== 'Random')
    .map(config => config.displayName);
  return `You can choose any of these concepts: ${types.join(', ')}.`;
}

export function getSpecificTaskType(subject: Subject, taskType: TaskType): string {
  const displayName = getTaskTypeDisplayName(subject, taskType);
  return `You must use this concept: ${displayName}`;
} 