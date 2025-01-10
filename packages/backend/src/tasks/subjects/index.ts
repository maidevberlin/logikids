import { SubjectsMap } from './types';
import { mathSubject } from './math/subject';
import { logicSubject } from './logic/subject';
import { musicSubject } from './music/subject';
import { physicsSubject } from './physics/subject';

export const subjects: SubjectsMap = {
  math: mathSubject,
  logic: logicSubject,
  music: musicSubject,
  physics: physicsSubject
} as const;

export * from './types';
export * from './math';
export * from './logic';
export * from './music';
export * from './physics';