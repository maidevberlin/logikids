import { useState, useEffect } from 'react'
import { TaskLoadingContent } from './TaskLoadingContent'

/**
 * Example component demonstrating TaskLoadingContent usage.
 * Shows how the component behaves with simulated progress.
 *
 * This is for development/testing purposes only.
 */
export function TaskLoadingContentExample() {
  const [progress, setProgress] = useState(0)
  const [subject, setSubject] = useState('math')

  // Simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0 // Reset for demo
        return prev + 1
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">TaskLoadingContent Demo</h1>
          <p className="text-muted-foreground">
            Watch the content rotate every 5-6 seconds and stage messages change with progress.
          </p>
        </div>

        {/* Subject selector */}
        <div className="flex gap-2 flex-wrap">
          {['math', 'physics', 'logic', 'music', 'german', 'english'].map((subj) => (
            <button
              key={subj}
              onClick={() => setSubject(subj)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                subject === subj
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>

        {/* Progress display */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Progress</span>
            <span className="text-2xl font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* The component being demonstrated */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <TaskLoadingContent subject={subject} progress={progress} />
        </div>

        {/* Stage guide */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-sm">
          <h3 className="font-semibold mb-2">Stage Messages:</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>0-20%: Analyzing your learning level...</li>
            <li>20-50%: Crafting your question...</li>
            <li>50-80%: Generating hints and solutions...</li>
            <li>80-100%: Final touches...</li>
          </ul>
        </div>

        {/* Interaction tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm">
          <h3 className="font-semibold mb-2">Interaction Tips:</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>🖱️ Hover over the content card to pause rotation</li>
            <li>⌨️ Tab to the card and it will pause for accessibility</li>
            <li>🎨 Different content types have different icons and colors</li>
            <li>🔄 Content is shuffled to avoid repetition</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
