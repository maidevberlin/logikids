import { describe, expect, test, beforeEach, mock } from "bun:test";
import supertest from "supertest";
import app from "../../../index";
import { TaskResponse } from "../../../types/task";
import "../../../__tests__/mocks/ollama.mock";

describe("Geometry Routes", () => {
  const request = supertest(app);

  beforeEach(() => {
    // Clear mock calls before each test
    (global.fetch as any).mockClear();
  });

  test("GET /api/tasks/geometry should return a valid task", async () => {
    const response = await request
      .get("/api/tasks/geometry")
      .expect("Content-Type", /json/)
      .expect(200);
    
    const data = response.body as TaskResponse;
    
    // Verify fetch was called for Ollama
    expect(global.fetch).toHaveBeenCalled();
    
    // Verify the response matches the TaskResponse schema
    expect(data).toHaveProperty("task");
    expect(typeof data.task).toBe("string");
    expect(data).toHaveProperty("solution");
    expect(typeof data.solution).toBe("number");
    
    // Check metadata structure
    expect(data.metadata).toHaveProperty("difficulty");
    expect(["easy", "medium", "hard"]).toContain(data.metadata.difficulty);
    expect(data.metadata).toHaveProperty("age");
    expect(data.metadata.age).toHaveProperty("min");
    expect(typeof data.metadata.age.min).toBe("number");
    expect(data.metadata.age).toHaveProperty("max");
    expect(typeof data.metadata.age.max).toBe("number");
    expect(data.metadata.age.min).toBeLessThanOrEqual(data.metadata.age.max);
    expect(data.metadata).toHaveProperty("estimatedTimeMinutes");
    expect(typeof data.metadata.estimatedTimeMinutes).toBe("number");
  });

  test("GET /api/tasks/geometry should handle service errors", async () => {
    // Mock fetch to simulate a service error
    (global.fetch as any).mockImplementationOnce(() => 
      Promise.reject(new Error("Service error"))
    );

    await request
      .get("/api/tasks/geometry")
      .expect("Content-Type", /json/)
      .expect(500)
      .expect(res => {
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Failed to generate geometry task");
      });
  });
}); 