import { SubjectsMap } from './types';
import { mathSubject } from './math/subject';
import { logicSubject } from './logic/subject';

export const subjects: SubjectsMap = {
  math: mathSubject,
  logic: logicSubject
} as const;

export * from './types';
export * from './math';
export * from './logic';