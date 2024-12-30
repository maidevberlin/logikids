import { Subject, TaskType } from '../types/task';

interface TaskTypeConfig {
  displayName: string;
  translationKey: string;
}

type TaskTypesBySubject = {
  [K in Subject]: {
    [T in TaskType]?: TaskTypeConfig;
  };
};

export const taskTypes: TaskTypesBySubject = {
  math: {
    random: { displayName: 'Random', translationKey: 'random' },
    arithmetic: { displayName: 'Arithmetic Operations', translationKey: 'arithmetic' },
    number_patterns: { displayName: 'Number Patterns', translationKey: 'number_patterns' },
    geometry: { displayName: 'Geometry', translationKey: 'geometry' },
    fractions: { displayName: 'Fractions and Decimals', translationKey: 'fractions' },
    measurement: { displayName: 'Measurement', translationKey: 'measurement' },
    word_problems: { displayName: 'Word Problems', translationKey: 'word_problems' },
    data_analysis: { displayName: 'Data Analysis', translationKey: 'data_analysis' },
    probability: { displayName: 'Probability', translationKey: 'probability' },
    algebra: { displayName: 'Algebra', translationKey: 'algebra' },
    mental_math: { displayName: 'Mental Math', translationKey: 'mental_math' }
  },
  logic: {
    random: { displayName: 'Random', translationKey: 'random' },
    sequential: { displayName: 'Sequential Reasoning', translationKey: 'sequential' },
    categorical: { displayName: 'Categorical Logic', translationKey: 'categorical' },
    conditional: { displayName: 'Conditional Logic', translationKey: 'conditional' },
    truth_tables: { displayName: 'Truth Tables', translationKey: 'truth_tables' },
    pattern_recognition: { displayName: 'Pattern Recognition', translationKey: 'pattern_recognition' },
    deductive: { displayName: 'Deductive Reasoning', translationKey: 'deductive' },
    analogical: { displayName: 'Analogical Reasoning', translationKey: 'analogical' },
    spatial: { displayName: 'Spatial Logic', translationKey: 'spatial' },
    set_theory: { displayName: 'Set Theory', translationKey: 'set_theory' },
    probability: { displayName: 'Probability Logic', translationKey: 'probability' }
  }
};

export function getTaskTypes(subject: Subject): { value: TaskType; translationKey: string }[] {
  return Object.entries(taskTypes[subject]).map(([value, config]) => ({
    value: value as TaskType,
    translationKey: `taskType.${config.translationKey}`
  }));
} 