import { useQuery } from '@tanstack/react-query';
import { logikids, SubjectsParams, SubjectsResponse } from '../../api/logikids';

export function useSubjects(params: SubjectsParams) {
  return useQuery<SubjectsResponse>({
    queryKey: ['subjects', params.grade, params.age, params.difficulty],
    queryFn: ({ signal }) => logikids.getSubjects(params, signal),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    enabled: !!params.grade && !!params.age,
  });
} 