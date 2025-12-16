import 'reflect-metadata'
import { injectable, inject } from 'tsyringe'
import { TaskRequest } from './types'
import { TaskResponse, BaseTaskResponse } from './types'
import { AIClient } from '../common/ai/base'
import { TaskTypeRegistry } from './task-types'
import { v4 as uuidv4 } from 'uuid'
import { TaskCache, TaskContext } from '../cache/taskCache'
import { SubjectRegistry } from '../subjects/registry'
import { PromptService } from '../prompts/service'
import { notFound, internalError } from '../common/errors'
import { Concept } from '../prompts/schemas'
import { convertTaskSvgs } from '../common/svg'
import { AIClientToken } from '../di-tokens'

@injectable()
export class TaskService {
  constructor(
    @inject(AIClientToken) private readonly aiClient: AIClient,
    @inject(PromptService) private readonly promptService: PromptService,
    @inject(SubjectRegistry) private readonly subjectRegistry: SubjectRegistry,
    @inject(TaskTypeRegistry) private readonly taskTypeRegistry: TaskTypeRegistry,
    @inject(TaskCache) private readonly taskCache: TaskCache
  ) {}

  public async generateTask(request: TaskRequest, userId?: string): Promise<TaskResponse> {
    const {
      subject: subjectId,
      concept: requestedConcept,
      taskType,
      grade,
      difficulty,
      language,
    } = request

    // Get the subject
    const subject = this.subjectRegistry.get(subjectId)
    if (!subject) {
      throw notFound(`Subject '${subjectId}' not found`)
    }

    // Load concept (random if not specified)
    let concept: Concept
    if (!requestedConcept) {
      // Random selection with grade filtering
      const randomConcept = this.subjectRegistry.getRandomConcept(subjectId, { grade, difficulty })
      if (!randomConcept) {
        throw notFound(
          `No concepts found for subject '${subjectId}' with grade ${grade} and difficulty ${difficulty}`
        )
      }
      concept = randomConcept
    } else {
      // Get specific concept
      const foundConcept = this.subjectRegistry.getConcept(subjectId, requestedConcept)
      if (!foundConcept) {
        throw notFound(`Concept '${requestedConcept}' not found in subject '${subjectId}'`)
      }
      concept = foundConcept
    }

    // Get the task type (random if not specified)
    let selectedTaskType
    if (!taskType) {
      const allTypes = this.taskTypeRegistry.getAll()
      if (allTypes.length === 0) {
        throw internalError('No task types available')
      }
      selectedTaskType = allTypes[Math.floor(Math.random() * allTypes.length)]
    } else {
      selectedTaskType = this.taskTypeRegistry.get(taskType)
      if (!selectedTaskType) {
        throw notFound(`Task type '${taskType}' not found`)
      }
    }

    // Build prompt using PromptService
    const finalPrompt = await this.promptService.buildPrompt({
      subject,
      taskType: selectedTaskType,
      concept,
      grade: request.grade,
      difficulty: request.difficulty,
      language,
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

    return responseWithType
  }
}
