import * as fs from 'fs'
import * as path from 'path'
import matter from 'gray-matter'
import { GradeFilteredItem, Enrichment, EnrichmentType, RawVariationItem } from './types'
import { badRequest } from '../../common/errors'

/**
 * Loads and manages task variation data from markdown files
 */
export class VariationLoader {
  private scenarios: GradeFilteredItem[] = []
  private framings: GradeFilteredItem[] = []
  private dynamics: GradeFilteredItem[] = []
  private temporalContexts: GradeFilteredItem[] = []
  private metacognitivePrompts: GradeFilteredItem[] = []
  private mysteryFramings: GradeFilteredItem[] = []
  private realWorldConnections: GradeFilteredItem[] = []
  private emotionalFramings: GradeFilteredItem[] = []
  private structureVariations: GradeFilteredItem[] = []

  private readonly variationsDir: string

  constructor(variationsDir: string = path.join(process.cwd(), 'prompts', 'variations')) {
    this.variationsDir = variationsDir
  }

  /**
   * Load all variation files
   */
  async loadAll(): Promise<void> {
    try {
      // Load each variation file
      this.scenarios = await this.loadGradeFilteredList('scenarios.md', 'scenarios')
      this.framings = await this.loadGradeFilteredList('problem-framings.md', 'framings')
      this.dynamics = await this.loadGradeFilteredList('character-dynamics.md', 'dynamics')
      this.temporalContexts = await this.loadGradeFilteredList('temporal-contexts.md', 'contexts')
      this.metacognitivePrompts = await this.loadGradeFilteredList(
        'metacognitive-prompts.md',
        'prompts'
      )
      this.mysteryFramings = await this.loadGradeFilteredList('mystery-framings.md', 'framings')
      this.realWorldConnections = await this.loadGradeFilteredList(
        'real-world-connections.md',
        'connections'
      )
      this.emotionalFramings = await this.loadGradeFilteredList('emotional-framings.md', 'framings')
      this.structureVariations = await this.loadGradeFilteredList(
        'structure-variations.md',
        'structures'
      )
    } catch (error) {
      throw error
    }
  }

  /**
   * Load grade-filtered list (unified loader for all variation types)
   */
  private async loadGradeFilteredList(filename: string, key: string): Promise<GradeFilteredItem[]> {
    const filePath = path.join(this.variationsDir, filename)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(fileContent)

    if (!data[key] || !Array.isArray(data[key])) {
      throw badRequest(`Invalid format in ${filename}: missing ${key} array`)
    }

    // Validate each item has grade property
    const rawItems = data[key] as RawVariationItem[]
    return rawItems.map((item: RawVariationItem, index: number) => {
      if (!item.grade || !Array.isArray(item.grade) || item.grade.length !== 2) {
        throw badRequest(
          `Invalid format in ${filename}: item ${index} missing grade array [min, max]`
        )
      }
      return {
        text: item.text,
        context: item.context,
        grade: item.grade,
      }
    })
  }

  /**
   * Get a random scenario, filtered by grade
   */
  getScenario(grade?: number): string {
    if (this.scenarios.length === 0) {
      return 'a typical everyday situation'
    }

    // Filter by grade if provided
    const eligible = grade
      ? this.scenarios.filter((s) => grade >= s.grade[0] && grade <= s.grade[1])
      : this.scenarios

    if (eligible.length === 0) {
      // Fallback to all scenarios if no match
      const fallback = this.scenarios[Math.floor(Math.random() * this.scenarios.length)]
      return fallback.context || fallback.text || 'a typical everyday situation'
    }

    const selected = eligible[Math.floor(Math.random() * eligible.length)]
    return selected.context || selected.text || 'a typical everyday situation'
  }

  /**
   * Get 2-3 random enrichments (75% chance of any enrichments), filtered by grade
   */
  getRandomEnrichments(grade?: number): Enrichment[] {
    // 75% chance of having enrichments
    if (Math.random() > 0.75) {
      return []
    }

    // Helper function to filter items by grade
    const filterByGrade = (items: GradeFilteredItem[]): GradeFilteredItem[] => {
      if (!grade) return items
      return items.filter((item) => grade >= item.grade[0] && grade <= item.grade[1])
    }

    // Build list of all available dimensions with grade filtering
    const dimensions: { type: EnrichmentType; values: GradeFilteredItem[] }[] = [
      { type: 'framing', values: filterByGrade(this.framings) },
      { type: 'character', values: filterByGrade(this.dynamics) },
      { type: 'temporal', values: filterByGrade(this.temporalContexts) },
      { type: 'metacognitive', values: filterByGrade(this.metacognitivePrompts) },
      { type: 'mystery', values: filterByGrade(this.mysteryFramings) },
      { type: 'realWorld', values: filterByGrade(this.realWorldConnections) },
      { type: 'emotional', values: filterByGrade(this.emotionalFramings) },
      { type: 'structure', values: filterByGrade(this.structureVariations) },
    ]

    // Filter out empty dimensions
    const available = dimensions.filter((d) => d.values.length > 0)

    if (available.length === 0) {
      return []
    }

    // Pick 2-3 random enrichments from different dimensions
    const count = Math.floor(Math.random() * 2) + 2 // 2 or 3
    const enrichments: Enrichment[] = []
    const usedDimensions = new Set<EnrichmentType>()

    // Shuffle available dimensions
    const shuffled = [...available].sort(() => Math.random() - 0.5)

    for (const dimension of shuffled) {
      if (enrichments.length >= count) break
      if (usedDimensions.has(dimension.type)) continue

      const selected = dimension.values[Math.floor(Math.random() * dimension.values.length)]
      const value = selected.text || selected.context || ''

      enrichments.push({
        type: dimension.type,
        value,
      })
      usedDimensions.add(dimension.type)
    }

    return enrichments
  }
}
