import { describe, expect, test, beforeAll } from "bun:test";
import './mocks/ollama.mock';

beforeAll(() => {
  // Any global test setup can go here
});

describe("Test Setup", () => {
    test("should verify test environment is working", () => {
        expect(1 + 1).toBe(2);
    });

    test("should verify async operations work", async () => {
        const result = await Promise.resolve(42);
        expect(result).toBe(42);
    });

    test("should verify environment variables", () => {
        expect(process.env.NODE_ENV).toBe("test");
    });
}); 