import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { AI_MODELS } from '../../config/models';
import { OllamaService } from '../../services/ollama';
import { ArithmeticOperation } from '../../types/task';

const router = Router();

// Cache for prompts
let arithmeticPrompts: Record<string, { prompt: string; model: string }> | null = null;

async function loadPrompts() {
  if (!arithmeticPrompts) {
    const promptsPath = path.join(process.cwd(), 'src', 'prompts', 'tasks', 'arithmetic', 'prompts.json');
    const content = await fs.readFile(promptsPath, 'utf-8');
    arithmeticPrompts = JSON.parse(content) as Record<string, { prompt: string; model: string }>;
  }
  return arithmeticPrompts!;
}

// GET /:operation?
router.get('/:operation?', async (req, res) => {
  try {
    const prompts = await loadPrompts();
    const operations = Object.keys(prompts!) as ArithmeticOperation[];
    
    // If operation is specified, validate it
    const requestedOperation = req.params.operation as ArithmeticOperation | undefined;
    if (requestedOperation && !operations.includes(requestedOperation)) {
      return res.status(400).json({
        error: `Invalid operation. Available operations: ${operations.join(', ')}`
      });
    }

    // Select random operation if none specified
    const operation = requestedOperation || operations[Math.floor(Math.random() * operations.length)];
    const { prompt, model } = prompts[operation];

    const task = await OllamaService.generateTask(model, prompt);
    res.json({
      operation,
      ...task
    });
  } catch (error) {
    console.error('Error generating arithmetic task:', error);
    res.status(500).json({ error: 'Failed to generate arithmetic task' });
  }
});

export default router; 