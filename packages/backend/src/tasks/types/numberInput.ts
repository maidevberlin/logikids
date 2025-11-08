import { JSONSchema } from "../../common/ai/base";

export interface NumberInputSolution {
  value: number;
  unit?: string;
  tolerance: number;
  acceptedUnits?: string[];
  explanation: string;
}

export interface NumberInputResponse {
  type: 'number_input';
  title: string;
  task: string;
  solution: NumberInputSolution;
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
    solution: {
      type: 'object',
      properties: {
        value: {
          type: 'number'
        },
        unit: {
          type: 'string',
          minLength: 1
        },
        tolerance: {
          type: 'number',
          minimum: 0
        },
        acceptedUnits: {
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
      required: ['value', 'tolerance', 'explanation'],
      additionalProperties: false
    }
  },
  required: ['type', 'title', 'task', 'solution'],
  additionalProperties: false
};
