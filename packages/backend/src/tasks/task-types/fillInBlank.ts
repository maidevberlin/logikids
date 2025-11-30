import { JSONSchema } from '../../common/ai/base'

export interface FillInBlankItem {
  id: number
  acceptedAnswers: string[]
  caseSensitive: boolean
}

export interface FillInBlankResponse {
  type: 'fill_in_blank'
  title: string
  task: string
  fillableText: string
  blanks: FillInBlankItem[]
  explanation: string
}

export const fillInBlankSchema: JSONSchema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      const: 'fill_in_blank',
    },
    title: {
      type: 'string',
      minLength: 1,
    },
    task: {
      type: 'string',
      minLength: 1,
    },
    fillableText: {
      type: 'string',
      minLength: 1,
    },
    blanks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            minimum: 0,
          },
          acceptedAnswers: {
            type: 'array',
            items: {
              type: 'string',
              minLength: 1,
            },
            minItems: 1,
          },
          caseSensitive: {
            type: 'boolean',
          },
        },
        required: ['id', 'acceptedAnswers', 'caseSensitive'],
        additionalProperties: false,
      },
      minItems: 1,
      maxItems: 3,
    },
    explanation: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['type', 'title', 'task', 'fillableText', 'blanks', 'explanation'],
  additionalProperties: false,
}
