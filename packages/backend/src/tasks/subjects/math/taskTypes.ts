import { TaskType } from "../../core/types";

export const taskTypes: Record<string, TaskType> = {
    multiple_choice: {
        name: 'multiple_choice',
        description: 'A multiple choice task with 4 options',
        promptTemplate: `
        Your task is to create a multiple choice problem that focuses on:
            - Clear, engaging story context
            - Step-by-step problem-solving approach
            - Relatable real-world scenarios
        `
    }
}