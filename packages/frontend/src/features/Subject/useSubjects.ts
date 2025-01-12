import { useQuery } from '@tanstack/react-query';
import { logikids } from '../../api/logikids';
import { Subject } from './types';

export const SUBJECTS_QUERY_KEY = ['subjects'] as const;

export function useSubjects() {
  return useQuery<Subject[]>({
    queryKey: SUBJECTS_QUERY_KEY,
    queryFn: ({ signal }) => logikids.getSubjects(signal),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
} 