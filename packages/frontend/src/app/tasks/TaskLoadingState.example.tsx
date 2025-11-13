import { TaskLoadingState } from './TaskLoadingState'

/**
 * Example usage of TaskLoadingState component
 *
 * This file demonstrates how to use the TaskLoadingState component
 * in different scenarios. To test, temporarily import this into
 * a visible route or Storybook.
 */

export function TaskLoadingStateExamples() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 space-y-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          TaskLoadingState Examples
        </h1>

        {/* Math Subject */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Math Subject</h2>
          <TaskLoadingState subject="math" />
        </section>

        {/* Physics Subject */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Physics Subject</h2>
          <TaskLoadingState subject="physics" />
        </section>

        {/* Logic Subject */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Logic Subject</h2>
          <TaskLoadingState subject="logic" />
        </section>

        {/* Music Subject */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Music Subject</h2>
          <TaskLoadingState subject="music" />
        </section>

        {/* German Subject */}
        <section>
          <h2 className="text-xl font-semibold mb-4">German Subject</h2>
          <TaskLoadingState subject="german" />
        </section>

        {/* English Subject */}
        <section>
          <h2 className="text-xl font-semibold mb-4">English Subject</h2>
          <TaskLoadingState subject="english" />
        </section>

        {/* Unknown Subject (fallback to default) */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Unknown Subject (Default Theme)</h2>
          <TaskLoadingState subject="unknown-subject" />
        </section>
      </div>
    </div>
  )
}

/**
 * Integration Example: How to use in TaskCard
 *
 * Replace the skeleton loader in TaskCard with:
 *
 * ```tsx
 * if (isLoading) {
 *   return <TaskLoadingState subject={currentSubject} />
 * }
 * ```
 *
 * Where currentSubject comes from task parameters or route context.
 */
