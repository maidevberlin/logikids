import { useRef } from 'react'
import { Mafs, Coordinates, Plot, Point, Vector, Line, Circle, Polygon, Text } from 'mafs'
import 'mafs/core.css'
import { createLogger } from '@/app/common/logger'

const logger = createLogger('MafsRenderer')

// Mafs config format
interface MafsConfig {
  viewBox?: { x: [number, number]; y: [number, number] }
  preserveAspectRatio?: boolean
  pan?: boolean
  zoom?: boolean
  elements?: MafsElement[]
}

interface MafsElement {
  type: string
  fn?: string
  coords?: [number, number]
  points?: [number, number][]
  from?: [number, number]
  to?: [number, number]
  center?: [number, number]
  radius?: number
  label?: string
  color?: string
  opacity?: number
  weight?: number
  style?: 'solid' | 'dashed'
}

interface MafsRendererProps {
  code: string
  onSvgClick?: (svg: string) => void
}

export function MafsRenderer({ code, onSvgClick }: MafsRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  let config: MafsConfig
  try {
    config = JSON.parse(code)
  } catch {
    return (
      <div className="flex justify-center my-4 p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="text-red-600 text-sm">
          <strong>Mafs error:</strong> Invalid JSON configuration
        </div>
      </div>
    )
  }

  const handleClick = () => {
    if (containerRef.current && onSvgClick) {
      const svg = containerRef.current.querySelector('svg')
      if (svg) {
        onSvgClick(new XMLSerializer().serializeToString(svg))
      }
    }
  }

  // Render elements
  const renderElements = () => {
    if (!config.elements) return null

    return config.elements.map((el, index) => {
      const key = `mafs-el-${index}`

      try {
        switch (el.type) {
          case 'function':
            if (!el.fn) return null
            // Create a safe function from the string expression
            const fn = new Function('x', `return ${el.fn}`) as (x: number) => number
            return (
              <Plot.OfX
                key={key}
                y={fn}
                color={el.color}
                opacity={el.opacity}
                weight={el.weight}
                style={el.style}
              />
            )

          case 'point':
            if (!el.coords) return null
            return <Point key={key} x={el.coords[0]} y={el.coords[1]} color={el.color} />

          case 'vector':
            if (!el.from || !el.to) return null
            return (
              <Vector key={key} tail={el.from} tip={el.to} color={el.color} weight={el.weight} />
            )

          case 'line':
            if (el.from && el.to) {
              return (
                <Line.Segment
                  key={key}
                  point1={el.from}
                  point2={el.to}
                  color={el.color}
                  weight={el.weight}
                  style={el.style}
                />
              )
            }
            return null

          case 'circle':
            if (!el.center || !el.radius) return null
            return (
              <Circle
                key={key}
                center={el.center}
                radius={el.radius}
                color={el.color}
                weight={el.weight}
                fillOpacity={el.opacity}
                strokeStyle={el.style}
              />
            )

          case 'polygon':
            if (!el.points || el.points.length < 3) return null
            return (
              <Polygon
                key={key}
                points={el.points}
                color={el.color}
                weight={el.weight}
                fillOpacity={el.opacity}
              />
            )

          case 'text':
            if (!el.coords || !el.label) return null
            return (
              <Text key={key} x={el.coords[0]} y={el.coords[1]} color={el.color}>
                {el.label}
              </Text>
            )

          default:
            logger.warn(`Unknown Mafs element type: ${el.type}`)
            return null
        }
      } catch (err) {
        logger.warn(`Failed to render Mafs element: ${el.type}`, {
          error: err instanceof Error ? err.message : String(err),
        })
        return null
      }
    })
  }

  return (
    <div className="flex justify-center my-4">
      <div
        ref={containerRef}
        className="bg-white rounded-lg cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
        onClick={handleClick}
        title="Click to enlarge"
        style={{ width: '500px', height: '400px' }}
      >
        <Mafs
          viewBox={config.viewBox}
          preserveAspectRatio={config.preserveAspectRatio === false ? false : 'contain'}
          pan={config.pan ?? false}
          zoom={config.zoom ?? false}
        >
          <Coordinates.Cartesian />
          {renderElements()}
        </Mafs>
      </div>
    </div>
  )
}
