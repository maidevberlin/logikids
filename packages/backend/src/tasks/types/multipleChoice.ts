import { JSONSchema } from "../../common/ai/base";

export interface MultipleChoiceOption {
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface MultipleChoiceResponse {
  type: 'multiple_choice';
  title: string;
  task: string;
  options: MultipleChoiceOption[];
}

export const multipleChoiceSchema: JSONSchema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      const: 'multiple_choice'
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
          },
          explanation: {
            type: 'string',
            minLength: 1
          }
        },
        required: ['text', 'isCorrect'],
        additionalProperties: false
      },
      minItems: 4,
      maxItems: 4
    }
  },
  required: ['type', 'title', 'task', 'options'],
  additionalProperties: false
};
