import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { ConceptsService } from './service';
import type { ConceptsInput, ConceptsResponse, ConceptFilters } from './types';

@injectable()
export class ConceptsController {
  constructor(@inject(ConceptsService) private conceptsService: ConceptsService) {}

  async getConcepts(input: ConceptsInput): Promise<ConceptsResponse> {
    const filters: ConceptFilters = {
      grade: input.grade,
      difficulty: input.difficulty,
      source: input.source,
    };

    const concepts = await this.conceptsService.getConcepts(input.subject, filters);

    return {
      concepts,
      total: concepts.length,
    };
  }
}
