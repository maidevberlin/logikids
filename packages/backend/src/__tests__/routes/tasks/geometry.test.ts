import { describe, expect, test } from "bun:test";
import supertest from "supertest";
import app from "../../../index";

describe("Geometry Routes", () => {
  const request = supertest(app);
  const operations = ["area", "perimeter", "circle"];

  operations.forEach(operation => {
    test(`GET /api/tasks/geometry/${operation} should return a valid ${operation} task`, async () => {
      const response = await request
        .get(`/api/tasks/geometry/${operation}`)
        .expect("Content-Type", /json/)
        .expect(200);
      
      const data = response.body;
      
      // Check the structure of the response
      expect(data).toHaveProperty("operation", operation);
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

  test("GET /api/tasks/geometry without operation should return a random task", async () => {
    const response = await request
      .get("/api/tasks/geometry")
      .expect("Content-Type", /json/)
      .expect(200);
    
    const data = response.body;
    expect(operations).toContain(data.operation);
  });

  test("GET /api/tasks/geometry/invalid should return 400", async () => {
    await request
      .get("/api/tasks/geometry/invalid")
      .expect("Content-Type", /json/)
      .expect(400)
      .expect(res => {
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toContain("Invalid operation");
      });
  });
}); 