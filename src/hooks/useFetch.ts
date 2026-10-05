import { useCallback, useEffect, useState } from 'react';

export interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Лічильник-тригер: зміна значення перезапускає ефект і виконує запит повторно
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Помилка сервера: ${res.status}`);
        }
        const json = (await res.json()) as T;
        setData(json);
      } catch (err) {
        // Навмисне скасування (unmount / зміна URL / refetch) — не помилка
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Невідома помилка');
      } finally {
        // Скасований запит не чіпає isLoading — ним уже керує новий запит
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    load();

    // Memory leak protection: скасовуємо незавершений запит
    return () => {
      controller.abort();
    };
  }, [url, reloadKey]);

  return { data, isLoading, error, refetch };
}
