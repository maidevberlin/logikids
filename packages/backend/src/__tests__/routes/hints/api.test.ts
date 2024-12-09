import { describe, expect, test } from "bun:test";
import supertest from "supertest";
import app from "../../../index";

describe("General Hints API behavior", () => {
  const request = supertest(app);

  test("GET /api/hints should return 404 (method not allowed)", async () => {
    await request
      .get("/api/hints")
      .expect(404);
  });

  test("PUT /api/hints should return 404 (method not allowed)", async () => {
    await request
      .put("/api/hints")
      .expect(404);
  });

  test("DELETE /api/hints should return 404 (method not allowed)", async () => {
    await request
      .delete("/api/hints")
      .expect(404);
  });

  test("Non-existent routes should return 404", async () => {
    await request
      .get("/api/hints/nonexistent")
      .expect(404);
  });
}); 