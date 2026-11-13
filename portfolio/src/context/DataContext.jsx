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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const loadGlobalData = async () => {
    setLoading(true);
    setErrors({});
    const sources = [
      ["bio", getBio, setBio],
      ["banner", getBanner, setBanner],
      ["resume", getActiveResume, setResume],
    ];
    const results = await Promise.allSettled(sources.map(([, fn]) => fn()));
    const nextErrors = {};
    results.forEach((result, i) => {
      const [key, , setValue] = sources[i];
      if (result.status === "fulfilled") {
        setValue(result.value);
      } else {
        nextErrors[key] =
          result.reason?.response?.data?.message || "Something went wrong";
        console.error(`${key} failed:`, result.reason);
      }
    });
    setErrors(nextErrors);
    setLoading(false);
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
        error: errors.bio || null,
        errors,
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
