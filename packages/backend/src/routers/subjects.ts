import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { subjectRegistry } from '../subjects/registry';

/**
 * Subjects router - list subjects only (no concepts here, use concepts router)
 */
export const subjectsRouter = router({
  /**
   * Get all subjects with optional filtering by grade/difficulty
   */
  getAll: protectedProcedure
    .input(
      z.object({
        grade: z.number().int().min(1).max(13).optional(),
        difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
        language: z.string().min(2).max(5).optional(),
      })
    )
    .query(({ input }) => {
      const subjects = subjectRegistry.getAll().map((subject) => {
        const metadata = subjectRegistry.getConceptMetadata(subject.id);

        // If grade filtering is active, return filtered concepts with full details
        if (input.grade !== undefined) {
          const filteredConcepts = subjectRegistry.getConcepts(subject.id, {
            grade: input.grade,
            difficulty: input.difficulty,
          });

          return {
            id: subject.id,
            name: subject.name,
            description: subject.description,
            conceptCount: metadata.conceptCount,
            minGrade: metadata.minGrade,
            maxGrade: metadata.maxGrade,
            concepts: filteredConcepts.map((concept) => ({
              id: concept.id,
              name: concept.name,
              description: concept.description,
              grade: concept.grade,
              difficulty: concept.difficulty,
              source: concept.source,
              focus: concept.focus,
              learning_objectives: concept.learning_objectives,
            })),
          };
        }

        // Otherwise return all concepts without filtering
        const allConcepts = subjectRegistry.getConcepts(subject.id);

        return {
          id: subject.id,
          name: subject.name,
          description: subject.description,
          conceptCount: metadata.conceptCount,
          minGrade: metadata.minGrade,
          maxGrade: metadata.maxGrade,
          concepts: allConcepts.map((concept) => ({
            id: concept.id,
            name: concept.name,
            description: concept.description,
            grade: concept.grade,
            difficulty: concept.difficulty,
            source: concept.source,
            focus: concept.focus,
            learning_objectives: concept.learning_objectives,
          })),
        };
      });

      // Filter out subjects with no concepts if grade filtering is active
      const filteredSubjects =
        input.grade !== undefined ? subjects.filter((s) => s.concepts && s.concepts.length > 0) : subjects;

      return { subjects: filteredSubjects };
    }),
});
