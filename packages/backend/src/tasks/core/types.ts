export interface Subject {
  name: string;
  description: string;
  concepts: Record<string, Concept>;
  taskTypes: Record<string, TaskType>;
  basePromptTemplate: string;
}

export interface Concept {
  name: string;
  description: string;
  promptTemplate: string;
  validateResponse?: (response: any) => boolean;
}

export interface TaskPromptBuilder {
  buildPrompt(params: {
    concept: string;
    age: number;
    difficulty: string;
    language: string;
  }): string;
}

export interface TaskGenerationParams {
  subject: string;
  concept: string;
  age: number;
  difficulty: string;
  language: string;
}

export interface TaskType {
  name: string;
  description: string;
  promptTemplate: string;
}