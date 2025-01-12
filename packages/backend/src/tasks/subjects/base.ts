import { z } from 'zod';

export interface Concept {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  basePromptTemplate: string;
  concepts: Record<string, Concept>;
  getRandomConcept(): Concept;
  getConcept(id: string): Concept | undefined;
}

export abstract class BaseSubject implements Subject {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly basePromptTemplate: string;
  abstract readonly concepts: Record<string, Concept>;

  public getRandomConcept(): Concept {
    const conceptIds = Object.keys(this.concepts);
    const randomId = conceptIds[Math.floor(Math.random() * conceptIds.length)];
    return this.concepts[randomId];
  }

  public getConcept(id: string): Concept | undefined {
    return this.concepts[id];
  }
} 