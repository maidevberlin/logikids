import { describe, test, expect, beforeEach, mock } from "bun:test";
import { ArithmeticTaskController } from "../task.controller";
import { Request, Response } from 'express';
import { AIClient } from "../../../services/ai/base";
import { ArithmeticTaskService } from "../task.service";

describe("ArithmeticTaskController", () => {
  let mockAIClient: AIClient;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: ReturnType<typeof mock>;
  let mockStatus: ReturnType<typeof mock>;

  beforeEach(() => {
    // Reset the static service to ensure clean state
    (ArithmeticTaskController as any).arithmeticService = undefined;

    // Create mock AI client
    mockAIClient = {
      generate: mock(() => Promise.resolve({ response: "test response" })),
      model: "llama2",
      provider: "ollama"
    } as unknown as AIClient;

    // Mock express request and response
    mockJson = mock(() => mockResponse);
    mockStatus = mock(() => mockResponse);
    mockRequest = {};
    mockResponse = {
      json: mockJson,
      status: mockStatus
    };
  });

  test("should initialize service and generate task successfully", async () => {
    // Arrange
    const expectedTask = {
      task: "ARITHMETIC_CONTROLLER_TEST: 2 + 2",
      solution: 4,
      metadata: {
        difficulty: "easy" as const,
        age: { min: 6, max: 8 },
        estimatedTimeMinutes: 2,
        provider: "ollama" as const,
        model: "llama2"
      },
      type: "arithmetic" as const
    };

    // Create a mock service instance instead of modifying the prototype
    const mockService = {
      generateTask: mock(() => Promise.resolve(expectedTask))
    } as unknown as ArithmeticTaskService;

    // Set the mock service instance
    (ArithmeticTaskController as any).arithmeticService = mockService;

    const controller = new ArithmeticTaskController();

    // Act
    await controller.getTask(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(mockJson).toHaveBeenCalledWith(expectedTask);
    expect(mockService.generateTask).toHaveBeenCalled();
  });
}); 