import { JSONSchema } from '../../common/ai/base'

export interface OrderingItem {
  id: string
  content: string
}

export interface OrderingResponse {
  type: 'ordering'
  title: string
  task: string
  items: OrderingItem[]
  correctOrder: string[]
  explanation: string
}

export const orderingSchema: JSONSchema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      const: 'ordering',
    },
    title: {
      type: 'string',
      minLength: 1,
    },
    task: {
      type: 'string',
      minLength: 1,
    },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            minLength: 1,
          },
          content: {
            type: 'string',
            minLength: 1,
          },
        },
        required: ['id', 'content'],
        additionalProperties: false,
      },
      minItems: 3,
      maxItems: 5,
    },
    correctOrder: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 1,
      },
      minItems: 3,
      maxItems: 5,
    },
    explanation: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['type', 'title', 'task', 'items', 'correctOrder', 'explanation'],
  additionalProperties: false,
}
