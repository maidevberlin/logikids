import { Request, Response } from 'express';
import { BaseController } from '../common/baseController';
import { TaskService } from './task.service';
import { taskRequestSchema } from './types';
import { subjectRegistry } from '../subjects/registry';
import { AIClient } from '../common/ai/base';

export class TaskController extends BaseController {
  private readonly taskService: TaskService;

  constructor(
    aiClient: AIClient,
    taskService: TaskService
  ) {
    super(aiClient);
    this.taskService = taskService;
  }

  public async getSubjects(req: Request, res: Response): Promise<void> {
    try {
      // Parse and validate query parameters for grade filtering
      const grade = req.query.grade ? parseInt(req.query.grade as string, 10) : undefined;
      const difficulty = req.query.difficulty as 'easy' | 'medium' | 'hard' | undefined;

      // Validate grade if provided
      if (grade !== undefined && (isNaN(grade) || grade < 1 || grade > 13)) {
        res.status(400).json({ error: 'Invalid grade parameter. Must be between 1 and 13.' });
        return;
      }

      // Validate difficulty if provided
      if (difficulty && !['easy', 'medium', 'hard'].includes(difficulty)) {
        res.status(400).json({ error: 'Invalid difficulty parameter. Must be easy, medium, or hard.' });
        return;
      }

      const subjects = subjectRegistry.getAll().map(subject => {
        const metadata = subjectRegistry.getConceptMetadata(subject.id);

        // If grade filtering is active, return filtered concepts with full details
        if (grade !== undefined) {
          const filteredConcepts = subjectRegistry.getConcepts(subject.id, { grade, difficulty });

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

        // Otherwise return just metadata (for subjects page)
        return {
          id: subject.id,
          name: subject.name,
          description: subject.description,
          conceptCount: metadata.conceptCount,
          minGrade: metadata.minGrade,
          maxGrade: metadata.maxGrade,
          minAge: metadata.minAge,
          maxAge: metadata.maxAge,
        };
      });

      // Filter out subjects with no concepts if grade filtering is active
      const filteredSubjects = grade !== undefined
        ? subjects.filter(s => s.concepts && s.concepts.length > 0)
        : subjects;

      res.json({ subjects: filteredSubjects });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  public async getTask(req: Request, res: Response): Promise<void> {
    try {
      // Parse and validate query parameters
      const query = {
        ...req.query,
        grade: req.query.grade ? parseInt(req.query.grade as string, 10) : undefined,
        age: req.query.age ? parseInt(req.query.age as string, 10) : undefined,
      };

      // Validate with Zod schema
      const validatedQuery = taskRequestSchema.parse(query);

      // Delegate to service (handles all business logic)
      const task = await this.taskService.generateTask(validatedQuery);

      res.json(task);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }
} 