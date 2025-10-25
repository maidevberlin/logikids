import { JSONSchema } from "../../common/ai/base";

export interface YesNoSolution {
  answer: boolean;
  explanation: string;
}

export interface YesNoResponse {
  type: 'yes_no';
  title: string;
  task: string;
  solution: YesNoSolution;
}

export const yesNoSchema: JSONSchema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      const: 'yes_no'
    },
    title: {
      type: 'string',
      minLength: 1
    },
    task: {
      type: 'string',
      minLength: 1
    },
    solution: {
      type: 'object',
      properties: {
        answer: {
          type: 'boolean'
        },
        explanation: {
          type: 'string',
          minLength: 1
        }
      },
      required: ['answer', 'explanation'],
      additionalProperties: false
    }
  },
  required: ['type', 'title', 'task', 'solution'],
  additionalProperties: false
};
