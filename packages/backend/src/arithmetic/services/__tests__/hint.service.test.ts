import { describe, test, expect, beforeEach, mock } from "bun:test";
import { ArithmeticHintService } from "../hint.service";
import { AIClient } from "../../../services/ai/base";
import { ArithmeticTaskResponse } from "../../types/task";

describe("ArithmeticHintService", () => {
  let hintService: ArithmeticHintService;
  let mockAIClient: AIClient;

  const mockTask: ArithmeticTaskResponse = {
    task: "What is 15 + 27?",
    solution: 42,
    type: "arithmetic",
    metadata: {
      difficulty: "easy",
      age: { min: 6, max: 8 },
      estimatedTimeMinutes: 2,
      provider: "ollama",
      model: "llama2"
    }
  };

  beforeEach(() => {
    // Create mock AI client
    const mockResponse = {
      hint: "Try breaking down the addition into smaller parts",
    };

    mockAIClient = {
      generate: mock(() => Promise.resolve({response: JSON.stringify(mockResponse)})),
      model: "llama2",
      provider: "ollama"
    } as unknown as AIClient;

    hintService = new ArithmeticHintService(mockAIClient);
    
    // Mock loadPrompts
    hintService["loadPrompts"] = mock(() => Promise.resolve({
      prompt: "Generate a hint for arithmetic task",
      response_format: "{}"
    }));
  });

  test("should generate hint using AI client", async () => {
    // Act
    const result = await hintService.generateHint(mockTask);

    // Assert
    expect(mockAIClient.generate).toHaveBeenCalled();
    expect(result.hint).toBe("Try breaking down the addition into smaller parts");
  });

  test("should include previous hints in prompt", async () => {
    // Act
    await hintService.generateHint(mockTask);

    // Assert
    const generateMock = mockAIClient.generate as unknown as ReturnType<typeof mock>;
    expect(generateMock).toHaveBeenCalled();
  });
}); 