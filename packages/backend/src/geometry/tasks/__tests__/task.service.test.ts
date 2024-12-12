import { describe, test, expect, beforeEach, mock } from "bun:test";
import { AIClient } from "../../../services/ai/base";
import { GeometryTaskResponse } from "../task";
import { GeometryTaskService } from "../task.service";

describe("GeometryTaskService", () => {
  let taskService: GeometryTaskService;
  let mockAIClient: AIClient;

  beforeEach(() => {
    // Create mock AI client
    const mockResponse = {
      task: "GEOMETRY_TASK_SERVICE_TEST: Calculate area",
      solution: 16,
      metadata: {
        difficulty: "easy" as const,
        age: { min: 8, max: 10 },
        estimatedTimeMinutes: 3,
        provider: "ollama" as const,
        model: "llama2"
      }
    };

    mockAIClient = {
      generate: mock(() => Promise.resolve({response: JSON.stringify(mockResponse)})),
      model: "llama2",
      provider: "ollama"
    } as unknown as AIClient;

    taskService = new GeometryTaskService(mockAIClient);
    
    // Mock loadPrompts
    taskService["loadPrompts"] = mock(() => Promise.resolve({
      prompt: "Generate a geometry task",
      response_format: "{}"
    }));
  });

  test("should validate and transform a valid response", async () => {
    // Arrange
    const validResponse = {
      task: "GEOMETRY_TASK_SERVICE_VALIDATE: Calculate square",
      solution: 16,
      explanation: "The area of a square is calculated by squaring its side length",
      metadata: {
        difficulty: "easy" as const,
        age: { min: 8, max: 10 },
        estimatedTimeMinutes: 3,
        provider: "ollama" as const,
        model: "llama2"
      }
    };

    // Act
    const result = await taskService["validateAndTransformResponse"](validResponse);

    // Assert
    expect(result).toEqual({
      task: "GEOMETRY_TASK_SERVICE_VALIDATE: Calculate square",
      solution: 16,
      metadata: {
        difficulty: "easy",
        age: { min: 8, max: 10 },
        estimatedTimeMinutes: 3,
        provider: "ollama",
        model: "llama2"
      },
      type: "geometry"
    });
  });

  test("should throw error for invalid response", async () => {
    // Arrange
    const invalidResponse = {
      task: "Calculate area",
      // Missing required fields
    };

    // Act & Assert
    await expect(taskService["validateAndTransformResponse"](invalidResponse))
      .rejects.toThrow("Invalid geometry task response");
  });

  test("should generate task using AI client", async () => {
    // Act
    const result = await taskService.generateTask();

    // Assert
    expect(mockAIClient.generate).toHaveBeenCalled();
    expect(result).toEqual({
      task: "GEOMETRY_TASK_SERVICE_TEST: Calculate area",
      solution: 16,
      metadata: {
        difficulty: "easy",
        age: { min: 8, max: 10 },
        estimatedTimeMinutes: 3,
        provider: "ollama",
        model: "llama2"
      },
      type: "geometry"
    });
  });
}); 