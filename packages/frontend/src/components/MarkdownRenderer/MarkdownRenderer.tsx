import { memo, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import mermaid from 'mermaid'
import 'katex/dist/katex.min.css'

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
              console.error('Mermaid rendering error:', error)
              block.innerHTML = `<pre>Error rendering diagram: ${error}</pre>`
            }
          }
        }
      }
      renderMermaid()
    }
  }, [content, enableMermaid])

  return (
    <div ref={mermaidRef} className={`markdown-content ${noParagraphMargin ? '[&_p]:!mb-0' : ''} ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, ...(enableMath ? [remarkMath] : [])]}
        rehypePlugins={[...(enableMath ? [rehypeKatex as any] : []), rehypeRaw as any]}
        components={{
          svg({ node, children, ...props }: any) {
            // Wrap SVGs in a container with white background and controlled width
            return (
              <div className="flex justify-center my-4 p-4 bg-white rounded-lg">
                <svg {...props} className="max-w-md w-1/2 h-auto">
                  {children}
                </svg>
              </div>
            )
          },
          pre({ node, children, ...props }: any) {
            // Check if pre contains SVG content
            const childContent = typeof children === 'object' && children?.props?.children
            const contentStr = String(childContent || children || '')

            if (contentStr.trim().startsWith('<svg')) {
              return (
                <div
                  className="flex justify-center my-4 p-4 bg-white rounded-lg [&_svg]:max-w-md [&_svg]:w-1/2 [&_svg]:h-auto"
                  dangerouslySetInnerHTML={{ __html: contentStr }}
                />
              )
            }

            // Default pre rendering for code blocks
            return <pre {...props}>{children}</pre>
          },
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''

            // Handle Mermaid diagrams
            if (enableMermaid && language === 'mermaid') {
              return (
                <div className="language-mermaid">
                  {String(children).replace(/\n$/, '')}
                </div>
              )
            }

            // Handle SVG - render as actual SVG instead of code
            if (language === 'svg' || (language === 'html' && String(children).trim().startsWith('<svg'))) {
              const svgContent = String(children).replace(/\n$/, '')
              return (
                <div
                  className="flex justify-center my-4 p-4 bg-white rounded-lg [&_svg]:max-w-md [&_svg]:w-1/2 [&_svg]:h-auto"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              )
            }

            // Handle code blocks
            if (!inline && enableCode && match) {
              return (
                <SyntaxHighlighter
                  style={oneDark}
                  language={language}
                  PreTag="div"
                  {...props}
                >
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
          // Style tables
          table({ children, ...props }: any) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-300" {...props}>
                  {children}
                </table>
              </div>
            )
          },
          thead({ children, ...props }: any) {
            return <thead className="bg-gray-50" {...props}>{children}</thead>
          },
          th({ children, ...props }: any) {
            return (
              <th
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                {...props}
              >
                {children}
              </th>
            )
          },
          td({ children, ...props }: any) {
            return (
              <td className="px-3 py-2 whitespace-nowrap text-sm" {...props}>
                {children}
              </td>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export const MarkdownRenderer = memo(MarkdownRendererComponent)
