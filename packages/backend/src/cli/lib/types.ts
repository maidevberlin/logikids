/**
 * Shared types for CLI validators
 */

export interface CheckIssue {
  line?: number;
  message: string;
  fix: string;
  reference?: string;
}

export interface CheckResult {
  status: 'pass' | 'fail' | 'warning';
  issues: CheckIssue[];
}

/**
 * Schema validation result with parsed data on success
 */
export interface SchemaCheckResult<T> {
  status: 'pass' | 'fail';
  issues: CheckIssue[];
  data?: T;  // Only present when status is 'pass'
}
