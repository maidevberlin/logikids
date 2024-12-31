import { mathSubject } from './math/config';
import { logicSubject } from './logic/config';
import { MathPromptBuilder } from './math/prompt';
import { LogicPromptBuilder } from './logic/prompt';
import { Subject } from '../core/types';

export const test:string = 'test'

export const subjects: Record<string, Subject> = {
  math: mathSubject,
  logic: logicSubject,
};

export const promptBuilders = {
  math: MathPromptBuilder,
  logic: LogicPromptBuilder,
}; 