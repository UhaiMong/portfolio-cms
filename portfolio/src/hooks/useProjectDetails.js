import { useEffect, useState } from "preact/hooks";
import { getArchiveDetailsBySlug } from "../services/portfolioService";

export default function useProjectDetails(slug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;

    const fetchData = async () => {
      setLoading(true);
      const res = await getArchiveDetailsBySlug(slug);

      if (!cancel) {
        setData(res);
        setLoading(false);
      }
    };

    fetchData();

    return () => (cancel = true);
  }, [slug]);

  return { ...data, loading };
}
