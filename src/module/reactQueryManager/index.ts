import { api } from "./adapter/api";
import {
  QueryFunctionContext,
  //   UseQueryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { AxiosError, AxiosResponse } from "axios";
import {
  GetInfinitePagesInterface,
  InfinitePagesProps,
  QueryProps,
} from "./types/ReactQueryManager";
import { ErrorType } from "./types/httpTypes";

type QueryKeyT = [string, object | undefined];

export const fetcher = <T>({
  queryKey,
  pageParam,
}: QueryFunctionContext<QueryKeyT>): Promise<T> => {
  const [url, params] = queryKey;
  return api.get<T>(url, { params: { ...params, pageParam } });
};

export const useLoadMore = <T>(props: InfinitePagesProps<T>) => {
  const { url, params, config, customQueryKey } = props;
  const context = useInfiniteQuery<
    GetInfinitePagesInterface<T>,
    ErrorType,
    GetInfinitePagesInterface<T>,
    QueryKeyT
  >({
    queryKey: customQueryKey ? [customQueryKey, params] : [url!, params],
    queryFn: (context: QueryFunctionContext<QueryKeyT>) => {
      context.pageParam = context.pageParam || 1;
      return fetcher(context);
    },
    getPreviousPageParam: (firstPage) => firstPage.previousId ?? false,
    getNextPageParam: (lastPage) => lastPage.nextId ?? false,
    ...config,
  });

  return context;
};

export const usePrefetch = <T>(url: string | null, params?: object) => {
  const queryClient = useQueryClient();

  return () => {
    if (!url) {
      return;
    }

    queryClient.prefetchQuery<T, Error, T, QueryKeyT>({
      queryKey: [url!, params],
      queryFn: (context: QueryFunctionContext<QueryKeyT>) => fetcher(context),
    });
  };
};

export const useFetch = <T>(
  //   url: string | null,
  //   params?: RequestConfigType,
  //   config?: UseQueryOptions<T, Error, T, QueryKeyT>,
  //   customQueryKey?: string,
  props: QueryProps<T>
) => {
  const { url, params, config, customQueryKey } = props;
  return useQuery<T, Error, T, QueryKeyT>({
    queryKey: customQueryKey ? [customQueryKey, params] : [url!, params],
    queryFn: (context: QueryFunctionContext<QueryKeyT>) => fetcher<T>(context),
    enabled: !!url,
    ...config,
  });
};

const useGenericMutation = <T, S>(
  func: (data: T | S) => Promise<AxiosResponse<S>>,
  url: string,
  params?: object,
  updater?: ((oldData: T, newData: S) => T) | undefined
) => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse, AxiosError, T | S>(func, {
    onMutate: async (data) => {
      await queryClient.cancelQueries([url!, params]);

      const previousData = queryClient.getQueryData([url!, params]);

      queryClient.setQueryData<T>([url!, params], (oldData) => {
        return updater ? updater(oldData!, data as S) : (data as T);
      });

      return previousData;
    },
    onError: (err, _, context) => {
      queryClient.setQueryData([url!, params], context);
    },
    onSettled: () => {
      queryClient.invalidateQueries([url!, params]);
    },
  });
};

export const useDelete = <T>(
  url: string,
  params?: object,
  updater?: (oldData: T, id: string | number) => T
) => {
  return useGenericMutation<T, string | number>(
    (id) => api.delete(`${url}/${id}`),
    url,
    params,
    updater
  );
};

export const usePost = <T, S>(
  url: string,
  params?: object,
  updater?: (oldData: T, newData: S) => T
) => {
  return useGenericMutation<T, S>(
    (data) => api.post<T, S>(url, data),
    url,
    params,
    updater
  );
};

export const useUpdate = <T, S>(
  url: string,
  params?: object,
  updater?: (oldData: T, newData: S) => T
) => {
  return useGenericMutation<T, S>(
    (data) => api.patch<T, S>(url, data),
    url,
    params,
    updater
  );
};
