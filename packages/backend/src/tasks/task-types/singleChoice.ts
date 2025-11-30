import { JSONSchema } from "../../common/ai/base";

export interface SingleChoiceOption {
  text: string;
  isCorrect: boolean;
}

export interface SingleChoiceResponse {
  type: 'single_choice';
  title: string;
  task: string;
  options: SingleChoiceOption[];
  explanation: string;
}

export const singleChoiceSchema: JSONSchema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      const: 'single_choice'
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
          text: {
            type: 'string',
            minLength: 1
          },
          isCorrect: {
            type: 'boolean'
          }
        },
        required: ['text', 'isCorrect'],
        additionalProperties: false
      },
      minItems: 4,
      maxItems: 4
    },
    explanation: {
      type: 'string',
      minLength: 1
    }
  },
  required: ['type', 'title', 'task', 'options', 'explanation'],
  additionalProperties: false
};
