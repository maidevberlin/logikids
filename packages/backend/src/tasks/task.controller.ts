import { Request, Response } from 'express';
import { BaseController } from '../common/baseController';
import { TaskService } from './task.service';
import { taskRequestSchema, TaskRequest } from './types';
import { subjectRegistry } from './subject.registry';
import { taskTypeRegistry } from './types/registry';
import { AIClient } from '../common/ai/base';

export class TaskController extends BaseController {
  private readonly taskService: TaskService;

  constructor(aiClient: AIClient) {
    super(aiClient);
    this.taskService = new TaskService(aiClient);
  }

  public async getSubjects(_req: Request, res: Response): Promise<void> {
    try {
      const subjects = subjectRegistry.getAll().map(subject => ({
        id: subject.id,
        name: subject.name,
        description: subject.description,
        concepts: Array.from(subject.concepts.values()).map(concept => ({
          id: concept.id,
          name: concept.name,
          description: concept.description
        }))
      }));

      res.json(subjects);
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
    const concept = subjectRegistry.getRandomConcept(subject);
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
        const conceptExists = subjectRegistry.getConcept(basicValidation.subject, basicValidation.concept);
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