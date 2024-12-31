export interface Concept {
  displayName: string;
  description: string;
  promptTemplate: string;
  validateResponse?: (response: any) => boolean;
}

export interface Subject {
  id: string;
  displayName: string;
  description: string;
  concepts: Record<string, Concept>;
  basePromptTemplate: string;
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