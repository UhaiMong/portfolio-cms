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
    setLoading(true);
    setError(null);
    try {
      const [bioData, bannerData, resumeData] = await Promise.allSettled([
        getBio(),
        getBanner(),
        getActiveResume(),
      ]);
      if (bioData.status === "fulfilled") {
        setBio(bioData.value);
      } else {
        setError("Something went wrong");
        console.error("Bio failed: ", bioData.reason);
      }
      if (bannerData.status === "fulfilled") {
        setBanner(bannerData.value);
      } else {
        setError("Something went wrong");
        console.error("Banner failed: ", bannerData.reason);
      }
      if (resumeData.status === "fulfilled") {
        setResume(resumeData.value);
      } else {
        setError("Something went wrong");
        console.error("Resume failed: ", resumeData.reason);
      }

      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error("Failed to load global data:", err);
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
