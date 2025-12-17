import { useEffect, useState, useRef } from 'react'
import { createLogger } from '@/app/common/logger'

const logger = createLogger('GraphvizRenderer')

interface GraphvizRendererProps {
  code: string
  onSvgClick?: (svg: string) => void
}

// Lazy load the Graphviz WASM module
let graphvizPromise: Promise<any> | null = null

async function getGraphviz() {
  if (!graphvizPromise) {
    graphvizPromise = import('@hpcc-js/wasm').then(async (mod) => {
      const graphviz = await mod.Graphviz.load()
      return graphviz
    })
  }
  return graphvizPromise
}

export function GraphvizRenderer({ code, onSvgClick }: GraphvizRendererProps) {
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false

    const render = async () => {
      try {
        const graphviz = await getGraphviz()
        if (cancelled) return

        const result = graphviz.dot(code)
        if (cancelled) return

        setSvg(result)
        setError(null)
      } catch (err) {
        if (cancelled) return
        logger.error('Graphviz rendering error', err as Error)
        setError(err instanceof Error ? err.message : 'Rendering failed')
      }
    }

    void render()

    return () => {
      cancelled = true
    }
  }, [code])

  if (error) {
    return (
      <div className="flex justify-center my-4 p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="text-red-600 text-sm">
          <strong>Graphviz error:</strong> {error}
        </div>
      </div>
    )
  }

  if (!svg) {
    return (
      <div className="flex justify-center my-4 p-4 bg-gray-50 rounded-lg animate-pulse">
        <div className="text-gray-400">Loading graph...</div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex justify-center my-4 p-4 bg-white rounded-lg cursor-pointer hover:shadow-lg transition-shadow [&_svg]:max-w-full [&_svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
      onClick={() => onSvgClick?.(svg)}
      title="Click to enlarge"
    />
  )
}
