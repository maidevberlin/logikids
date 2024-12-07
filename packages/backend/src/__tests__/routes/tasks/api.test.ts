import { describe, expect, test } from "bun:test";
import supertest from "supertest";
import app from "../../../index";

describe("General API behavior", () => {
  const request = supertest(app);

  test("GET /api/tasks should return 404", async () => {
    await request
      .get("/api/tasks")
      .expect(404);
  });

  test("POST /api/tasks/arithmetic should return 404 (method not allowed)", async () => {
    await request
      .post("/api/tasks/arithmetic")
      .expect(404);
  });

  test("POST /api/tasks/geometry should return 404 (method not allowed)", async () => {
    await request
      .post("/api/tasks/geometry")
      .expect(404);
  });

  test("Non-existent routes should return 404", async () => {
    await request
      .get("/api/non-existent")
      .expect(404);
  });
}); 