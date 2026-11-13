import { useEffect, useState, useCallback } from "preact/hooks";
import { getArchiveDetailsBySlug } from "../services/portfolioService";

export default function useProjectDetails(slug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getArchiveDetailsBySlug(slug));
    } catch (err) {
      setData(null);
      if (err?.response?.status !== 404) {
        console.error("Fetch failed:", err);
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...data, loading, error, refetch: fetchData };
}
