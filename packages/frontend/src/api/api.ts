import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import config from '../config';
import { getAccessToken, getRefreshToken, storeTokens, getUserId } from '../data/core/storage';

export const api = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/**
 * Refresh access token using userId
 */
async function refreshAccessToken(): Promise<string> {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const userId = await getUserId();

      // Must have userId to renew token
      if (!userId) {
        throw new Error('No user credentials available');
      }

      // Renew access token with userId
      const response = await axios.post(`${config.apiBaseUrl}/auth/refresh`, {
        userId
      });

      const { accessToken } = response.data;
      await storeTokens(accessToken);

      return accessToken;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// Add JWT access token to all requests
api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Generic error handling with token refresh
api.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and we haven't retried yet, try to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();

        // Retry the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login/welcome page
        console.error('Token refresh failed:', refreshError);
        window.location.href = '/welcome-choice';
        throw new Error('Session expired. Please login again');
      }
    }

    // Handle other errors
    if (error.response) {
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