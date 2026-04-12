import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";
//  Prev / Next Navigator Card
export default function NavProjectCard({ project, direction, onClick }) {
  if (!project) return <div />;
  const isNext = direction === "next";
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: isNext ? 4 : -4 }}
      className={`group flex ${isNext ? "flex-row-reverse" : "flex-row"} items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-violet-400/60 dark:hover:border-violet-500/50 transition-colors duration-200 w-full max-w-xs text-left`}
    >
      {/* Arrow */}
      <div
        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 group-hover:bg-violet-500 transition-colors ${isNext ? "group-hover:translate-x-0.5" : "group-hover:-translate-x-0.5"}`}
      >
        {isNext ? (
          <FiChevronRight
            size={16}
            className="text-gray-500 group-hover:text-white transition-colors"
          />
        ) : (
          <FiChevronLeft
            size={16}
            className="text-gray-500 group-hover:text-white transition-colors"
          />
        )}
      </div>
      {/* Thumbnail */}
      {project.thumbnail && (
        <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            loading="lazy"
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {/* Text */}
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
          {isNext ? "Next" : "Previous"}
        </span>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate leading-tight">
          {project.title}
        </span>
      </div>
    </motion.button>
  );
}
