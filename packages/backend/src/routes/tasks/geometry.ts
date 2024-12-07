import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { OllamaService } from '../../services/ollama';

const router = Router();

// Cache for prompts
let geometryPrompts: Record<string, { prompt: string; model: string }> | null = null;

async function loadPrompts() {
  if (!geometryPrompts) {
    const promptsPath = path.join(process.cwd(), 'src', 'prompts', 'tasks', 'geometry', 'prompts.json');
    const content = await fs.readFile(promptsPath, 'utf-8');
    geometryPrompts = JSON.parse(content) as Record<string, { prompt: string; model: string }>;
  }
  return geometryPrompts!;
}

// GET /:type?
router.get('/:type?', async (req, res) => {
  try {
    const prompts = await loadPrompts();
    const types = Object.keys(prompts);
    
    const requestedType = req.params.type;
    if (requestedType && !types.includes(requestedType)) {
      return res.status(400).json({
        error: `Invalid geometry type. Available types: ${types.join(', ')}`
      });
    }

    const type = requestedType || types[Math.floor(Math.random() * types.length)];
    const { prompt, model } = prompts[type];

    const task = await OllamaService.generateTask(model, prompt);
    res.json({
      type,
      ...task
    });
  } catch (error) {
    console.error('Error generating geometry task:', error);
    res.status(500).json({ error: 'Failed to generate geometry task' });
  }
});

export default router; 