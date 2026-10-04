import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../utils/format';

/**
 * Run an API call on mount (and whenever `deps` change).
 * `fetcher` must resolve to the API payload ({ data }); returns the unwrapped data.
 */
export default function useFetch(fetcher, deps = [], { enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState('');
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetcherRef.current();
      setData(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return { data, loading, error, reload: load, setData };
}
