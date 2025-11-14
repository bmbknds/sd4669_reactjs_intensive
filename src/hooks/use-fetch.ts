import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';

interface UseFetchOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useFetch = <T,>(
  fetchFn: () => Promise<T>,
  options: UseFetchOptions<T> = {}
): UseFetchResult<T> => {
  const { onSuccess, onError, immediate = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const executeFetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err as AxiosError;
      const errorObj = new Error(error.message || 'An error occurred');
      setError(errorObj);
      onError?.(errorObj);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      executeFetch();
    }
  }, [immediate, executeFetch]);

  return {
    data,
    loading,
    error,
    refetch: executeFetch,
  };
};
