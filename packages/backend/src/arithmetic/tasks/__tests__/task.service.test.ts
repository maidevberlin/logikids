import { describe, test, expect, beforeEach, mock } from "bun:test";
import { ArithmeticTaskService } from "../task.service";
import { AIClient } from "../../../services/ai/base";
import { ArithmeticTaskResponse } from "../task";
import { response } from "express";

describe("ArithmeticTaskService", () => {
  let taskService: ArithmeticTaskService;
  let mockAIClient: AIClient;

  beforeEach(() => {
    // Create mock AI client
    const mockResponse = {
        task: "ARITHMETIC_TASK_SERVICE_TEST: 21 + 21",
        solution: 4,
        metadata: {
            difficulty: "easy" as const,
            age: { min: 6, max: 8 },
            estimatedTimeMinutes: 2,
            provider: "ollama" as const,
            model: "llama23"
        }
    };

    mockAIClient = {
      generate: mock(() => Promise.resolve({response: JSON.stringify(mockResponse)})),
      model: "llama23",
      provider: "ollama"
    } as unknown as AIClient;

    taskService = new ArithmeticTaskService(mockAIClient);
    
    // Mock loadPrompts
    taskService["loadPrompts"] = mock(() => Promise.resolve({
      prompt: "Generate an arithmetic task",
      response_format: "{}"
    }));
  });

  test("should validate and transform a valid response", async () => {
    // Arrange
    const validResponse = {
      task: "ARITHMETIC_TASK_SERVICE_VALIDATE: 1 + 1",
      solution: 4,
      explanation: "Adding two and two equals four",
      metadata: {
        difficulty: "easy" as const,
        age: { min: 6, max: 8 },
        estimatedTimeMinutes: 2,
        provider: "ollama" as const,
        model: "llama21"
      }
    };

    // Act
    const result = await taskService["validateAndTransformResponse"](validResponse);

    // Assert
    expect(result).toEqual({
      task: "ARITHMETIC_TASK_SERVICE_VALIDATE: 1 + 1",
      solution: 4,
      metadata: {
        difficulty: "easy",
        age: { min: 6, max: 8 },
        estimatedTimeMinutes: 2,
        provider: "ollama",
        model: "llama21"
      },
      type: "arithmetic"
    });
  });

  test("should throw error for invalid response", async () => {
    // Arrange
    const invalidResponse = {
      task: "3 + 3",
      // Missing required fields
    };

    // Act & Assert
    await expect(taskService["validateAndTransformResponse"](invalidResponse))
      .rejects.toThrow("Invalid arithmetic task response");
  });

  test("should generate task using AI client", async () => {
    // Act
    const result = await taskService.generateTask();

    // Assert
    expect(result).toEqual({
      task: "ARITHMETIC_TASK_SERVICE_TEST: 21 + 21",
      solution: 4,
      metadata: {
        difficulty: "easy",
        age: { min: 6, max: 8 },
        estimatedTimeMinutes: 2,
        provider: "ollama",
        model: "llama23"
      },
      type: "arithmetic"
    });
    
    expect(mockAIClient.generate).toHaveBeenCalled();
    
  });
}); 