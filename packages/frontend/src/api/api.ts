import axios, { AxiosError } from 'axios';
import config from '../config';

export const api = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic error handling
api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (error.response) {
      // Handle different HTTP status codes generically
      switch (error.response.status) {
        case 401:
          throw new Error('Authentication required');
        case 403:
          throw new Error('You do not have permission to perform this action');
        case 404:
          throw new Error('Resource not found');
        case 422:
          throw new Error('Invalid data provided');
        case 429:
          throw new Error('Too many requests. Please try again later');
        case 500:
          throw new Error('Internal server error. Please try again later');
        default:
          throw new Error('An unexpected error occurred. Please try again');
      }
    }

    if (error.request) {
      throw new Error('No response received from server. Please check your connection');
    }

    throw error;
  }
);

// Type for API error responses
export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Helper to extract error message from API response
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Export types for better type safety across the app
export type ApiResponse<T> = Promise<T>; 