import { JSONSchema } from "../../common/ai/base";

export interface NumberInputResponse {
  type: 'number_input';
  title: string;
  task: string;
  answer: number;           // The correct numeric value (required)
  unit?: string;           // Correct unit (when unitOptions present) OR display unit
  unitOptions?: string[];  // Optional: if present, student must choose
  explanation: string;
}

export const numberInputSchema: JSONSchema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      const: 'number_input'
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
      type: 'number'
    },
    unit: {
      type: 'string',
      minLength: 1
    },
    unitOptions: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 1
      },
      minItems: 1
    },
    explanation: {
      type: 'string',
      minLength: 1
    }
  },
  required: ['type', 'title', 'task', 'answer', 'explanation'],
  additionalProperties: false
};
