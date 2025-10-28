import { Request, Response } from 'express';
import { BaseController } from '../common/baseController';
import { TaskService } from './task.service';
import { taskRequestSchema, TaskRequest } from './types';
import { subjectRegistry } from '../subjects/registry';
import { taskTypeRegistry } from './types/registry';
import { AIClient } from '../common/ai/base';

export class TaskController extends BaseController {
  private readonly taskService: TaskService;

  constructor(aiClient: AIClient) {
    super(aiClient);
    this.taskService = new TaskService(aiClient);
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
        // Get enriched concepts with filtering if grade/difficulty provided
        const enrichedConcepts = grade !== undefined
          ? subjectRegistry.getConcepts(subject.id, { grade, difficulty })
          : [];

        // If grade filtering is active, only return enriched concepts
        if (grade !== undefined) {
          return {
            id: subject.id,
            name: subject.name,
            description: subject.description,
            concepts: enrichedConcepts.map(concept => ({
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

        // Otherwise return legacy format (all concepts)
        return {
          id: subject.id,
          name: subject.name,
          description: subject.description,
          concepts: Array.from(subject.concepts.values()).map(concept => ({
            id: concept.id,
            name: concept.name,
            description: concept.description
          }))
        };
      });

      // Filter out subjects with no concepts if grade filtering is active
      const filteredSubjects = grade !== undefined
        ? subjects.filter(s => s.concepts.length > 0)
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

  private getRandomTaskType(): string {
    const types = taskTypeRegistry.getAll();
    if (types.length === 0) {
      throw new Error('No task types available');
    }
    const selectedType = types[Math.floor(Math.random() * types.length)].id;
    
    return selectedType;
  }

  private getRandomConcept(subject: string): string {
    const concept = subjectRegistry.getRandomEnrichedConcept(subject);
    if (!concept) {
      throw new Error('Invalid subject or no concepts available');
    }
    return concept.id;
  }

  public async getTask(req: Request, res: Response): Promise<void> {
    try {
      const query = {
        ...req.query,
        grade: req.query.grade ? parseInt(req.query.grade as string, 10) : undefined,
        taskType: req.query.taskType || this.getRandomTaskType()
      };

      // First validate the basic structure
      const basicValidation = taskRequestSchema.parse(query);
      
      // Then validate the concept exists for the subject or handle random selection
      const subject = subjectRegistry.get(basicValidation.subject);
      
      if (!subject) {
        throw new Error('Invalid subject');
      }

      // Handle random concept selection
      if (basicValidation.concept === 'random') {
        basicValidation.concept = this.getRandomConcept(basicValidation.subject);
      } else {
        // Check enriched concepts first (curriculum + custom), fallback to legacy
        const conceptExists = subjectRegistry.getEnrichedConcept(basicValidation.subject, basicValidation.concept)
          || subjectRegistry.getConcept(basicValidation.subject, basicValidation.concept);
        if (!conceptExists) {
          throw new Error('Invalid concept for the selected subject');
        }
      }

      const validatedQuery: TaskRequest = basicValidation;
      const language = this.getPreferredLanguage(req);
      const task = await this.taskService.generateTask(validatedQuery, language);
      
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