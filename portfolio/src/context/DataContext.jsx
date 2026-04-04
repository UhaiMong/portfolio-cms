import { createContext } from "preact";
import { useState, useEffect, useContext } from "preact/hooks";
import {
  getBio,
  getBanner,
  getActiveResume,
} from "../services/portfolioService";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [bio, setBio] = useState(null);
  const [banner, setBanner] = useState(null);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadGlobalData = async () => {
    try {
      const [bioData, bannerData, resumeData] = await Promise.allSettled([
        getBio(),
        getBanner(),
        getActiveResume(),
      ]);
      if (bioData.status === "fulfilled") setBio(bioData.value);
      if (bannerData.status === "fulfilled") setBanner(bannerData.value);
      if (resumeData.status === "fulfilled") setResume(resumeData.value);
    } catch (err) {
      setError(err);
      console.error("Failed to load global data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGlobalData();
  }, []);
  return (
    <DataContext.Provider
      value={{
        bio,
        banner,
        resume,
        loading,
        error,
        refetch: loadGlobalData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};

export default DataContext;
