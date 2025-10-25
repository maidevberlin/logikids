import {JSONSchema} from '../common/ai/base.ts';

export const hintSchema: JSONSchema = {
  type: 'object',
  properties: {
    hint: {
      type: 'string',
      minLength: 1
    }
  },
  required: ['hint'],
  additionalProperties: false
};
