import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGrid, FiList } from "react-icons/fi";
import { getProjects } from "../../services/portfolioService";
import CategoryFilter from "../projects/CategoryFilter";
import SkeletonGrid from "./components/SkeletonGrid";
import GridCard from "./components/GridCard";
import ListCard from "./components/ListCard";
import useFetch from "../../hooks/useFetch";

// Stagger container
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

// Main Component
export default function ArchiveGallery() {
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 9,
  });
  // const [loading, setLoading] = useState(true);

  const { data, loading, error, refetch } = useFetch(getProjects, {}, []);

  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [activeCategory, setActiveCategory] = useState("All");

  const projects = data?.projects || [];
  const paginationMeta = data?.pagination;
  if (paginationMeta) {
    setPagination(paginationMeta);
  }
  const categories = [
    ...new Set(projects.map((p) => p?.category).filter(Boolean)),
  ];

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p?.category === activeCategory);
  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-950 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 text-center"
        >
          <span className="inline-block text-[11px] font-bold tracking-[0.3em] uppercase text-green-500 dark:text-green-400 mb-4">
            Portfolio
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-gray-50 leading-none tracking-tight mb-4">
            Project{" "}
            <span className="relative inline-block">
              Showcase
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-linear-to-r from-green-500 to-green-200 origin-left rounded-full" />
            </span>
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            A curated collection of things I've built — from side experiments to
            full-scale products.
          </p>
        </motion.div>

        {/* ── Toolbar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-8"
        >
          {/* Results count  */}
          {!loading && (
            <div className="mb-6 flex-1 flex items-center justify-between">
              <p className="text-xs font-semibold">
                {projects.length > 0
                  ? `Showing ${projects.length} project${projects.length !== 1 ? "s" : ""}${pagination.total ? ` of ${pagination.total}` : ""}`
                  : ""}
              </p>
              <div className="sm:hidden flex items-center rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-green-500 text-white" : "text-gray-500"}`}
                >
                  <FiGrid size={13} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-green-500 text-white" : "text-gray-500"}`}
                >
                  <FiList size={13} />
                </button>
              </div>
            </div>
          )}
          {/* View toggles */}
          <div className="hidden sm:flex items-center rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-green-500 text-white" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"}`}
            >
              <FiGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-green-500 text-white" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"}`}
            >
              <FiList size={15} />
            </button>
          </div>
        </motion.div>

        {/* Category Pills  */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.length > 0 && (
                <CategoryFilter
                  categories={categories}
                  active={activeCategory}
                  onChange={setActiveCategory}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/*  Content */}
        {loading ? (
          <SkeletonGrid />
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-500 mb-4">{error}</p>
            <button className="px-6 py-2.5 rounded-xl bg-violet-500 text-white text-sm font-semibold hover:bg-violet-600 transition-colors">
              Retry
            </button>
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">
              No projects found
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Try adjusting your filters or search query.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {filtered.map((project, i) =>
                viewMode === "grid" ? (
                  <GridCard key={project._id} project={project} index={i} />
                ) : (
                  <ListCard key={project._id} project={project} index={i} />
                ),
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex items-center justify-center gap-2"
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:border-violet-400/60 transition-colors"
            >
              ← Prev
            </button>

            <div className="flex gap-1.5">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === pagination.pages ||
                    Math.abs(p - page) <= 1,
                )
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "…" ? (
                    <span
                      key={`dots-${i}`}
                      className="px-2 py-2 text-gray-400 text-sm"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold border transition-all ${
                        page === p
                          ? "bg-violet-500 text-white border-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-violet-400/60"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:border-violet-400/60 transition-colors"
            >
              Next →
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
