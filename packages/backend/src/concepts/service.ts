import 'reflect-metadata'
import { injectable, inject } from 'tsyringe'
import { Concept as ConceptEntity } from '../prompts/schemas'
import { SubjectRegistry } from '../subjects/registry'
import { notFound } from '../common/errors'
import type { ConceptFilters, Concept } from './types'

@injectable()
export class ConceptsService {
  constructor(@inject(SubjectRegistry) private readonly subjectRegistry: SubjectRegistry) {}

  async getConcepts(subject: string, filters: ConceptFilters): Promise<Concept[]> {
    const { grade, difficulty, source } = filters

    const subjectData = this.subjectRegistry.get(subject)
    if (!subjectData) {
      throw notFound(`Subject ${subject} not found`)
    }

    const concepts = this.filterConcepts(subject, { grade, difficulty, source })
    return concepts.map(this.mapToResponse)
  }

  private filterConcepts(subject: string, filters: ConceptFilters): ConceptEntity[] {
    const { grade, difficulty, source } = filters

    let concepts = this.subjectRegistry.getConcepts(subject, { grade, difficulty })

    if (source) {
      concepts = concepts.filter((c) => c.source === source)
    }

    if (grade !== undefined && concepts.length === 0) {
      concepts = this.getLowerGradeConcepts(subject, { grade, difficulty, source })
    }

    return concepts
  }

  private getLowerGradeConcepts(
    subject: string,
    filters: Required<Pick<ConceptFilters, 'grade'>> & Omit<ConceptFilters, 'grade'>
  ): ConceptEntity[] {
    const { grade, difficulty, source } = filters

    const allConcepts = this.subjectRegistry.getConcepts(subject, { difficulty })
    let concepts = allConcepts.filter((c) => c.grade < grade)

    if (source) {
      concepts = concepts.filter((c) => c.source === source)
    }

    return concepts
  }

  private mapToResponse(entity: ConceptEntity): Concept {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      grade: entity.grade,
      focus: entity.focus,
      difficulty: entity.difficulty,
      source: entity.source,
      learning_objectives: entity.learning_objectives,
      prerequisites: entity.prerequisites,
    }
  }
}
