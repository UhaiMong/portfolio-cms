import { useState } from "preact/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { FiCornerLeftDown } from "react-icons/fi";
import useFetch from "../hooks/useFetch";
import { getProjects } from "../services/portfolioService";
import SectionHeading from "../components/ui/SectionHeading";
import ErrorState from "../components/ui/ErrorState";
import ProjectDetail from "./projects/ProjectDetail";
import ProjectPreview from "./projects/LaptopPreview";
import ProjectListItem from "./projects/ProjectListItem";
import CategoryFilter from "./projects/CategoryFilter";

// Main page
export default function ProjectsPage({ standalone = true }) {
  const { data, loading, error, refetch } = useFetch(getProjects, {}, []);

  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const projects = data?.projects || [];
  const categories = [
    ...new Set(projects.map((p) => p.category).filter(Boolean)),
  ];

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="w-full h-auto bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-gray-200">
      <section
        className={`w-full px-4 md:px-6 ${standalone ? "py-14" : "py-7"}`}
      >
        {standalone && (
          <SectionHeading
            label="Portfolio"
            title="Selected Work"
            subtitle="A curated collection of projects built with care and precision."
          />
        )}

        {!standalone && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-6 px-2"
          >
            <span
              className="text-xs tracking-[0.3em] uppercase
            flex items-center gap-3"
            >
              Projects <FiCornerLeftDown />
            </span>
            <a
              href="/projects"
              className="text-xs tracking-widest uppercase
              hover:text-black dark:hover:text-white transition-colors duration-300"
            >
              View all →
            </a>
          </motion.div>
        )}

        {error && <ErrorState message={error} onRetry={refetch} />}

        {!error && (
          <div
            className="grid grid-cols-12 gap-6"
            style={{ minHeight: "72vh" }}
          >
            {/* ── LEFT: List / Detail  */}
            <div className="md:col-span-6 col-span-12">
              <div
                className="
              border border-black/5 dark:border-white/5
              rounded-2xl p-4 h-full flex flex-col"
              >
                {/* Category filter */}
                {categories.length > 0 && !selected && (
                  <CategoryFilter
                    categories={categories}
                    active={activeCategory}
                    onChange={setActiveCategory}
                  />
                )}

                <div className="flex-1 overflow-hidden">
                  <AnimatePresence mode="wait">
                    {/* Loading skeletons */}
                    {loading && (
                      <motion.div key="loading" className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="flex gap-3 p-3 animate-pulse">
                            <div className="w-14 h-14 rounded-lg bg-black/5 dark:bg-white/5 shrink-0" />
                            <div className="flex-1 space-y-2">
                              <div className="h-3 bg-black/5 dark:bg-white/5 rounded w-2/3" />
                              <div className="h-2 bg-black/5 dark:bg-white/5 rounded w-1/2" />
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {/* Detail */}
                    {!loading && selected && (
                      <motion.div key="detail" className="h-full pr-1">
                        <ProjectDetail
                          project={selected}
                          onClose={() => setSelected(null)}
                        />
                      </motion.div>
                    )}

                    {/* List */}
                    {!loading && !selected && (
                      <motion.div
                        key="list"
                        className="h-full overflow-y-auto space-y-1 pr-1"
                      >
                        {filtered.length === 0 ? (
                          <p className="text-center text-sm py-12">
                            No projects in this category
                          </p>
                        ) : (
                          filtered.map((p, i) => (
                            <ProjectListItem
                              key={p._id}
                              project={p}
                              index={i}
                              isActive={hovered?._id === p._id}
                              onHover={setHovered}
                              onLeave={() => setHovered(null)}
                              onClick={setSelected}
                            />
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* RIGHT: Preview */}
            <div className="md:col-span-6 col-span-12">
              <div
                className="
              border border-black/5 dark:border-white/5
              rounded-2xl p-8 h-full flex items-center justify-center"
              >
                <AnimatePresence mode="wait">
                  <ProjectPreview
                    key={hovered?._id || selected?._id || "empty"}
                    project={
                      hovered ||
                      selected ||
                      (projects.length ? projects[0] : null)
                    }
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
