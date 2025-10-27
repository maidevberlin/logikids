import { describe, it, expect } from "bun:test";
import { TemplateProcessor } from "../template";

describe("TemplateProcessor", () => {
  describe("replace", () => {
    it("should replace single placeholder", () => {
      const template = "Hello {{name}}";
      const result = TemplateProcessor.replace(template, { name: "Alice" });
      expect(result).toBe("Hello Alice");
    });

    it("should replace multiple placeholders", () => {
      const template = "{{name}} is {{age}} years old";
      const result = TemplateProcessor.replace(template, { name: "Bob", age: 12 });
      expect(result).toBe("Bob is 12 years old");
    });

    it("should replace all occurrences globally", () => {
      const template = "{{x}} + {{x}} = {{result}}";
      const result = TemplateProcessor.replace(template, { x: 5, result: 10 });
      expect(result).toBe("5 + 5 = 10");
    });

    it("should convert numbers to strings", () => {
      const template = "Grade {{grade}}";
      const result = TemplateProcessor.replace(template, { grade: 7 });
      expect(result).toBe("Grade 7");
    });

    it("should leave unreplaced placeholders as-is", () => {
      const template = "{{name}} {{age}}";
      const result = TemplateProcessor.replace(template, { name: "Alice" });
      expect(result).toBe("Alice {{age}}");
    });
  });

  describe("merge", () => {
    it("should merge multiple templates with newlines", () => {
      const templates = ["Subject: {{subject}}", "Grade: {{grade}}"];
      const result = TemplateProcessor.merge(templates, { subject: "Math", grade: 5 });
      expect(result).toBe("Subject: Math\n\nGrade: 5");
    });
  });

  describe("replaceScoped", () => {
    it("should only replace provided scoped variables", () => {
      const template = "{{name}} is {{age}} years old in {{city}}";
      const result = TemplateProcessor.replaceScoped(template, { name: "Alice", age: 10 });
      expect(result).toBe("Alice is 10 years old in {{city}}");
    });
  });

  describe("findRemainingPlaceholders", () => {
    it("should find no placeholders in fully replaced template", () => {
      const template = "Hello Alice, you are 12 years old";
      const remaining = TemplateProcessor.findRemainingPlaceholders(template);
      expect(remaining).toEqual([]);
    });

    it("should find all remaining placeholders", () => {
      const template = "{{name}} is {{age}} years old in {{city}}";
      const remaining = TemplateProcessor.findRemainingPlaceholders(template);
      expect(remaining).toEqual(["name", "age", "city"]);
    });

    it("should find duplicate placeholders once per occurrence", () => {
      const template = "{{x}} + {{x}} = {{result}}";
      const remaining = TemplateProcessor.findRemainingPlaceholders(template);
      expect(remaining).toEqual(["x", "x", "result"]);
    });
  });

  describe("validateNoPlaceholders", () => {
    it("should not throw when no placeholders remain", () => {
      const template = "Hello Alice";
      expect(() => {
        TemplateProcessor.validateNoPlaceholders(template, "test");
      }).not.toThrow();
    });

    it("should throw when placeholders remain", () => {
      const template = "Hello {{name}}";
      expect(() => {
        TemplateProcessor.validateNoPlaceholders(template, "test context");
      }).toThrow("Template validation failed in test context");
    });

    it("should list all remaining placeholders in error", () => {
      const template = "{{name}} is {{age}}";
      try {
        TemplateProcessor.validateNoPlaceholders(template, "test");
        expect.unreachable("Should have thrown");
      } catch (error: any) {
        expect(error.message).toContain("name");
        expect(error.message).toContain("age");
        expect(error.message).toContain("Found 2 unreplaced placeholder(s)");
      }
    });
  });
});
