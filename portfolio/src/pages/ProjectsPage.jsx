import { motion, useMotionValue, useSpring } from "framer-motion";
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
import FeaturedProjectCard from "./projects/FeaturedProjectCard";
import { Link2Icon, Lock } from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";

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

const tiltSpring = { stiffness: 300, damping: 25, mass: 0.5 };

function TiltCard({ children, className }) {
  const rotateX = useSpring(useMotionValue(0), tiltSpring);
  const rotateY = useSpring(useMotionValue(0), tiltSpring);
  const z = useSpring(useMotionValue(0), tiltSpring);

  const onMouseMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    rotateX.set(-(e.clientY - box.top - box.height / 2) / 12);
    rotateY.set((e.clientX - box.left - box.width / 2) / 12);
  };

  const onMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    z.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseEnter={() => z.set(15)}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, z, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ProjectsPage({ standalone = true }) {
  // Backend sorts featured first, so the first featured item here is the latest featured project.
  const { data, loading, error, refetch } = useFetch(
    getProjects,
    { page: 1, limit: 4 },
    [],
  );

  const all = data?.projects || [];
  const project = all.find((p) => p.featured);
  const projects = all.filter((p) => p !== project).slice(0, 3);

  return (
    <div className="w-full min-h-screen page-surface overflow-hidden relative transition-colors duration-300">
      {/* Background Technology Grid Blueprint System */}
      <BackgroundGridBluePrint />
      {project && (
        <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
          <FeaturedProjectCard project={project} />
        </section>
      )}
      <section
        className={`w-full max-w-7xl mx-auto px-4 md:px-8 z-10 relative ${standalone ? "py-16" : "py-8"}`}
      >
        {standalone && (
          <div className="text-center">
            <SectionHeading
              label="Portfolio"
              title="Selected work"
              subtitle="Production apps and experiments built with clear architecture and polished UI."
            />
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

            {!loading && all.length === 0 && (
              <p className="text-center text-neutral-500 py-16">
                No projects found.
              </p>
            )}
            {!loading && projects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-2000 mt-8">
                {projects.map((project) => (
                  <TiltCard
                    key={project._id}
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
                        <Link to={`/archives/${project.slug}`}>
                          <h3 className="text-xl font-bold mt-5 mb-2 tracking-tight line-clamp-1 group-hover:text-brand-primary dark:group-hover:text-brand-secondary transition-colors">
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
                        className="flex-1 text-center text-xs py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-sm hover:bg-brand-primary dark:hover:bg-brand-secondary dark:hover:text-neutral-950 hover:text-white transition-all duration-200"
                      >
                        View Details
                      </Link>

                      <div className="flex gap-2 shrink-0">
                        {project.liveUrl && (
                          <Link
                            to={`/project/live-preview/${project.slug}`}
                            className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                            title="Live Demo"
                          >
                            Live
                          </Link>
                        )}
                        {project.isPrivate ? (
                          <button
                            className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                            title="The repository is private"
                          >
                            <Lock className="w-3 h-3" />
                          </button>
                        ) : project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                            title="Source Code"
                          >
                            Code
                          </a>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </div>
            )}
          </>
        )}
        <Link
          className="w-24 mt-4 flex justify-between items-center bg-linear-to-r from-brand-primary to-indigo-800 text-white font-semibold text-sm rounded-md shadow-2xl py-1.5 px-2"
          to="/archives"
        >
          More <Link2Icon />{" "}
        </Link>
      </section>
    </div>
  );
}
