import { FiArrowRight, FiExternalLink, FiGithub, FiStar } from "react-icons/fi";
import TechBadge from "./TechBadge";
import StatusDot from "./StatusDot";
import { cardVariants } from "./CardVarients";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// List Card
function ListCard({ project, index }) {
  return (
    <motion.article
      variants={cardVariants}
      className="group flex gap-5 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-400/50 dark:hover:border-green-500/40 transition-colors duration-300 shadow-soft"
    >
      {/* Thumbnail */}
      <div className="relative shrink-0 w-28 h-20 sm:w-36 sm:h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl font-black text-gray-300 dark:text-gray-700">
              {project.title?.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0 gap-1.5 justify-center">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">
            {project.title}
          </h3>
          <StatusDot status={project.status} />
          {project.featured && (
            <span className="flex items-center gap-1 text-amber-500 text-[10px] font-bold uppercase tracking-widest">
              <FiStar size={9} className="fill-amber-500" /> Featured
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {project.shortDescription}
        </p>
        <div className="flex items-center gap-2 flex-wrap mt-1">
          {project.techStack?.slice(0, 3).map((t) => (
            <TechBadge key={t} tech={t} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex flex-col items-end justify-between gap-2 ml-2">
        <span className="text-[10px] font-mono text-gray-400">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex flex-col items-end gap-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-500 transition-colors"
            >
              <FiExternalLink size={14} />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-500 transition-colors"
            >
              <FiGithub size={14} />
            </a>
          )}
          <Link
            to={`/archives/${project.slug}`}
            className="text-gray-400 hover:text-green-500 transition-colors"
          >
            <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
export default ListCard;
