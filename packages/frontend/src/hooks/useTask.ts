import { useQuery } from '@tanstack/react-query';
import { Age, Difficulty } from '../types/task';
import { LogikidsService } from '../services/logikids';
import { handleApiError } from '../utils/apiErrors';
import config from '../config';
import { taskDefaults } from '../config';

interface TaskParams {
  age?: Age;
  difficulty?: Difficulty;
}

const logikidsService = new LogikidsService(config.apiBaseUrl);

export const useTask = (params?: TaskParams) => {
  const { data: task, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['task', params?.age, params?.difficulty],
    queryFn: async () => {
      const response = await fetch(
        `${config.apiBaseUrl}/task?${new URLSearchParams({
          age: (params?.age ?? taskDefaults.age).toString(),
          difficulty: params?.difficulty ?? taskDefaults.difficulty,
        })}`
      );
      
      if (!response.ok) throw response;
      return response.json();
    },
    retry: false,
  });

  const requestHint = async () => {
    if (!task) return;
    return logikidsService.getHint(task);
  };

  return {
    task,
    loading: isLoading || isFetching,
    error: error ? handleApiError(error).message : null,
    requestHint,
    refetch,
  };
}
