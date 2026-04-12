import { useState, useEffect } from "preact/hooks";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiGithub, FiExternalLink } from "react-icons/fi";
import { getProjects } from "../../services/portfolioService";

const CATEGORIES = ["All", "Web", "Mobile", "Fullstack", "UI/UX"];

export default function ProjectGalleryGemini() {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchProjects = async (category, page) => {
    setLoading(true);
    try {
      const params = { page, limit: 6 };
      if (category !== "All") params.category = category;
      // Add status='published' if your backend requires it

      const data = await getProjects(params);
      setProjects(data.projects);
      setPagination({
        page: data.pagination.page,
        totalPages: data.pagination.pages,
      });
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(activeCategory, pagination.page);
  }, [activeCategory, pagination.page]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <section className="min-h-screen py-20 px-6 md:px-12 bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Featured <span className="text-[var(--accent)]">Projects</span>
          </motion.h1>
          <p className="text-[var(--text-muted)] max-w-2xl text-lg">
            A curated collection of my recent work, showcasing my expertise in
            modern web technologies.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeCategory === cat
                  ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-[var(--glow)]"
                  : "bg-transparent border-[var(--border)] text-[var(--text-main)] hover:border-[var(--accent)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-[400px] rounded-[var(--radius)] bg-[var(--bg-input)] animate-pulse border border-[var(--border)]"
              ></div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-[var(--text-muted)]">
            No projects found in this category.
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {projects.map((project) => (
                <motion.div
                  key={project._id}
                  variants={itemVariants}
                  layout
                  className="group relative flex flex-col bg-[var(--bg-header)] rounded-[var(--radius)] overflow-hidden border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow)]"
                >
                  {/* Thumbnail */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      loading="lazy"
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-semibold bg-black/60 backdrop-blur-md text-white rounded-full">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-2 text-white dark:text-[var(--text-main)]">
                      {project.title}
                    </h3>
                    <p className="text-[var(--text-muted)] text-sm mb-6 flex-grow line-clamp-3">
                      {project.shortDescription}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border)]">
                      <Link
                        to={`/archives/gemini/${project.slug}`}
                        className="flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent2)] transition-colors font-medium text-sm"
                      >
                        View Details <FiArrowRight />
                      </Link>
                      <div className="flex gap-4 text-[var(--text-muted)]">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-white transition-colors"
                          >
                            <FiGithub size={18} />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-white transition-colors"
                          >
                            <FiExternalLink size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-16">
            <button
              disabled={pagination.page === 1}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              className="px-4 py-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border)] disabled:opacity-50 hover:bg-[var(--bg-header)] transition-colors"
            >
              Previous
            </button>
            <span className="text-[var(--text-muted)]">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              className="px-4 py-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border)] disabled:opacity-50 hover:bg-[var(--bg-header)] transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
