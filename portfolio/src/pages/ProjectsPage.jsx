import { useState } from "preact/hooks";
import { motion } from "framer-motion";
import useFetch from "../hooks/useFetch";
import { getProjects } from "../services/portfolioService";
import ErrorState from "../components/ui/ErrorState";
import { Link } from "react-router-dom";

// Standard tech icons mapper updated to support your `project.tech` strings
import {
  SiNodedotjs,
  SiKubernetes,
  SiGraphql,
  SiReact,
  SiNextdotjs,
  SiStripe,
  SiPostgresql,
  SiPython,
  SiTensorflow,
  SiRedis,
  SiFastapi,
  SiTailwindcss,
  SiMongodb,
} from "react-icons/si";
import BackgroundGridBluePrint from "../components/ui/BackgroundGridBluePrint";

const techMap = {
  "Node.js": { icon: SiNodedotjs, color: "text-green-500" },
  Kubernetes: { icon: SiKubernetes, color: "text-blue-500" },
  GraphQL: { icon: SiGraphql, color: "text-pink-500" },
  React: { icon: SiReact, color: "text-green-400" },
  "Next.js": { icon: SiNextdotjs, color: "text-neutral-800 dark:text-white" },
  Stripe: { icon: SiStripe, color: "text-purple-500" },
  PostgreSQL: { icon: SiPostgresql, color: "text-blue-400" },
  Python: { icon: SiPython, color: "text-yellow-400" },
  FastAPI: { icon: SiFastapi, color: "text-teal-400" },
  TensorFlow: { icon: SiTensorflow, color: "text-orange-500" },
  Redis: { icon: SiRedis, color: "text-red-600" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "text-sky-400" },
  MongoDB: { icon: SiMongodb, color: "text-emerald-500" },
};

export default function ProjectsPage({ standalone = true }) {
  const { data, loading, error, refetch } = useFetch(getProjects, {}, []);

  // Track precise mouse coordinates for 3D card tilt effect
  const [rotateX, setRotateX] = useState({});
  const [rotateY, setRotateY] = useState({});
  const [hoveredId, setHoveredId] = useState(null);

  const projects = data?.projects || [];
  // Explicitly rendering only featured items matching your exact logic
  const featuredProjects = projects.filter((p) => p.featured === true);

  const handleMouseMove = (e, id) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;

    // Calculate degree rotation based on pointer coordinate bounds
    setRotateX((prev) => ({ ...prev, [id]: -y / 12 }));
    setRotateY((prev) => ({ ...prev, [id]: x / 12 }));
  };

  const handleMouseLeave = (id) => {
    setHoveredId(null);
    setRotateX((prev) => ({ ...prev, [id]: 0 }));
    setRotateY((prev) => ({ ...prev, [id]: 0 }));
  };

  return (
    <div className="w-full min-h-screen bg-white text-gray-900 dark:bg-linear-to-b from-slate-900 via-indigo-950 to-slate-900 dark:text-white overflow-hidden relative transition-colors duration-300">
      {/* Background Technology Grid Blueprint System */}
      <BackgroundGridBluePrint />

      <section
        className={`w-full max-w-7xl mx-auto px-4 md:px-8 z-10 relative ${standalone ? "py-24" : "py-12"}`}
      >
        {standalone && (
          <div className="text-center mb-20">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-neutral-900 via-neutral-700 to-neutral-500 dark:from-white dark:via-neutral-200 dark:to-neutral-500 mb-4 uppercase"
            >
              Featured Creations
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 font-medium tracking-wide max-w-2xl mx-auto"
            >
              Production-ready applications engineered with architectural
              integrity.
            </motion.p>
          </div>
        )}

        {error && <ErrorState message={error} onRetry={refetch} />}

        {!error && (
          <>
            {loading && (
              <div className="flex items-center justify-center min-h-[40vh]">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!loading && featuredProjects.length === 0 && (
              <p className="text-center text-neutral-500 py-16">
                No featured projects found.
              </p>
            )}

            {!loading && featuredProjects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-2000">
                {featuredProjects?.map((project) => (
                  <motion.div
                    key={project._id}
                    onMouseMove={(e) => handleMouseMove(e, project._id)}
                    onMouseEnter={() => setHoveredId(project._id)}
                    onMouseLeave={() => handleMouseLeave(project._id)}
                    style={{
                      rotateX: rotateX[project._id] || 0,
                      rotateY: rotateY[project._id] || 0,
                      transformStyle: "preserve-3d",
                    }}
                    animate={{
                      z: hoveredId === project._id ? 15 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      mass: 0.5,
                    }}
                    className="relative group bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/60 p-5 rounded-3xl shadow-sm hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between h-auto"
                  >
                    <div>
                      {/* Depth container for layout elements */}
                      <div style={{ transform: "translateZ(30px)" }}>
                        {/* Dynamic Image Wrapper Container */}
                        <div className="w-full h-44 rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800 relative bg-neutral-100 dark:bg-neutral-950">
                          <img
                            loading="lazy"
                            src={project?.thumbnail}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-neutral-950/20 to-transparent pointer-events-none" />
                        </div>

                        {/* Title & Info */}
                        <Link to={project.liveUrl}>
                          <h3 className="text-xl font-bold mt-5 mb-2 tracking-tight line-clamp-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                            {project.title}
                          </h3>
                        </Link>

                        {/* Description Context Block */}
                        <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed line-clamp-3 mb-4 font-normal">
                          {project.description}
                        </p>
                      </div>

                      {/* Tech Stack Horizontal Meta Block */}
                      <div
                        className="flex flex-wrap gap-x-3.5 gap-y-2 mt-2 items-center text-neutral-400 dark:text-neutral-500"
                        style={{ transform: "translateZ(40px)" }}
                      >
                        {project?.techStack?.map((techName, idx) => {
                          const config = techMap[techName] || {
                            icon: null,
                            color: "text-neutral-400",
                          };
                          const Icon = config.icon;
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-1 text-[11px] font-medium tracking-wide border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 rounded-md px-1 py-0.5 transition-all"
                            >
                              {Icon && (
                                <Icon className={`text-sm ${config.color}`} />
                              )}
                              <span className="text-neutral-600 dark:text-neutral-300">
                                {techName}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer Action Buttons Container */}
                    <div
                      className="flex items-center gap-3 mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80"
                      style={{ transform: "translateZ(50px)" }}
                    >
                      <Link
                        to={`/archives/${project.slug}`}
                        className="flex-1 text-center text-xs py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-sm hover:bg-green-600 dark:hover:bg-green-400 dark:hover:text-neutral-950 hover:text-white transition-all duration-200"
                      >
                        View Details
                      </Link>

                      <div className="flex gap-2 shrink-0">
                        <Link
                          to={`/project/live-preview/${encodeURIComponent(project?.liveUrl)}`}
                          className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                          title="Live Demo"
                        >
                          Live
                        </Link>
                        <a
                          href={project?.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                          title="Source Code"
                        >
                          Code
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
