import { mock } from "bun:test";
import { TaskResponse } from "../../types/task";
import { HintResponse } from "../../types/hints";

export const mockTaskResponse: TaskResponse = {
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
};

export const mockGeometryResponse: TaskResponse = {
  task: "Calculate the area of a rectangle with width 4 and height 5.",
  solution: 20,
  metadata: {
    difficulty: "easy",
    age: {
      min: 8,
      max: 10
    },
    estimatedTimeMinutes: 2
  }
};

export const mockHintResponse: HintResponse = {
  hint: "Think about the basic arithmetic operations."
};

// Mock the fetch function for Ollama API calls
global.fetch = mock(() => 
  Promise.resolve(new Response(JSON.stringify({
    model: "llama3.2",
    response: JSON.stringify(mockTaskResponse)
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  }))
); 