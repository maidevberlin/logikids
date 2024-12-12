import { TaskResponse } from '../../types/task';
import { BaseVisualizationService } from '../../services/vis/base-vis.service';
import { AIClient } from '../../services/ai/base';
import { join } from 'path';
import Mustache from 'mustache';

export class ArithmeticVisualizationService extends BaseVisualizationService {
  constructor(aiClient: AIClient) {
    super(aiClient, join(__dirname, 'prompt.yaml'));
  }

  protected generatePrompt(task: TaskResponse): string {
    return Mustache.render(this.prompts.visualization.base, {
      task: task.task,
      solution: task.solution,
      difficulty: task.metadata.difficulty,
      age: `${task.metadata.age.min}-${task.metadata.age.max}`
    });
  }
} 