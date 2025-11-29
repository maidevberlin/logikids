import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink, TRPCClientError } from '@trpc/client';
import type { AppRouter } from '@logikids/backend';
import { getAccessToken, storeTokens, getUserId } from '../data/core/storage';
import { createLogger } from '@/lib/logger';

const logger = createLogger('tRPC');

// Create tRPC React hooks
export const trpc = createTRPCReact<AppRouter>();

// Get API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5175';

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const userId = await getUserId();

      if (!userId) {
        throw new Error('No user credentials available');
      }

      const response = await fetch(`${API_URL}/api/auth.refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const result = await response.json();
      const accessToken = result.result?.data?.accessToken;

      if (!accessToken) {
        throw new Error('Invalid refresh response');
      }

      await storeTokens(accessToken);

      return accessToken;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// Create tRPC client
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${API_URL}/api`,
      async headers() {
        const token = await getAccessToken();
        return {
          authorization: token ? `Bearer ${token}` : '',
        };
      },
      async fetch(url, options) {
        const response = await fetch(url, options);

        const isRetry = options?.headers && 'x-retry' in (options.headers as Record<string, string>);

        if (response.status === 401 && !isRetry) {
          try {
            const newToken = await refreshAccessToken();

            const retryOptions = {
              ...options,
              headers: {
                ...options?.headers,
                authorization: `Bearer ${newToken}`,
                'x-retry': 'true',
              },
            };

            return fetch(url, retryOptions);
          } catch (error) {
            logger.error('Token refresh failed', error as Error);
            window.location.href = '/welcome-choice';
            throw error;
          }
        }

        return response;
      },
    }),
  ],
});
