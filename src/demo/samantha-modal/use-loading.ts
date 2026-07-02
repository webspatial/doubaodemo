import { useState } from 'react';

interface UseLoadingParams<T> {
  onTrigger?: (params: T) => void | Promise<void>;
  onFinish?: () => void;
}

export const useLoading = <T>(params: UseLoadingParams<T>) => {
  const [loading, setLoading] = useState(false);

  const handler = async (opts: T) => {
    try {
      setLoading(true);
      const res = params.onTrigger?.(opts);
      if (res?.then) {
        await res;
      }
    } finally {
      setLoading(false);
    }
    params.onFinish?.();
  };

  return {
    loading,
    handler,
  };
};
