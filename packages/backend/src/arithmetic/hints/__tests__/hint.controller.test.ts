import { describe, test, expect, beforeEach, mock } from "bun:test";
import { ArithmeticHintController } from "../hint.controller";
import { Request, Response } from 'express';
import { AIClient } from "../../../services/ai/base";
import { ArithmeticHintService } from "../hint.service";

describe("ArithmeticHintController", () => {
  let mockAIClient: AIClient;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: ReturnType<typeof mock>;
  let mockStatus: ReturnType<typeof mock>;

  beforeEach(() => {
    // Reset all mocks and services before each test
    (ArithmeticHintController as any).hintService = undefined;

    // Create fresh mocks for each test
    mockJson = mock(() => mockResponse);
    mockStatus = mock(() => mockResponse);

    mockResponse = {
      json: mockJson,
      status: mockStatus
    };

    mockRequest = {
      body: {
        task: "2 + 2",
        type: "arithmetic"
      }
    };

    // Create mock AI client
    mockAIClient = {
      generate: mock(() => Promise.resolve({ response: "test response" })),
      model: "llama2",
      provider: "ollama"
    } as unknown as AIClient;
  });

  test("should initialize service and generate hint successfully", async () => {
    // Arrange
    const expectedHint = {
      hint: "Think about counting on your fingers",
      metadata: {
        provider: "ollama" as const,
        model: "llama2"
      }
    };

    const mockService = {
      generateHint: mock(() => Promise.resolve(expectedHint))
    } as unknown as ArithmeticHintService;

    (ArithmeticHintController as any).hintService = mockService;

    const controller = new ArithmeticHintController();

    // Act
    await controller.generateHint(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(mockService.generateHint).toHaveBeenCalledTimes(1);
    expect(mockService.generateHint).toHaveBeenCalledWith(mockRequest.body.task);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(expectedHint);
  });

  test("should handle errors appropriately", async () => {
    // Arrange
    const mockError = new Error("Test error");
    const mockService = {
      generateHint: mock(() => Promise.reject(mockError))
    } as unknown as ArithmeticHintService;

    (ArithmeticHintController as any).hintService = mockService;

    const controller = new ArithmeticHintController();

    // Act
    await controller.generateHint(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(mockService.generateHint).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
}); 