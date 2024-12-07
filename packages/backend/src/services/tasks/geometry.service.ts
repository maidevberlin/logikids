import fs from 'fs/promises';
import path from 'path';
import { OllamaService } from '../ollama';

export class GeometryService {
  private geometryPrompts: Record<string, { prompt: string; model: string }> | null = null;

  private async loadPrompts() {
    if (!this.geometryPrompts) {
      const promptsPath = path.join(process.cwd(), 'src', 'prompts', 'tasks', 'geometry', 'prompts.json');
      const content = await fs.readFile(promptsPath, 'utf-8');
      this.geometryPrompts = JSON.parse(content) as Record<string, { prompt: string; model: string }>;
    }
    return this.geometryPrompts;
  }

  async generateTask(requestedType?: string) {
    const prompts = await this.loadPrompts();
    const taskTypes = Object.keys(prompts).filter(type => type !== 'general');
    
    console.log('Available task types:', taskTypes);
    console.log('Requested type:', requestedType);

    if (requestedType && !taskTypes.includes(requestedType)) {
      throw new Error(`Invalid task type. Available types: ${taskTypes.join(', ')}`);
    }

    const taskType = requestedType || taskTypes[Math.floor(Math.random() * taskTypes.length)];
    const { prompt, model } = prompts[taskType];

    console.log('Selected task type:', taskType);
    console.log('General prompt:', prompts.general.prompt);
    console.log('Task-specific prompt:', prompt);

    // Combine the general prompt with the specific task prompt
    const fullPrompt = `${prompts.general.prompt}\n\nNow, please ${prompt}`;
    
    console.log('Full combined prompt:', fullPrompt);
    console.log('Using model:', model);

    const task = await OllamaService.generateTask(model, fullPrompt);
    
    console.log('Generated task:', task);
    
    return {
      type: taskType,
      ...task
    };
  }
} 