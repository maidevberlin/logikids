import { mock } from "bun:test";

export const mockOllamaResponse = {
  response: JSON.stringify({
    task: "What is 5 + 3?",
    solution: 8,
    metadata: {
      difficulty: "easy",
      age: {
        min: 6,
        max: 8
      },
      estimatedTimeMinutes: 1
    }
  })
};

// Mock the fetch function for Ollama API calls
global.fetch = mock(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockOllamaResponse)
  })
); 