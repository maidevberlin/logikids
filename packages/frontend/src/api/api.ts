import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import config from '../config';
import { getAccessToken, storeTokens, getUserId } from '../data/core/storage';
import { createLogger } from '@/lib/logger';
import { LogikidsApiError } from './errors';

const logger = createLogger('APIClient');

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
        logger.error('Token refresh failed', refreshError as Error);
        window.location.href = '/welcome-choice';
        throw new LogikidsApiError('Session expired. Please login again');
      }
    }

    // Handle other errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new LogikidsApiError('Authentication required');
        case 403:
          throw new LogikidsApiError('You do not have permission to perform this action');
        case 404:
          throw new LogikidsApiError('Resource not found');
        case 422:
          throw new LogikidsApiError('Invalid data provided');
        case 429:
          throw new LogikidsApiError('Too many requests. Please try again later');
        case 500:
          throw new LogikidsApiError('Internal server error. Please try again later');
        default:
          throw new LogikidsApiError('An unexpected error occurred. Please try again');
      }
    }

    if (error.request) {
      throw new LogikidsApiError('No response received from server. Please check your connection');
    }

    throw new LogikidsApiError(error.message || 'An unexpected error occurred');
  }
);

// Export types for better type safety across the app
export type ApiResponse<T> = Promise<T>; 