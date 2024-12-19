export function handleApiError(err: unknown): Error {
  if (err instanceof Response) {
    return new Error(
      err.status === 404
        ? 'No tasks found for the selected criteria'
        : 'Failed to load the task. Please try again.'
    );
  }

  if (err instanceof Error) {
    return err;
  }

  return new Error('Failed to load the task. Please try again.');
} 