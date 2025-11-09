import { JSONSchema } from "../../common/ai/base";

export interface YesNoResponse {
  type: 'yes_no';
  title: string;
  task: string;
  answer: boolean;
  explanation: string;
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
    answer: {
      type: 'boolean'
    },
    explanation: {
      type: 'string',
      minLength: 1
    }
  },
  required: ['type', 'title', 'task', 'answer', 'explanation'],
  additionalProperties: false
};
