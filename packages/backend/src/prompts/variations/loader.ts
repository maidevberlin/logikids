import * as fs from 'fs'
import * as path from 'path'
import matter from 'gray-matter'
import { GradeFilteredItem, Enrichment, EnrichmentType, RawVariationItem } from './types'
import { badRequest } from '../../common/errors'

/**
 * Loads and manages task variation data from markdown files
 */
export class VariationLoader {
  private metacognitivePrompts: GradeFilteredItem[] = []
  private structureVariations: GradeFilteredItem[] = []

  private readonly variationsDir: string

  constructor(variationsDir: string = path.join(process.cwd(), 'prompts', 'variations')) {
    this.variationsDir = variationsDir
  }

  /**
   * Load all variation files
   */
  async loadAll(): Promise<void> {
    this.metacognitivePrompts = await this.loadGradeFilteredList(
      'metacognitive-prompts.md',
      'prompts'
    )
    this.structureVariations = await this.loadGradeFilteredList(
      'structure-variations.md',
      'structures'
    )
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
   * Get 1-2 random enrichments, filtered by grade
   * Always returns at least one enrichment (metacognitive or structure)
   */
  getRandomEnrichments(grade?: number): Enrichment[] {
    // Helper function to filter items by grade
    const filterByGrade = (items: GradeFilteredItem[]): GradeFilteredItem[] => {
      if (!grade) return items
      return items.filter((item) => grade >= item.grade[0] && grade <= item.grade[1])
    }

    // Build list of available dimensions with grade filtering
    const dimensions: { type: EnrichmentType; values: GradeFilteredItem[] }[] = [
      { type: 'metacognitive', values: filterByGrade(this.metacognitivePrompts) },
      { type: 'structure', values: filterByGrade(this.structureVariations) },
    ]

    // Filter out empty dimensions
    const available = dimensions.filter((d) => d.values.length > 0)

    if (available.length === 0) {
      return []
    }

    // Pick 1 or 2 enrichments (50% chance each)
    const count = Math.random() < 0.5 ? 1 : 2
    const enrichments: Enrichment[] = []

    // Shuffle available dimensions
    const shuffled = [...available].sort(() => Math.random() - 0.5)

    for (const dimension of shuffled) {
      if (enrichments.length >= count) break

      const selected = dimension.values[Math.floor(Math.random() * dimension.values.length)]
      const value = selected.text || ''

      enrichments.push({
        type: dimension.type,
        value,
      })
    }

    return enrichments
  }
}
