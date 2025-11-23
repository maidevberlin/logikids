import { Request, Response } from 'express';
import { TaskService } from './task.service';
import { taskRequestSchema } from './types';
import { SubjectRegistry } from '../subjects/registry';
import { GetSubjectsRequest, GetConceptsRequest } from './task.schema';

export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly subjectRegistry: SubjectRegistry
  ) {}

  public async getSubjects(req: GetSubjectsRequest, res: Response): Promise<void> {
    const { grade, age, difficulty } = req.query; // Already validated and coerced by middleware

    const subjects = this.subjectRegistry.getAll().map(subject => {
      const metadata = this.subjectRegistry.getConceptMetadata(subject.id);

      // If grade filtering is active, return filtered concepts with full details
      if (grade !== undefined) {
        // Try grade-based filtering first
        let filteredConcepts = this.subjectRegistry.getConcepts(subject.id, { grade, difficulty });

        // If no results with grade and age is provided, fall back to age-based filtering
        // This ensures custom concepts with broad age ranges (like logic) are included
        if (filteredConcepts.length === 0 && age !== undefined) {
          filteredConcepts = this.subjectRegistry.getConcepts(subject.id, { age, difficulty });
        }

        return {
          id: subject.id,
          name: subject.name,
          description: subject.description,
          conceptCount: metadata.conceptCount,
          minGrade: metadata.minGrade,
          maxGrade: metadata.maxGrade,
          minAge: metadata.minAge,
          maxAge: metadata.maxAge,
          concepts: filteredConcepts.map(concept => ({
            id: concept.id,
            name: concept.name,
            description: concept.description,
            grade: concept.grade,
            difficulty: concept.difficulty,
            source: concept.source,
            focus: concept.focus,
            learning_objectives: concept.learning_objectives
          }))
        };
      }

      // Otherwise return all concepts without filtering
      const allConcepts = this.subjectRegistry.getConcepts(subject.id);

      return {
        id: subject.id,
        name: subject.name,
        description: subject.description,
        conceptCount: metadata.conceptCount,
        minGrade: metadata.minGrade,
        maxGrade: metadata.maxGrade,
        minAge: metadata.minAge,
        maxAge: metadata.maxAge,
        concepts: allConcepts.map(concept => ({
          id: concept.id,
          name: concept.name,
          description: concept.description,
          grade: concept.grade,
          difficulty: concept.difficulty,
          source: concept.source,
          focus: concept.focus,
          learning_objectives: concept.learning_objectives
        }))
      };
    });

    // Filter out subjects with no concepts if grade filtering is active
    const filteredSubjects = grade !== undefined
      ? subjects.filter(s => s.concepts && s.concepts.length > 0)
      : subjects;

    res.json({ subjects: filteredSubjects });
  }

  public async getTask(req: Request, res: Response): Promise<void> {
    // Parse and validate query parameters
    const query = {
      ...req.query,
      grade: req.query.grade ? parseInt(req.query.grade as string, 10) : undefined,
      age: req.query.age ? parseInt(req.query.age as string, 10) : undefined,
    };

    // Validate with Zod schema
    const validatedQuery = taskRequestSchema.parse(query);

    // Delegate to service (handles all business logic)
    // Pass userId from auth middleware for cost tracking
    const task = await this.taskService.generateTask(validatedQuery, req.userId);

    res.json(task);
  }

  public async getSubjectConcepts(req: GetConceptsRequest, res: Response): Promise<void> {
    const { subjectId } = req.params; // Already validated by middleware
    const { grade, difficulty, source } = req.query; // Already validated and coerced by middleware

    // Get subject
    const subject = this.subjectRegistry.get(subjectId);
    if (!subject) {
      res.status(404).json({ error: `Subject ${subjectId} not found` });
      return;
    }

    // Get concepts with optional filters
    let concepts = this.subjectRegistry.getConcepts(subjectId, { grade, difficulty });

    // Filter by source if specified
    if (source) {
      concepts = concepts.filter(c => c.source === source);
    }

    // If no concepts found for the specified grade, fall back to lower grades
    if (grade !== undefined && concepts.length === 0) {
      // Get all concepts below the user's grade
      const allConcepts = this.subjectRegistry.getConcepts(subjectId, { difficulty });
      concepts = allConcepts.filter(c => {
        // Include concepts from lower grades
        if (c.grade === undefined) return false;
        return c.grade < grade;
      });

      // Filter by source if specified
      if (source) {
        concepts = concepts.filter(c => c.source === source);
      }
    }

    res.json({
      subject: {
        id: subject.id,
        name: subject.name,
        description: subject.description
      },
      concepts: concepts.map(concept => ({
        id: concept.id,
        name: concept.name,
        description: concept.description,
        grade: concept.grade,
        difficulty: concept.difficulty,
        source: concept.source,
        focus: concept.focus,
        learning_objectives: concept.learning_objectives
      })),
      totalResults: concepts.length
    });
  }

} 