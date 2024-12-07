import { describe, expect, test, beforeEach } from "bun:test";
import supertest from "supertest";
import app from "../../../index";

describe("Arithmetic Routes", () => {
  const request = supertest(app);
  const operations = ["addition", "subtraction", "multiplication", "division"];

  beforeEach(() => {
    // Clear mock calls before each test
    (global.fetch as any).mockClear();
  });

  operations.forEach(operation => {
    test(`GET /api/tasks/arithmetic/${operation} should return a valid ${operation} task`, async () => {
      const response = await request
        .get(`/api/tasks/arithmetic/${operation}`)
        .expect("Content-Type", /json/)
        .expect(200);
      
      const data = response.body;
      
      // Verify fetch was called
      expect(global.fetch).toHaveBeenCalled();
      
      // Check the structure of the response
      expect(data).toHaveProperty("operation");
      expect(operations).toContain(data.operation);
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
  });

  test("GET /api/tasks/arithmetic without operation should return a random task", async () => {
    const response = await request
      .get("/api/tasks/arithmetic")
      .expect("Content-Type", /json/)
      .expect(200);
    
    const data = response.body;
    expect(operations).toContain(data.operation);
    expect(global.fetch).toHaveBeenCalled();
  });

  test("GET /api/tasks/arithmetic/invalid should return 400", async () => {
    await request
      .get("/api/tasks/arithmetic/invalid")
      .expect("Content-Type", /json/)
      .expect(400)
      .expect(res => {
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toContain("Invalid operation");
      });
    
    // Verify fetch was not called for invalid operations
    expect(global.fetch).not.toHaveBeenCalled();
  });
}); 