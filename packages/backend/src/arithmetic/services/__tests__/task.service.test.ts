import { describe, test, expect, beforeEach, mock } from "bun:test";
import { ArithmeticTaskService } from "../task.service";
import { AIClient } from "../../../services/ai/base";
import { ArithmeticTaskResponse } from "../../types/task";
import { response } from "express";

describe("ArithmeticTaskService", () => {
  let taskService: ArithmeticTaskService;
  let mockAIClient: AIClient;

  beforeEach(() => {
    // Create mock AI client
    const mockResponse = {
        task: "2 + 2",
        solution: 4,
        metadata: {
            difficulty: "easy" as const,
            age: { min: 6, max: 8 },
            estimatedTimeMinutes: 2,
            provider: "ollama" as const,
            model: "llama2"
        }
    };

    mockAIClient = {
      generate: mock(() => Promise.resolve({response: JSON.stringify(mockResponse)})),
      model: "llama2",
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
      task: "2 + 2",
      solution: 4,
      explanation: "Adding two and two equals four",
      metadata: {
        difficulty: "easy" as const,
        age: { min: 6, max: 8 },
        estimatedTimeMinutes: 2,
        provider: "ollama" as const,
        model: "llama2"
      }
    };

    // Act
    const result = await taskService["validateAndTransformResponse"](validResponse);

    // Assert
    expect(result).toEqual({
      task: "2 + 2",
      solution: 4,
      metadata: {
        difficulty: "easy",
        age: { min: 6, max: 8 },
        estimatedTimeMinutes: 2,
        provider: "ollama",
        model: "llama2"
      },
      type: "arithmetic"
    });
  });

  test("should throw error for invalid response", async () => {
    // Arrange
    const invalidResponse = {
      task: "2 + 2",
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
    expect(mockAIClient.generate).toHaveBeenCalled();
    expect(result).toEqual({
      task: "2 + 2",
      solution: 4,
      metadata: {
        difficulty: "easy",
        age: { min: 6, max: 8 },
        estimatedTimeMinutes: 2,
        provider: "ollama",
        model: "llama2"
      },
      type: "arithmetic"
    });
  });
}); 