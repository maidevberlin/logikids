import { describe, expect, test, beforeEach } from "bun:test";
import supertest from "supertest";
import app from "../../../index";
import { TaskResponse } from "../../../types/task";
import { Type } from "../../../types/hints";

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

    // Mock successful Ollama response
    (global.fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          response: JSON.stringify({
            hint: "Denke an die Grundrechenarten. Was machst du, wenn du zwei Zahlen zusammenfügst?",
            metadata: {
              type: "conceptual"
            }
          })
        })
      })
    );

    const response = await request
      .post("/api/hints")
      .send(taskData)
      .expect("Content-Type", /json/)
      .expect(200);

    const data = response.body;
    
    // Verify the hint response structure
    expect(data).toHaveProperty("hint");
    expect(typeof data.hint).toBe("string");
    expect(data).toHaveProperty("metadata");
    expect(data.metadata).toHaveProperty("type");
    expect(["conceptual", "procedural", "strategic"] as Type[]).toContain(data.metadata.type);
    
    expect(global.fetch).toHaveBeenCalled();
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