import {BaseTaskType, TaskResponse} from './base';
import {JSONSchema} from "../../common/ai/base.ts";

export interface YesNoSolution {
  answer: boolean;
  explanation: string;
}

export interface YesNoResponse extends TaskResponse {
  type: 'yes_no';
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

export class YesNoType extends BaseTaskType<YesNoResponse> {
  readonly id = 'yes_no';
  readonly name = 'Yes/No';
  readonly description = 'A task that can be answered with yes or no';
  readonly jsonSchema = yesNoSchema;
  readonly promptTemplate = `
## TASK CREATION GUIDELINES

### CREATE TASK TITLE AND DESCRIPTION
   - Write a clear, focused, creative title
   - Create a question that can ONLY be answered with Yes or No
   - Include ALL necessary information for solving
   - Use simple, age-appropriate language
   - Format in HTML for readability
   - Make the question unambiguous with a clear correct answer

### CREATE THE SOLUTION
   - Set answer to true (for Yes) or false (for No)
   - Provide a detailed explanation of WHY this answer is correct
   - Include key reasoning points
   - Reference specific details from the question
   - Make the explanation educational and clear

### ADDITIONAL REQUIREMENTS
   - The question must have exactly ONE correct answer (true or false)
   - The explanation should be thorough enough that a student understands the reasoning
   - Ensure the task is age-appropriate ({{age}} years old) and matches difficulty level ({{difficulty}})
`;
}

// Export singleton instance
export const yesNoType = new YesNoType(); 
