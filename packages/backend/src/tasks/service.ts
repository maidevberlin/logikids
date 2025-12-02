import { TaskRequest } from './types'
import { TaskResponse, BaseTaskResponse } from './types'
import { AIClient } from '../common/ai/base'
import { TaskTypeRegistry } from './task-types'
import { v4 as uuidv4 } from 'uuid'
import { TaskCache, TaskContext } from '../cache/taskCache'
import { SubjectRegistry } from '../subjects/registry'
import { PromptService } from '../prompts/service'
import { createLogger } from '../common/logger'
import {
  SubjectNotFoundError,
  NoConceptsFoundError,
  ConceptNotFoundError,
  NoTaskTypesError,
  TaskTypeNotFoundError,
} from '../common/errors'
import { Concept } from '../prompts/schemas'
import { convertTaskSvgs } from '../common/svg'

const logger = createLogger('TaskService')

export class TaskService {
  constructor(
    private readonly aiClient: AIClient,
    private readonly promptService: PromptService,
    private readonly subjectRegistry: SubjectRegistry,
    private readonly taskTypeRegistry: TaskTypeRegistry,
    private readonly taskCache: TaskCache
  ) {}

  public async generateTask(request: TaskRequest, userId?: string): Promise<TaskResponse> {
    logger.info('Starting task generation', { request, userId })

    const {
      subject: subjectId,
      concept: requestedConcept,
      taskType,
      grade,
      age,
      difficulty,
      language,
    } = request

    // Get the subject
    const subject = this.subjectRegistry.get(subjectId)
    if (!subject) {
      throw new SubjectNotFoundError(subjectId)
    }
    logger.debug('Subject loaded', { subjectId })

    // Load concept (random if not specified)
    let concept: Concept
    if (!requestedConcept) {
      // Random selection with grade filtering
      const randomConcept = this.subjectRegistry.getRandomConcept(subjectId, { grade, difficulty })
      if (!randomConcept) {
        throw new NoConceptsFoundError({ subject: subjectId, grade, difficulty })
      }
      concept = randomConcept
      logger.debug('Random concept selected', { conceptId: concept.id })
    } else {
      // Get specific concept
      const foundConcept = this.subjectRegistry.getConcept(subjectId, requestedConcept)
      if (!foundConcept) {
        throw new ConceptNotFoundError(requestedConcept, subjectId)
      }
      concept = foundConcept
      logger.debug('Concept loaded', { conceptId: concept.id })
    }

    // Get the task type (random if not specified)
    let selectedTaskType
    if (!taskType) {
      const allTypes = this.taskTypeRegistry.getAll()
      if (allTypes.length === 0) {
        throw new NoTaskTypesError()
      }
      selectedTaskType = allTypes[Math.floor(Math.random() * allTypes.length)]
      logger.debug('Random task type selected', { taskTypeId: selectedTaskType.id })
    } else {
      selectedTaskType = this.taskTypeRegistry.get(taskType)
      if (!selectedTaskType) {
        throw new TaskTypeNotFoundError(taskType)
      }
      logger.debug('Task type loaded', { taskTypeId: selectedTaskType.id })
    }

    // Build prompt using PromptService
    const finalPrompt = await this.promptService.buildPrompt({
      subject,
      taskType: selectedTaskType,
      concept,
      age,
      grade: request.grade,
      difficulty: request.difficulty,
      language,
      gender: request.gender,
    })

    // Generate the task using AI with structured output
    const aiResponse = await this.aiClient.generateStructured<BaseTaskResponse>(
      finalPrompt,
      selectedTaskType.jsonSchema,
      {
        costTracking: {
          userId,
          subject: subjectId,
          concept: concept.id,
        },
      }
    )

    // Convert inline SVGs to data URLs for reliable rendering
    const convertedResult = convertTaskSvgs(
      aiResponse.result as unknown as Record<string, unknown>
    ) as unknown as BaseTaskResponse

    // Generate taskId and add to response
    // Note: type is already correctly set in aiResponse.result by the schema
    const taskId = uuidv4()
    const responseWithType = {
      ...convertedResult,
      taskId,
      // Add usage information if available
      ...(aiResponse.usage && {
        usage: {
          inputTokens: aiResponse.usage.inputTokens,
          outputTokens: aiResponse.usage.outputTokens,
          totalTokens:
            aiResponse.usage.totalTokens ??
            aiResponse.usage.inputTokens + aiResponse.usage.outputTokens,
          ...(aiResponse.usage.cost !== undefined && { cost: aiResponse.usage.cost }),
        },
      }),
    } as TaskResponse
    logger.debug('Task ID generated', { taskId, usage: aiResponse.usage })

    // Store context in cache for hint generation
    const taskContext: TaskContext = {
      taskId,
      subject: subjectId,
      concept: concept.id,
      taskType: selectedTaskType.id,
      grade: request.grade,
      difficulty: request.difficulty,
      language,
      taskResponse: responseWithType,
      hintsGenerated: [],
      createdAt: Date.now(),
    }
    this.taskCache.set(taskId, taskContext)
    logger.debug('Task context stored in cache')

    return responseWithType
  }
}
