import { FiArrowRight, FiExternalLink, FiGithub, FiStar } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { cardVariants } from "./CardVarients";
import StatusDot from "./StatusDot";
import TechBadge from "./TechBadge";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

// Grid Card
function GridCard({ project, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      variants={cardVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-violet-400/50 dark:hover:border-violet-500/40 transition-colors duration-300 shadow-soft flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-video bg-gray-100 dark:bg-gray-800">
        {project.thumbnail ? (
          <img
            loading="lazy"
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl font-black text-gray-300 dark:text-gray-700 select-none">
              {project.title?.charAt(0)}
            </span>
          </div>
        )}

        {/* Overlay on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gray-950/70 backdrop-blur-[2px] flex items-center justify-center gap-3"
            >
              {project.liveUrl && (
                <Link
                  to={`/project/live-preview/${project.slug}`}
                  className="flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-2.5 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors rounded-xl"
                >
                  <FiExternalLink size={12} /> Live Preview
                </Link>
              )}
              {project.githubUrl && project.isPrivate ? (
                <button
                  disabled
                  title="Private repository"
                  className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                >
                  <Lock className="w-[13px]" />
                </button>
              ) : (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                >
                  <FiGithub size={13} /> Code
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-amber-400 text-amber-950 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
            <FiStar size={9} className="fill-amber-950" /> Featured
          </div>
        )}

        {/* Index number */}
        <div className="absolute top-3 right-3 text-[10px] font-mono font-bold text-white/40">
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base leading-snug text-gray-900 dark:text-gray-100 line-clamp-2">
            {project.title}
          </h3>
          <StatusDot status={project.status} />
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">
          {project.shortDescription}
        </p>

        {/* Tech stack */}
        {project.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 4).map((t) => (
              <TechBadge key={t} tech={t} />
            ))}
            {project.techStack.length > 4 && (
              <span className="text-[10px] text-gray-400 font-mono self-center">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <Link
          to={`/archives/${project.slug}`}
          className="mt-1 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-violet-500 dark:text-violet-400 hover:text-violet-600 dark:hover:text-violet-300 transition-colors group/link"
        >
          View Details
          <FiArrowRight
            size={13}
            className="transition-transform group-hover/link:translate-x-1"
          />
        </Link>
      </div>
    </motion.article>
  );
}

export default GridCard;
