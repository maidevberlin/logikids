/**
 * TaskLoadingProgress Example / Visual Test
 *
 * This file demonstrates the TaskLoadingProgress component with different subjects.
 * NOT imported anywhere - just for development/testing reference.
 *
 * To use: Import and render in a test page or component
 */

import { TaskLoadingProgress } from './TaskLoadingProgress'

export function TaskLoadingProgressExample() {
  return (
    <div className="space-y-8 p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">TaskLoadingProgress Examples</h1>

      {/* Math subject */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Math (Blue)</h2>
        <TaskLoadingProgress
          subject="math"
          onComplete={() => console.log('Math progress complete')}
        />
      </div>

      {/* Physics subject */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Physics (Emerald)</h2>
        <TaskLoadingProgress
          subject="physics"
          onComplete={() => console.log('Physics progress complete')}
        />
      </div>

      {/* Logic subject */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Logic (Purple)</h2>
        <TaskLoadingProgress
          subject="logic"
          onComplete={() => console.log('Logic progress complete')}
        />
      </div>

      {/* German subject */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">German (Red)</h2>
        <TaskLoadingProgress
          subject="german"
          onComplete={() => console.log('German progress complete')}
        />
      </div>

      {/* English subject */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">English (Amber)</h2>
        <TaskLoadingProgress
          subject="english"
          onComplete={() => console.log('English progress complete')}
        />
      </div>

      {/* Music subject */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Music (Pink)</h2>
        <TaskLoadingProgress
          subject="music"
          onComplete={() => console.log('Music progress complete')}
        />
      </div>

      {/* Default/Unknown subject */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Default (Gray)</h2>
        <TaskLoadingProgress
          onComplete={() => console.log('Default progress complete')}
        />
      </div>

      {/* Technical info */}
      <div className="mt-12 p-4 bg-gray-100 rounded-lg text-sm space-y-2">
        <h3 className="font-semibold">Technical Details:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>Update interval: 200ms</li>
          <li>Easing function: progress = 100 * (1 - Math.exp(-elapsed / 7000))</li>
          <li>~30% at 3s, ~63% at 7s, ~90% at 15s, ~95% at 20s</li>
          <li>Time estimate based on typical 20-second load</li>
          <li>Accessibility: role="progressbar", aria-valuenow, aria-live</li>
          <li>Respects prefers-reduced-motion</li>
        </ul>
      </div>
    </div>
  )
}
