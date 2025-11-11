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
      // Parse and validate query parameters for grade and age filtering
      const grade = req.query.grade ? parseInt(req.query.grade as string, 10) : undefined;
      const age = req.query.age ? parseInt(req.query.age as string, 10) : undefined;
      const difficulty = req.query.difficulty as 'easy' | 'medium' | 'hard' | undefined;

      // Validate grade if provided
      if (grade !== undefined && (isNaN(grade) || grade < 1 || grade > 13)) {
        res.status(400).json({ error: 'Invalid grade parameter. Must be between 1 and 13.' });
        return;
      }

      // Validate age if provided
      if (age !== undefined && (isNaN(age) || age < 1 || age > 100)) {
        res.status(400).json({ error: 'Invalid age parameter. Must be between 1 and 100.' });
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
          // Try grade-based filtering first
          let filteredConcepts = subjectRegistry.getConcepts(subject.id, { grade, difficulty });

          // If no results with grade and age is provided, fall back to age-based filtering
          // This ensures custom concepts with broad age ranges (like logic) are included
          if (filteredConcepts.length === 0 && age !== undefined) {
            filteredConcepts = subjectRegistry.getConcepts(subject.id, { age, difficulty });
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
        const allConcepts = subjectRegistry.getConcepts(subject.id);

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

  public async getSubjectConcepts(req: Request, res: Response): Promise<void> {
    try {
      const { subjectId } = req.params;
      const grade = req.query.grade ? parseInt(req.query.grade as string, 10) : undefined;
      const difficulty = req.query.difficulty as 'easy' | 'medium' | 'hard' | undefined;
      const source = req.query.source as 'curriculum' | 'custom' | undefined;

      // Validate required parameters
      if (!subjectId) {
        res.status(400).json({ error: 'Subject ID is required' });
        return;
      }

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

      // Validate source if provided
      if (source && !['curriculum', 'custom'].includes(source)) {
        res.status(400).json({ error: 'Invalid source parameter. Must be curriculum or custom.' });
        return;
      }

      // Get subject
      const subject = subjectRegistry.get(subjectId);
      if (!subject) {
        res.status(404).json({ error: `Subject ${subjectId} not found` });
        return;
      }

      // Get concepts with optional filters
      let concepts = subjectRegistry.getConcepts(subjectId, { grade, difficulty });

      // Filter by source if specified
      if (source) {
        concepts = concepts.filter(c => c.source === source);
      }

      // If no concepts found for the specified grade, fall back to lower grades
      if (grade !== undefined && concepts.length === 0) {
        // Get all concepts below the user's grade
        const allConcepts = subjectRegistry.getConcepts(subjectId, { difficulty });
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
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }

} 