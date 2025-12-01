import { memo, useEffect, useRef, useState } from 'react'
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import mermaid from 'mermaid'
import 'katex/dist/katex.min.css'
import { createLogger } from '@/lib/logger'

const logger = createLogger('MarkdownRenderer')

interface MarkdownRendererProps {
  content: string
  enableMath?: boolean
  enableMermaid?: boolean
  enableCode?: boolean
  className?: string
  noParagraphMargin?: boolean
}

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'strict',
})

function MarkdownRendererComponent({
  content,
  enableMath = true,
  enableMermaid = true,
  enableCode = true,
  className = '',
  noParagraphMargin = false,
}: MarkdownRendererProps) {
  const mermaidRef = useRef<HTMLDivElement>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxContent, setLightboxContent] = useState<
    { type: 'svg'; content: string } | { type: 'image'; src: string; alt: string } | null
  >(null)

  // Fix: Normalize LaTeX - convert double backslashes to single within math delimiters
  // This handles inconsistent escaping from the AI
  const normalizedContent = content.replace(/(\$+)([^$]+)\1/g, (_match, delim, mathContent) => {
    // Within math delimiters, convert \\ to \ for LaTeX commands
    const normalized = mathContent.replace(/\\\\(?=\w)/g, '\\')
    return delim + normalized + delim
  })

  // Handle lightbox
  const openLightboxSvg = (svgContent: string) => {
    setLightboxContent({ type: 'svg', content: svgContent })
    setLightboxOpen(true)
  }

  const openLightboxImage = (src: string, alt: string) => {
    setLightboxContent({ type: 'image', src, alt })
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setLightboxContent(null)
  }

  // Handle ESC key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxOpen) {
        closeLightbox()
      }
    }

    if (lightboxOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when lightbox is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [lightboxOpen])

  // Render Mermaid diagrams after component mounts/updates
  useEffect(() => {
    if (enableMermaid && mermaidRef.current) {
      const renderMermaid = async () => {
        const mermaidBlocks = mermaidRef.current?.querySelectorAll('.language-mermaid')
        if (mermaidBlocks) {
          for (let i = 0; i < mermaidBlocks.length; i++) {
            const block = mermaidBlocks[i] as HTMLElement
            const code = block.textContent || ''
            try {
              const { svg } = await mermaid.render(`mermaid-${i}-${Date.now()}`, code)
              block.innerHTML = svg
              block.classList.remove('language-mermaid')
              block.classList.add('mermaid-rendered')
            } catch (error) {
              logger.error('Mermaid rendering error', error as Error)
              block.innerHTML = `<pre>Error rendering diagram: ${error}</pre>`
            }
          }
        }
      }
      void renderMermaid()
    }
  }, [normalizedContent, enableMermaid])

  return (
    <>
      <div
        ref={mermaidRef}
        className={`markdown-content ${noParagraphMargin ? '[&_p]:!mb-0' : ''} ${className}`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm, ...(enableMath ? [remarkMath] : [])]}
          rehypePlugins={[
            rehypeRaw as any,
            ...(enableMath ? [[rehypeKatex, { strict: false }] as any] : []),
          ]}
          urlTransform={(url) => (url.startsWith('data:') ? url : defaultUrlTransform(url))}
          components={{
            svg({ children, ...props }: any) {
              // Wrap SVGs in a container with white background and controlled width
              return (
                <div
                  className="flex justify-center my-4 p-4 bg-white rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={(e) => {
                    // Get the SVG element from the click target
                    const svgElement = e.currentTarget.querySelector('svg')
                    if (svgElement) {
                      const svgString = new XMLSerializer().serializeToString(svgElement)
                      openLightboxSvg(svgString)
                    }
                  }}
                  title="Click to enlarge"
                >
                  <svg {...props} className="max-w-3xl w-full h-auto">
                    {children}
                  </svg>
                </div>
              )
            },
            img({ src, alt, ...props }: any) {
              // Make images clickable to open in lightbox
              return (
                <div
                  className="flex justify-center my-4 cursor-pointer hover:shadow-lg transition-shadow rounded-lg overflow-hidden w-full"
                  onClick={() => openLightboxImage(src || '', alt || '')}
                  title="Click to enlarge"
                >
                  <img
                    src={src}
                    alt={alt}
                    {...props}
                    className="max-w-full w-auto h-auto rounded-lg object-contain"
                    style={{ maxHeight: '500px' }}
                  />
                </div>
              )
            },
            pre({ children, ...props }: any) {
              // Check if pre contains SVG content
              const childContent = typeof children === 'object' && children?.props?.children
              const contentStr = String(childContent || children || '')

              if (contentStr.trim().startsWith('<svg')) {
                return (
                  <div
                    className="flex justify-center my-4 p-4 bg-white rounded-lg [&_svg]:max-w-3xl [&_svg]:w-full [&_svg]:h-auto cursor-pointer hover:shadow-lg transition-shadow"
                    dangerouslySetInnerHTML={{ __html: contentStr }}
                    onClick={() => openLightboxSvg(contentStr)}
                    title="Click to enlarge"
                  />
                )
              }

              // Default pre rendering for code blocks
              return <pre {...props}>{children}</pre>
            },
            code({ inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '')
              const language = match ? match[1] : ''

              // Handle Mermaid diagrams
              if (enableMermaid && language === 'mermaid') {
                return <div className="language-mermaid">{String(children).replace(/\n$/, '')}</div>
              }

              // Handle SVG - render as actual SVG instead of code
              if (
                language === 'svg' ||
                (language === 'html' && String(children).trim().startsWith('<svg'))
              ) {
                const svgContent = String(children).replace(/\n$/, '')
                return (
                  <div
                    className="flex justify-center my-4 p-4 bg-white rounded-lg [&_svg]:max-w-3xl [&_svg]:w-full [&_svg]:h-auto cursor-pointer hover:shadow-lg transition-shadow"
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                    onClick={() => openLightboxSvg(svgContent)}
                    title="Click to enlarge"
                  />
                )
              }

              // Handle code blocks
              if (!inline && enableCode && match) {
                return (
                  <SyntaxHighlighter style={oneDark} language={language} PreTag="div" {...props}>
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                )
              }

              // Inline code
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
            // Style tables - playful with borders, rounded corners, centered
            table({ children, ...props }: any) {
              return (
                <div className="not-prose flex justify-center my-6">
                  <div className="overflow-hidden rounded-xl border-2 border-sky-300 shadow-md bg-card">
                    <table className="divide-y divide-sky-200" {...props}>
                      {children}
                    </table>
                  </div>
                </div>
              )
            },
            thead({ children, ...props }: any) {
              return (
                <thead className="bg-sky-100" {...props}>
                  {children}
                </thead>
              )
            },
            th({ children, ...props }: any) {
              return (
                <th
                  className="px-4 py-2 text-left text-sm font-semibold text-sky-700 [&_p]:!mb-0"
                  {...props}
                >
                  {children}
                </th>
              )
            },
            tbody({ children, ...props }: any) {
              return (
                <tbody className="divide-y divide-sky-100" {...props}>
                  {children}
                </tbody>
              )
            },
            tr({ children, ...props }: any) {
              return (
                <tr className="even:bg-sky-50/50 hover:bg-sky-100 transition-colors" {...props}>
                  {children}
                </tr>
              )
            },
            td({ children, ...props }: any) {
              return (
                <td className="px-4 py-2 text-sm [&_p]:!mb-0 [&_.katex-display]:!my-0" {...props}>
                  {children}
                </td>
              )
            },
            // Style figure with caption
            figure({ children, ...props }: any) {
              return (
                <figure className="my-6 flex flex-col items-center" {...props}>
                  {children}
                </figure>
              )
            },
            figcaption({ children, ...props }: any) {
              return (
                <figcaption
                  className="text-center text-sm text-muted-foreground mt-2 font-medium"
                  {...props}
                >
                  {children}
                </figcaption>
              )
            },
          }}
        >
          {normalizedContent}
        </ReactMarkdown>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && lightboxContent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-900 rounded-full p-2 shadow-lg transition-colors"
              title="Close (ESC)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Content */}
            {lightboxContent.type === 'svg' ? (
              <div
                className="bg-white rounded-lg p-8 shadow-2xl overflow-auto flex items-center justify-center [&_svg]:min-w-[800px] [&_svg]:w-auto [&_svg]:h-auto"
                dangerouslySetInnerHTML={{ __html: lightboxContent.content }}
                style={{
                  maxWidth: '95vw',
                  maxHeight: '90vh',
                }}
              />
            ) : (
              <img
                src={lightboxContent.src}
                alt={lightboxContent.alt}
                className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export const MarkdownRenderer = memo(MarkdownRendererComponent)
