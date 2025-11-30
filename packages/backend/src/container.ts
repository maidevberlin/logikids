import 'reflect-metadata';
import {container} from 'tsyringe';
import {createAIClient} from './common/ai/factory';
import {AIClient} from './common/ai/base';
import {PromptService} from './prompts/service';
import {PromptLoader} from './prompts/loader';
import {VariationLoader} from './prompts/variations/loader';
import {TaskService} from './tasks/service';
import {HintService} from './hints/service';
import {subjectRegistry, SubjectRegistry} from './subjects/registry';
import {taskTypeRegistry, TaskTypeRegistry} from './tasks/task-types';
import {taskCache, TaskCache} from './cache/taskCache';
import {createLogger} from './common/logger';

const logger = createLogger('Container');

// Injection tokens for instances
export const AI_CLIENT = 'AIClient';
export const PROMPT_SERVICE = 'PromptService';
export const SUBJECT_REGISTRY = 'SubjectRegistry';
export const TASK_TYPE_REGISTRY = 'TaskTypeRegistry';
export const TASK_CACHE = 'TaskCache';

/**
 * Initialize the DI container with all async dependencies.
 * Must be called before using any services that depend on these.
 */
export async function initializeContainer(): Promise<void> {
  logger.info('Initializing DI container...');

  // Register singleton instances
  container.registerInstance<SubjectRegistry>(SUBJECT_REGISTRY, subjectRegistry);
  container.registerInstance<TaskTypeRegistry>(TASK_TYPE_REGISTRY, taskTypeRegistry);
  container.registerInstance<TaskCache>(TASK_CACHE, taskCache);

  // Create and register AI client
  const aiClient = await createAIClient();
  container.registerInstance<AIClient>(AI_CLIENT, aiClient);

  // Create and initialize PromptService
  const promptLoader = new PromptLoader();
  const variationLoader = new VariationLoader();
  const promptService = new PromptService(promptLoader, variationLoader);
  await promptService.initialize();
  container.registerInstance<PromptService>(PROMPT_SERVICE, promptService);

  // Register TaskService with factory
  container.register<TaskService>(TaskService, {
    useFactory: (c) => {
      return new TaskService(
        c.resolve<AIClient>(AI_CLIENT),
        c.resolve<PromptService>(PROMPT_SERVICE),
        c.resolve<SubjectRegistry>(SUBJECT_REGISTRY),
        c.resolve<TaskTypeRegistry>(TASK_TYPE_REGISTRY),
        c.resolve<TaskCache>(TASK_CACHE)
      );
    },
  });

  // Register HintService with factory
  container.register<HintService>(HintService, {
    useFactory: (c) => {
        // Note: initialize() is called separately since it's async
      return new HintService(c.resolve<AIClient>(AI_CLIENT));
    },
  });

  // Initialize HintService (async operation)
  const hintService = container.resolve<HintService>(HintService);
  await hintService.initialize();

  logger.info('DI container initialized');
}
