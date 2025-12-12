import 'reflect-metadata'
import { container } from 'tsyringe'
import { createAIClient } from './common/ai/factory'
import { AIClient } from './common/ai/base'
import { PromptService } from './prompts/service'
import { PromptLoader } from './prompts/loader'
import { VariationLoader } from './prompts/variations/loader'
import { TaskService } from './tasks/service'
import { HintService } from './tasks/hints/service'
import { ConceptsService } from './concepts/service'
import { SubjectsService } from './subjects/service'
import { CacheCleanupService } from './cache/cacheCleanup'
import { AuthService } from './auth/service'
import { InviteService } from './invites/service'
import { SyncService } from './sync/service'
import { StorageService } from './sync/storage'
import { TTSService } from './tts/service'
import { TTSCache } from './tts/cache'
import { subjectRegistry, SubjectRegistry } from './subjects/registry'
import { taskTypeRegistry, TaskTypeRegistry } from './tasks/task-types'
import { taskCache, TaskCache } from './cache/taskCache'
import { AIClientToken } from './di-tokens'

/**
 * Initialize the DI container with all async dependencies.
 * Must be called before using any services that depend on these.
 */
export async function initializeContainer(): Promise<void> {
  // Register singleton instances
  container.registerInstance<SubjectRegistry>(SubjectRegistry, subjectRegistry)
  container.registerInstance<TaskTypeRegistry>(TaskTypeRegistry, taskTypeRegistry)
  container.registerInstance<TaskCache>(TaskCache, taskCache)

  // Create and register AI client
  const aiClient = await createAIClient()
  container.registerInstance<AIClient>(AIClientToken, aiClient)

  // Create and register PromptLoader and VariationLoader
  const promptLoader = new PromptLoader()
  const variationLoader = new VariationLoader()
  container.registerInstance<PromptLoader>(PromptLoader, promptLoader)
  container.registerInstance<VariationLoader>(VariationLoader, variationLoader)

  // Register and initialize PromptService
  container.registerSingleton<PromptService>(PromptService)
  const promptService = container.resolve<PromptService>(PromptService)
  await promptService.initialize()

  // Register TaskService as singleton (auto-resolved via @injectable)
  container.registerSingleton<TaskService>(TaskService)

  // Register HintService as singleton (auto-resolved via @injectable)
  container.registerSingleton<HintService>(HintService)
  const hintService = container.resolve<HintService>(HintService)
  await hintService.initialize()

  // Register ConceptsService as singleton (auto-resolved via @injectable)
  container.registerSingleton<ConceptsService>(ConceptsService)

  // Register SubjectsService as singleton (auto-resolved via @injectable)
  container.registerSingleton<SubjectsService>(SubjectsService)

  // Register CacheCleanupService as singleton (auto-resolved via @injectable)
  container.registerSingleton<CacheCleanupService>(CacheCleanupService)

  // Register Auth services
  container.registerSingleton<AuthService>(AuthService)
  container.registerSingleton<InviteService>(InviteService)

  // Register Sync services
  container.registerSingleton<StorageService>(StorageService)
  container.registerSingleton<SyncService>(SyncService)

  // Register TTS services
  container.registerSingleton<TTSCache>(TTSCache)
  container.registerSingleton<TTSService>(TTSService)
}
