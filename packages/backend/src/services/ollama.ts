import { z } from 'zod';
import { OLLAMA_HOST } from '../config/models';
import { TaskResponse, taskResponseSchema } from '../types/task';
import { HintResponse, hintResponseSchema, DEFAULT_TYPE } from '../types/hints';

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

  private static validateHintResponse(response: unknown): HintResponse {
    return hintResponseSchema.parse(response);
  }

  public static async generateTask(model: string, prompt: string): Promise<TaskResponse> {
    const response = await this.generateCompletion(model, prompt);
    try {
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
        const validationErrors = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ).join(', ');
        throw new Error(`Invalid response format: ${validationErrors}`);
      }
      // Type guard for Error instances
      if (error instanceof Error) {
        throw new Error(`Failed to parse task response: ${error.message}`);
      }
      throw new Error('Failed to parse task response: Unknown error');
    }
  }

  public static async generateHint(model: string, prompt: string): Promise<HintResponse> {
    const response = await this.generateCompletion(model, prompt);
    try {
      // First try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      let parsedResponse;
      
      if (jsonMatch) {
        try {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } catch (e) {
          // If JSON parsing fails, create a structured response from the raw text
          parsedResponse = {
            hint: response.trim(),
            metadata: {
              type: DEFAULT_TYPE
            }
          };
        }
      } else {
        // If no JSON found, create a structured response from the raw text
        parsedResponse = {
          hint: response.trim(),
          metadata: {
            type: DEFAULT_TYPE
          }
        };
      }
      
      // Validate the parsed response using zod
      return this.validateHintResponse(parsedResponse);
    } catch (error) {
      console.error('Error parsing Ollama hint response:', error);
      if (error instanceof z.ZodError) {
        const validationErrors = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ).join(', ');
        throw new Error(`Invalid hint response format: ${validationErrors}`);
      }
      if (error instanceof Error) {
        throw new Error(`Failed to parse hint response: ${error.message}`);
      }
      throw new Error('Failed to parse hint response: Unknown error');
    }
  }
} 