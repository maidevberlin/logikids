import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { Scenario, Enrichment, EnrichmentType } from './variation.types';

/**
 * Loads and manages task variation data from markdown files
 */
export class VariationLoader {
  private scenarios: Scenario[] = [];
  private framings: string[] = [];
  private dynamics: string[] = [];
  private temporalContexts: string[] = [];
  private metacognitivePrompts: string[] = [];
  private mysteryFramings: string[] = [];
  private realWorldConnections: string[] = [];
  private emotionalFramings: string[] = [];
  private structureVariations: string[] = [];

  private readonly variationsDir: string;

  constructor(variationsDir: string = path.join(process.cwd(), 'prompts', 'variations')) {
    this.variationsDir = variationsDir;
  }

  /**
   * Load all variation files
   */
  async loadAll(): Promise<void> {
    console.log('[VariationLoader] Loading variations from:', this.variationsDir);

    try {
      // Load each variation file
      this.scenarios = await this.loadScenarios();
      this.framings = await this.loadSimpleList('problem-framings.md', 'framings');
      this.dynamics = await this.loadSimpleList('character-dynamics.md', 'dynamics');
      this.temporalContexts = await this.loadSimpleList('temporal-contexts.md', 'contexts');
      this.metacognitivePrompts = await this.loadSimpleList('metacognitive-prompts.md', 'prompts');
      this.mysteryFramings = await this.loadSimpleList('mystery-framings.md', 'framings');
      this.realWorldConnections = await this.loadSimpleList('real-world-connections.md', 'connections');
      this.emotionalFramings = await this.loadSimpleList('emotional-framings.md', 'framings');
      this.structureVariations = await this.loadSimpleList('structure-variations.md', 'structures');

      console.log('[VariationLoader] Loaded variations:');
      console.log(`  - Scenarios: ${this.scenarios.length}`);
      console.log(`  - Problem Framings: ${this.framings.length}`);
      console.log(`  - Character Dynamics: ${this.dynamics.length}`);
      console.log(`  - Temporal Contexts: ${this.temporalContexts.length}`);
      console.log(`  - Metacognitive Prompts: ${this.metacognitivePrompts.length}`);
      console.log(`  - Mystery Framings: ${this.mysteryFramings.length}`);
      console.log(`  - Real-World Connections: ${this.realWorldConnections.length}`);
      console.log(`  - Emotional Framings: ${this.emotionalFramings.length}`);
      console.log(`  - Structure Variations: ${this.structureVariations.length}`);
    } catch (error) {
      console.error('[VariationLoader] Error loading variations:', error);
      throw error;
    }
  }

  /**
   * Load scenarios with age filtering
   */
  private async loadScenarios(): Promise<Scenario[]> {
    const filePath = path.join(this.variationsDir, 'scenarios.md');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    if (!data.scenarios || !Array.isArray(data.scenarios)) {
      throw new Error('Invalid scenarios.md format: missing scenarios array');
    }

    return data.scenarios;
  }

  /**
   * Load a simple list variation (framings, dynamics, etc.)
   */
  private async loadSimpleList(filename: string, key: string): Promise<string[]> {
    const filePath = path.join(this.variationsDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    if (!data[key] || !Array.isArray(data[key])) {
      throw new Error(`Invalid ${filename} format: missing ${key} array`);
    }

    return data[key];
  }

  /**
   * Get a random scenario, optionally filtered by age
   */
  getScenario(age?: number): string {
    if (this.scenarios.length === 0) {
      return 'a typical everyday situation';
    }

    // Filter by age if provided
    const eligible = age
      ? this.scenarios.filter(s => age >= s.minAge && age <= s.maxAge)
      : this.scenarios;

    if (eligible.length === 0) {
      // Fallback to all scenarios if no match
      return this.scenarios[Math.floor(Math.random() * this.scenarios.length)].context;
    }

    return eligible[Math.floor(Math.random() * eligible.length)].context;
  }

  /**
   * Get a random enrichment (30-50% chance)
   */
  getRandomEnrichment(): Enrichment | null {
    // 40% chance of enrichment
    if (Math.random() > 0.4) {
      return null;
    }

    // Pick random dimension
    const dimensions: { type: EnrichmentType; values: string[] }[] = [
      { type: 'framing', values: this.framings },
      { type: 'character', values: this.dynamics },
      { type: 'temporal', values: this.temporalContexts },
      { type: 'metacognitive', values: this.metacognitivePrompts },
      { type: 'mystery', values: this.mysteryFramings },
      { type: 'realWorld', values: this.realWorldConnections },
      { type: 'emotional', values: this.emotionalFramings },
      { type: 'structure', values: this.structureVariations },
    ];

    // Filter out empty dimensions
    const available = dimensions.filter(d => d.values.length > 0);

    if (available.length === 0) {
      return null;
    }

    // Pick random dimension and random value
    const chosen = available[Math.floor(Math.random() * available.length)];
    const value = chosen.values[Math.floor(Math.random() * chosen.values.length)];

    return {
      type: chosen.type,
      value,
    };
  }

  /**
   * Check if variations are loaded
   */
  isEmpty(): boolean {
    return this.scenarios.length === 0 &&
           this.framings.length === 0 &&
           this.dynamics.length === 0 &&
           this.temporalContexts.length === 0 &&
           this.metacognitivePrompts.length === 0 &&
           this.mysteryFramings.length === 0 &&
           this.realWorldConnections.length === 0 &&
           this.emotionalFramings.length === 0 &&
           this.structureVariations.length === 0;
  }
}
