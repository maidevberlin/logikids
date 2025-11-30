import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import {AgeFilteredItem, Enrichment, EnrichmentType, RawVariationItem} from './types.ts';
import {createLogger} from '../../common/logger.ts';
import {InvalidFormatError} from '../../common/errors.ts';

const logger = createLogger('VariationLoader');

/**
 * Loads and manages task variation data from markdown files
 */
export class VariationLoader {
  private scenarios: AgeFilteredItem[] = [];
  private framings: AgeFilteredItem[] = [];
  private dynamics: AgeFilteredItem[] = [];
  private temporalContexts: AgeFilteredItem[] = [];
  private metacognitivePrompts: AgeFilteredItem[] = [];
  private mysteryFramings: AgeFilteredItem[] = [];
  private realWorldConnections: AgeFilteredItem[] = [];
  private emotionalFramings: AgeFilteredItem[] = [];
  private structureVariations: AgeFilteredItem[] = [];

  private readonly variationsDir: string;

  constructor(variationsDir: string = path.join(process.cwd(), 'prompts', 'variations')) {
    this.variationsDir = variationsDir;
  }

  /**
   * Load all variation files
   */
  async loadAll(): Promise<void> {
    logger.info('Loading variations from', { variationsDir: this.variationsDir });

    try {
      // Load each variation file
      this.scenarios = await this.loadAgeFilteredList('scenarios.md', 'scenarios');
      this.framings = await this.loadAgeFilteredList('problem-framings.md', 'framings');
      this.dynamics = await this.loadAgeFilteredList('character-dynamics.md', 'dynamics');
      this.temporalContexts = await this.loadAgeFilteredList('temporal-contexts.md', 'contexts');
      this.metacognitivePrompts = await this.loadAgeFilteredList('metacognitive-prompts.md', 'prompts');
      this.mysteryFramings = await this.loadAgeFilteredList('mystery-framings.md', 'framings');
      this.realWorldConnections = await this.loadAgeFilteredList('real-world-connections.md', 'connections');
      this.emotionalFramings = await this.loadAgeFilteredList('emotional-framings.md', 'framings');
      this.structureVariations = await this.loadAgeFilteredList('structure-variations.md', 'structures');

      logger.info('Loaded variations', {
        scenarios: this.scenarios.length,
        problemFramings: this.framings.length,
        characterDynamics: this.dynamics.length,
        temporalContexts: this.temporalContexts.length,
        metacognitivePrompts: this.metacognitivePrompts.length,
        mysteryFramings: this.mysteryFramings.length,
        realWorldConnections: this.realWorldConnections.length,
        emotionalFramings: this.emotionalFramings.length,
        structureVariations: this.structureVariations.length
      });
    } catch (error) {
      logger.error('Error loading variations', error);
      throw error;
    }
  }

  /**
   * Load age-filtered list (unified loader for all variation types)
   */
  private async loadAgeFilteredList(filename: string, key: string): Promise<AgeFilteredItem[]> {
    const filePath = path.join(this.variationsDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    if (!data[key] || !Array.isArray(data[key])) {
      throw new InvalidFormatError(filename, `missing ${key} array`);
    }

    // Validate each item has age property
    const rawItems = data[key] as RawVariationItem[];
      return rawItems.map((item: RawVariationItem, index: number) => {
        if (!item.age || !Array.isArray(item.age) || item.age.length !== 2) {
            throw new InvalidFormatError(filename, `item ${index} missing age array [min, max]`);
        }
        return {
            text: item.text,
            context: item.context,
            age: item.age,
        };
    });
  }

  /**
   * Get a random scenario, filtered by age
   */
  getScenario(age?: number): string {
    if (this.scenarios.length === 0) {
      return 'a typical everyday situation';
    }

    // Filter by age if provided
    const eligible = age
      ? this.scenarios.filter(s => age >= s.age[0] && age <= s.age[1])
      : this.scenarios;

    if (eligible.length === 0) {
      // Fallback to all scenarios if no match
      const fallback = this.scenarios[Math.floor(Math.random() * this.scenarios.length)];
      return fallback.context || fallback.text || 'a typical everyday situation';
    }

    const selected = eligible[Math.floor(Math.random() * eligible.length)];
    return selected.context || selected.text || 'a typical everyday situation';
  }

  /**
   * Get 2-3 random enrichments (75% chance of any enrichments), filtered by age
   */
  getRandomEnrichments(age?: number): Enrichment[] {
    // 75% chance of having enrichments
    if (Math.random() > 0.75) {
      return [];
    }

    // Helper function to filter items by age
    const filterByAge = (items: AgeFilteredItem[]): AgeFilteredItem[] => {
      if (!age) return items;
      return items.filter(item => age >= item.age[0] && age <= item.age[1]);
    };

    // Build list of all available dimensions with age filtering
    const dimensions: { type: EnrichmentType; values: AgeFilteredItem[] }[] = [
      { type: 'framing', values: filterByAge(this.framings) },
      { type: 'character', values: filterByAge(this.dynamics) },
      { type: 'temporal', values: filterByAge(this.temporalContexts) },
      { type: 'metacognitive', values: filterByAge(this.metacognitivePrompts) },
      { type: 'mystery', values: filterByAge(this.mysteryFramings) },
      { type: 'realWorld', values: filterByAge(this.realWorldConnections) },
      { type: 'emotional', values: filterByAge(this.emotionalFramings) },
      { type: 'structure', values: filterByAge(this.structureVariations) },
    ];

    // Filter out empty dimensions
    const available = dimensions.filter(d => d.values.length > 0);

    if (available.length === 0) {
      return [];
    }

    // Pick 2-3 random enrichments from different dimensions
    const count = Math.floor(Math.random() * 2) + 2; // 2 or 3
    const enrichments: Enrichment[] = [];
    const usedDimensions = new Set<EnrichmentType>();

    // Shuffle available dimensions
    const shuffled = [...available].sort(() => Math.random() - 0.5);

    for (const dimension of shuffled) {
      if (enrichments.length >= count) break;
      if (usedDimensions.has(dimension.type)) continue;

      const selected = dimension.values[Math.floor(Math.random() * dimension.values.length)];
      const value = selected.text || selected.context || '';

      enrichments.push({
        type: dimension.type,
        value,
      });
      usedDimensions.add(dimension.type);
    }

    return enrichments;
  }
}
