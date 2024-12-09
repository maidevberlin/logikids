import { describe, expect, test, beforeEach, mock } from "bun:test";
import supertest from "supertest";
import app from "../../../index";
import { TaskResponse } from "../../../types/task";
import { HintResponse } from "../../../types/hints";
import "../../../__tests__/mocks/ollama.mock";

describe("Hints API", () => {
  const request = supertest(app);

  beforeEach(() => {
    // Clear mock calls before each test
    (global.fetch as any).mockClear();
  });

  test("POST /api/hints should generate a hint successfully", async () => {
    const taskData: TaskResponse = {
      task: "What is 2 + 2?",
      solution: 4,
      metadata: {
        difficulty: "easy",
        age: {
          min: 6,
          max: 8
        },
        estimatedTimeMinutes: 5
      }
    };

    const response = await request
      .post("/api/hints")
      .send(taskData)
      .expect("Content-Type", /json/)
      .expect(200);
    
    const data = response.body as HintResponse;
    
    // Verify fetch was called for Ollama
    expect(global.fetch).toHaveBeenCalled();
    
    // Verify the response matches the HintResponse schema
    expect(data).toHaveProperty("hint");
    expect(typeof data.hint).toBe("string");
  });

  test("POST /api/hints with invalid task format should return 400", async () => {
    const invalidData = {
      invalid: "data"
    };

    await request
      .post("/api/hints")
      .send(invalidData)
      .expect("Content-Type", /json/)
      .expect(400)
      .expect(res => {
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Invalid task format");
      });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("POST /api/hints should handle service errors", async () => {
    const taskData: TaskResponse = {
      task: "What is 2 + 2?",
      solution: 4,
      metadata: {
        difficulty: "easy",
        age: {
          min: 6,
          max: 8
        },
        estimatedTimeMinutes: 5
      }
    };

    // Mock fetch to simulate a service error
    (global.fetch as any).mockImplementationOnce(() => 
      Promise.reject(new Error("Service error"))
    );

    await request
      .post("/api/hints")
      .send(taskData)
      .expect("Content-Type", /json/)
      .expect(500)
      .expect(res => {
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Failed to generate hint");
      });
  });
}); 