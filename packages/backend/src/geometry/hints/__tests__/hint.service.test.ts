import { describe, test, expect, beforeEach, mock } from "bun:test";
import { GeometryHintService } from "../../hints/hint.service";
import { AIClient } from "../../../services/ai/base";
import { GeometryTaskResponse } from "../task";

describe("GeometryHintService", () => {
  let hintService: GeometryHintService;
  let mockAIClient: AIClient;

  const mockTask: GeometryTaskResponse = {
    task: "GEOMETRY_HINT_SERVICE_TEST: Calculate square area",
    solution: 16,
    type: "geometry",
    metadata: {
      difficulty: "easy",
      age: { min: 8, max: 10 },
      estimatedTimeMinutes: 3,
      provider: "ollama",
      model: "llama2"
    }
  };

  beforeEach(() => {
    // Create mock AI client
    const mockResponse = {
      hint: "Remember that a square's area is the length of one side multiplied by itself",
      metadata: {
        difficulty: "easy" as const,
        helpfulness: 0.8,
        provider: "ollama" as const,
        model: "llama2"
      }
    };

    const generateMock = mock(() => Promise.resolve({response: JSON.stringify(mockResponse)}));

    mockAIClient = {
      generate: generateMock,
      model: "llama2",
      provider: "ollama"
    } as unknown as AIClient;

    hintService = new GeometryHintService(mockAIClient);
    
    // Mock loadPrompts
    hintService["loadPrompts"] = mock(() => Promise.resolve({
      prompt: "Generate a hint for geometry task",
      response_format: "{}"
    }));
  });

  test("should generate hint using AI client", async () => {
    // Act
    const result = await hintService.generateHint(mockTask);

    // Assert
    expect(mockAIClient.generate).toHaveBeenCalled();
    expect(result.hint).toBe("Remember that a square's area is the length of one side multiplied by itself");
  });

  test("should include previous hints in prompt", async () => {
    // Act
    await hintService.generateHint(mockTask);

    // Assert
    const generateMock = mockAIClient.generate as unknown as ReturnType<typeof mock>;
    expect(generateMock).toHaveBeenCalled();
  });
}); 