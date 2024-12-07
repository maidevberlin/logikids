import { z } from 'zod';
import { OLLAMA_HOST } from '../config/models';
import { TaskResponse } from '../types/task';

// Define the schema at module level
const taskResponseSchema = z.object({
  task: z.string(),
  solution: z.number(),
  metadata: z.object({
    difficulty: z.enum(['easy', 'medium', 'hard']),
    age: z.object({
      min: z.number(),
      max: z.number(),
    }),
    estimatedTimeMinutes: z.number(),
  }),
});

export class OllamaService {
  private static async generateCompletion(model: string, prompt: string): Promise<string> {
    try {
      const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error calling Ollama:', error);
      throw new Error('Failed to generate task using Ollama');
    }
  }

  private static validateTaskResponse(response: unknown): TaskResponse {
    return taskResponseSchema.parse(response);
  }

  public static async generateTask(model: string, prompt: string): Promise<TaskResponse> {
    const response = await this.generateCompletion(model, prompt);
    try {
      // Log the raw response for debugging
      console.log('Raw Ollama response:', response);

      // Extract the JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('Full response that failed to match:', response);
        throw new Error('No valid JSON found in response');
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      // Validate the parsed response using zod
      return this.validateTaskResponse(parsedResponse);
    } catch (error) {
      console.error('Error parsing Ollama response:', error);
      if (error instanceof z.ZodError) {
        // Provide more detailed validation errors
        const validationErrors = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ).join(', ');
        throw new Error(`Invalid response format: ${validationErrors}`);
      }
      throw new Error(`Failed to parse task response: ${error.message}`);
    }
  }
} 