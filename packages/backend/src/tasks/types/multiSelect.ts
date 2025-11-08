import { JSONSchema } from "../../common/ai/base";

export interface MultiSelectOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface MultiSelectResponse {
  type: 'multi_select';
  title: string;
  task: string;
  options: MultiSelectOption[];
  expectedCount: number;
  explanation: string;
}

export const multiSelectSchema: JSONSchema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      const: 'multi_select'
    },
    title: {
      type: 'string',
      minLength: 1
    },
    task: {
      type: 'string',
      minLength: 1
    },
    options: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'number'
          },
          text: {
            type: 'string',
            minLength: 1
          },
          isCorrect: {
            type: 'boolean'
          }
        },
        required: ['id', 'text', 'isCorrect'],
        additionalProperties: false
      },
      minItems: 5,
      maxItems: 7
    },
    expectedCount: {
      type: 'number',
      minimum: 2,
      maximum: 4
    },
    explanation: {
      type: 'string',
      minLength: 1
    }
  },
  required: ['type', 'title', 'task', 'options', 'expectedCount', 'explanation'],
  additionalProperties: false
};
