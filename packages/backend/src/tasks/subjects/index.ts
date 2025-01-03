import { mathSubject } from './math/base';
import { logicSubject } from './logic/base';
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