import { useEffect, useState, useCallback } from "preact/hooks";
import { getArchiveDetailsBySlug } from "../services/portfolioService";

export default function useProjectDetails(slug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (isManual = false) => {
      setLoading(true);
      try {
        const res = await getArchiveDetailsBySlug(slug);
        setData(res);
      } catch (error) {
        console.error("Fetch failed:", error);
        setError("Something wrong. Please try again");
      } finally {
        setLoading(false);
      }
    },
    [slug],
  );

  useEffect(() => {
    let cancel = false;

    const load = async () => {
      await fetchData();
    };

    if (!cancel) load();

    return () => {
      cancel = true;
    };
  }, [fetchData]);
  return { ...data, loading, error, refetch: fetchData };
}
