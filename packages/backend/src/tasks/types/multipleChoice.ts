import {BaseTaskType, TaskResponse} from './base';
import {JSONSchema} from "../../common/ai/base.ts";

export interface MultipleChoiceOption {
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface MultipleChoiceResponse extends TaskResponse {
  type: 'multiple_choice';
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

export class MultipleChoiceType extends BaseTaskType<MultipleChoiceResponse> {
  readonly id = 'multiple_choice';
  readonly name = 'Multiple Choice';
  readonly description = 'A task with exactly 4 options where one is correct';
  readonly jsonSchema = multipleChoiceSchema;
  readonly promptTemplate = `
## INSTRUCTIONS FOR TASK CREATION

### CREATE TASK TITLE AND DESCRIPTION
   - Write a clear, focused, but creative title
   - Write a complete problem statement using age-appropriate language, concepts, and scenarios
   - Include ALL necessary information for solving the problem
   - Use HTML formatting to improve readability and structure/highlight important information

### CREATE THE SOLUTION OPTION
   - Think through the correct answer logically before creating options
   - Write the correct answer with isCorrect=true and provide a detailed explanation
   - Ensure the explanation clearly shows WHY this answer is correct

### VALIDATE THE CORRECTNESS
   - Ensure the selected correct option aligns with the reasoning and explanation
   - If the selected correct answer is wrong, **correct it immediately and update the response**

### CREATE THE INCORRECT OPTIONS AND SHUFFLE
   - Create EXACTLY THREE plausible but incorrect answers with isCorrect=false
   - Do NOT provide explanations for incorrect options
   - Make incorrect options believable to challenge the student
   - Shuffle all four options randomly (don't put correct answer in same position every time)

### ADDITIONAL REQUIREMENTS
   - The task must have EXACTLY 4 options total (1 correct, 3 incorrect)
   - Only the correct option should have an explanation field
   - Ensure no conflicting statements exist between the correct option and its explanation
   - The final response should always be internally consistent
  `;
}

// Export singleton instance
export const multipleChoiceType = new MultipleChoiceType(); 
