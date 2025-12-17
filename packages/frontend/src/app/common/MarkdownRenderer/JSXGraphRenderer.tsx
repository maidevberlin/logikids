import { useEffect, useRef, useState, useId } from 'react'
import { createLogger } from '@/app/common/logger'

const logger = createLogger('JSXGraphRenderer')

// JSXGraph config format - supports native JSXGraph API
interface JSXGraphConfig {
  // Board options (support both camelCase and lowercase)
  boundingBox?: [number, number, number, number]
  boundingbox?: [number, number, number, number]
  axis?: boolean
  grid?: boolean
  showNavigation?: boolean
  showCopyright?: boolean
  keepaspectratio?: boolean
  elements?: JSXGraphElement[]
}

interface JSXGraphElement {
  type: string
  // Native JSXGraph format: parents array with coordinates or references
  parents?: (string | number | [number, number] | [number, number, string])[]
  // Attributes object for styling (native format)
  attributes?: Record<string, unknown>
  // Alternative simplified format
  coords?: [number, number]
  points?: string[]
  id?: string
  name?: string
  label?: string
  text?: string
  color?: string
  strokeColor?: string
  fillColor?: string
  size?: number
  fixed?: boolean
  visible?: boolean
  fn?: string
  [key: string]: unknown
}

interface JSXGraphRendererProps {
  code: string
  onSvgClick?: (svg: string) => void
}

// Lazy load JSXGraph
let jsxgraphPromise: Promise<any> | null = null

async function getJSXGraph() {
  if (!jsxgraphPromise) {
    jsxgraphPromise = import('jsxgraph').then((mod) => mod.default || mod)
  }
  return jsxgraphPromise
}

export function JSXGraphRenderer({ code, onSvgClick }: JSXGraphRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<any>(null)
  const [error, setError] = useState<string | null>(null)
  const uniqueId = useId().replace(/:/g, '-')

  useEffect(() => {
    let cancelled = false

    const render = async () => {
      if (!containerRef.current) return

      try {
        const JXG = await getJSXGraph()
        if (cancelled) return

        // Parse the JSON config
        let config: JSXGraphConfig
        try {
          config = JSON.parse(code)
        } catch {
          throw new Error('Invalid JSON configuration')
        }

        // Clean up previous board
        if (boardRef.current) {
          JXG.JSXGraph.freeBoard(boardRef.current)
          boardRef.current = null
        }

        // Support both camelCase and lowercase boundingbox
        const bbox = config.boundingBox || config.boundingbox || [-5, 5, 5, -5]

        // Create the board
        const board = JXG.JSXGraph.initBoard(uniqueId, {
          boundingbox: bbox,
          axis: config.axis ?? false,
          grid: config.grid ?? true,
          showNavigation: config.showNavigation ?? false,
          showCopyright: config.showCopyright ?? false,
          keepaspectratio: config.keepaspectratio ?? true,
        })

        boardRef.current = board

        // Store created elements by name for reference
        const elements: Record<string, any> = {}

        // Create elements
        if (config.elements) {
          for (const el of config.elements) {
            try {
              let created: any

              // Merge attributes from both formats
              const attrs: Record<string, unknown> = {
                fixed: el.fixed ?? true,
                ...(el.attributes || {}),
              }

              // Handle simple format properties
              if (el.name && !attrs.name) attrs.name = el.name
              if (el.label && !attrs.name) attrs.name = el.label
              if (el.color && !attrs.strokeColor) attrs.strokeColor = el.color
              if (el.strokeColor) attrs.strokeColor = el.strokeColor
              if (el.fillColor) attrs.fillColor = el.fillColor
              if (el.size && !attrs.size) attrs.size = el.size

              // Resolve parents - can be coordinate arrays or element references
              const resolveParent = (p: any): any => {
                if (typeof p === 'string') {
                  return elements[p] || p
                }
                return p
              }

              const parents = el.parents?.map(resolveParent) || []

              switch (el.type) {
                case 'point':
                  // Support both formats: parents: [[x, y]] or coords: [x, y]
                  if (parents.length > 0 && Array.isArray(parents[0])) {
                    created = board.create('point', parents[0], attrs)
                  } else if (parents.length >= 2) {
                    created = board.create('point', [parents[0], parents[1]], attrs)
                  } else if (el.coords) {
                    created = board.create('point', el.coords, attrs)
                  }
                  break

                case 'line':
                case 'segment':
                  // Support parents: [[x1,y1], [x2,y2]] or points: ['A', 'B']
                  if (parents.length >= 2) {
                    created = board.create(el.type, parents, attrs)
                  } else if (el.points && el.points.length >= 2) {
                    const pts = el.points.map((name) => elements[name]).filter(Boolean)
                    if (pts.length >= 2) {
                      created = board.create(el.type, pts, attrs)
                    }
                  }
                  break

                case 'circle':
                  if (parents.length >= 2) {
                    created = board.create('circle', parents, attrs)
                  } else if (el.points && el.points.length >= 2) {
                    const center = elements[el.points[0]]
                    const radiusPoint = elements[el.points[1]]
                    if (center && radiusPoint) {
                      created = board.create('circle', [center, radiusPoint], attrs)
                    }
                  } else if (el.coords && el.size) {
                    created = board.create('circle', [el.coords, el.size], attrs)
                  }
                  break

                case 'polygon':
                  if (parents.length >= 3) {
                    created = board.create('polygon', parents, attrs)
                  } else if (el.points && el.points.length >= 3) {
                    const vertices = el.points.map((name) => elements[name]).filter(Boolean)
                    if (vertices.length >= 3) {
                      created = board.create('polygon', vertices, attrs)
                    }
                  }
                  break

                case 'angle':
                  if (parents.length >= 3) {
                    created = board.create('angle', parents, attrs)
                  } else if (el.points && el.points.length >= 3) {
                    const [p1, p2, p3] = el.points.map((name) => elements[name])
                    if (p1 && p2 && p3) {
                      created = board.create('angle', [p1, p2, p3], {
                        ...attrs,
                        radius: el.size || attrs.radius || 1,
                      })
                    }
                  }
                  break

                case 'text':
                  // Support multiple formats:
                  // 1. parents: [x, y, "text"]
                  // 2. coords: [x, y] + text: "content"
                  // 3. parents: [x, y] + text in attributes
                  if (parents.length >= 3) {
                    created = board.create('text', parents, attrs)
                  } else if (el.coords && el.text) {
                    created = board.create('text', [...el.coords, el.text], attrs)
                  } else if (parents.length >= 2 && (el.text || attrs.name)) {
                    created = board.create('text', [...parents, el.text || attrs.name], attrs)
                  }
                  break

                case 'functiongraph':
                  if (el.fn) {
                    const fn = new Function('x', `return ${el.fn}`)
                    created = board.create('functiongraph', [fn], attrs)
                  } else if (parents.length > 0 && typeof parents[0] === 'string') {
                    const fn = new Function('x', `return ${parents[0]}`)
                    created = board.create('functiongraph', [fn], attrs)
                  }
                  break

                default:
                  // Generic element creation - let JSXGraph handle it
                  if (parents.length > 0) {
                    created = board.create(el.type, parents, attrs)
                  }
                  break
              }

              // Store by name or id if available
              if (created) {
                const name = el.name || el.id || (attrs.name as string)
                if (name) {
                  elements[name] = created
                }
              }
            } catch (elErr) {
              logger.warn(`Failed to create element: ${el.type}`, {
                error: elErr instanceof Error ? elErr.message : String(elErr),
              })
            }
          }
        }

        setError(null)
      } catch (err) {
        if (cancelled) return
        logger.error('JSXGraph rendering error', err as Error)
        setError(err instanceof Error ? err.message : 'Rendering failed')
      }
    }

    void render()

    return () => {
      cancelled = true
      if (boardRef.current) {
        try {
          import('jsxgraph').then((JXG) => {
            const mod = JXG.default || JXG
            mod.JSXGraph.freeBoard(boardRef.current)
          })
        } catch {
          // Ignore cleanup errors
        }
      }
    }
  }, [code, uniqueId])

  const handleClick = () => {
    if (containerRef.current && onSvgClick) {
      const svg = containerRef.current.querySelector('svg')
      if (svg) {
        onSvgClick(new XMLSerializer().serializeToString(svg))
      }
    }
  }

  if (error) {
    return (
      <div className="flex justify-center my-4 p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="text-red-600 text-sm">
          <strong>JSXGraph error:</strong> {error}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center my-4">
      <div
        ref={containerRef}
        className="bg-white rounded-lg cursor-pointer hover:shadow-lg transition-shadow p-2"
        onClick={handleClick}
        title="Click to enlarge"
      >
        <div id={uniqueId} style={{ width: '400px', height: '400px' }} className="jxgbox" />
      </div>
    </div>
  )
}
