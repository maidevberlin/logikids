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
