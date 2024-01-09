import { useMemo } from 'react';
import { QueryClient } from '@tanstack/react-query';

type QueryClientState = QueryClient;

const useBaseQueryClient = (): QueryClientState => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            useErrorBoundary: true,
            refetchOnMount: false,
            refetchOnWindowFocus: false, // Disable automatic refetch on window focus
            staleTime: 1000 * 20,
          },
          mutations: {
            useErrorBoundary: true,
          },
        },
      }),
    [],
  );
  return queryClient;
};

export default useBaseQueryClient;
