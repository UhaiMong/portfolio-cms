import { useState, useEffect, useCallback } from "preact/hooks";

const useFetch = (fetchFn, params = null, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = params !== null ? await fetchFn(params) : await fetchFn();
      setData(result);
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export default useFetch;
