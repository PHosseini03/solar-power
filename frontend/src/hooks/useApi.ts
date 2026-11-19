import { useEffect, useState } from "react";
import { api, IS_DEMO_MODE } from "../api/client";

interface ApiState<T> {
  data: T;
  loading: boolean;
  isFallback: boolean;
}

/**
 * Loads data from the API. If the API is unavailable, falls back to bundled
 * demo data so the page never renders empty during a presentation.
 */
export function useApi<T>(path: string, fallback: T): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({ data: fallback, loading: true, isFallback: false });

  // Reset when the path changes so a reused page never shows the previous record.
  const [lastPath, setLastPath] = useState(path);
  if (lastPath !== path) {
    setLastPath(path);
    setState({ data: fallback, loading: true, isFallback: false });
  }

  useEffect(() => {
    let active = true;
    api
      .get<T>(path)
      .then((data) => active && setState({ data, loading: false, isFallback: false }))
      .catch(() => active && setState({ data: fallback, loading: false, isFallback: !IS_DEMO_MODE }));
    return () => {
      active = false;
    };
    // fallback is static demo data; path change is the only trigger
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return state;
}
