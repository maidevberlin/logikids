import { OLLAMA_HOST } from '../config/models';
import { TaskResponse } from '../types/task';

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

  public static async generateTask(model: string, prompt: string): Promise<TaskResponse> {
    const response = await this.generateCompletion(model, prompt);
    try {
      // Extract the JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const parsedResponse = JSON.parse(jsonMatch[0]);
      return parsedResponse as TaskResponse;
    } catch (error) {
      console.error('Error parsing Ollama response:', error);
      throw new Error('Failed to parse task response');
    }
  }
} 