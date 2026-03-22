// Project list item
import { motion, AnimatePresence } from "framer-motion";
import { BsArrowRight } from "react-icons/bs";
import { FaStar } from "react-icons/fa6";
function ProjectListItem({
  project,
  index,
  isActive,
  onHover,
  onLeave,
  onClick,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      onMouseEnter={() => onHover(project)}
      onMouseLeave={onLeave}
      onClick={() => onClick(project)}
      className={`group relative flex items-center gap-4 p-4 rounded-xl cursor-pointer
        border transition-all duration-300
        ${
          isActive
            ? "border-black dark:border-white bg-black/5 dark:bg-white/5"
            : "border-transparent hover:border-black/10 dark:hover:border-white/10 hover:bg-black/3 dark:hover:bg-white/3"
        }`}
    >
      {/* Index */}
      <span className="text-xs font-mono  w-6 shrink-0">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-x-2.5">
        {/* Thumbnail — grayscale → color */}
        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-black/5 dark:bg-white/5">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center  text-xs">
              No img
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm">{project.title}</h3>
            {project.featured && (
              <FaStar
                size={10}
                className="
              group-hover:text-amber-400 transition-colors duration-500 shrink-0"
              />
            )}
          </div>
          <p className="text-xs mt-0.5">{project.category}</p>
          {/* Tech stack pills */}
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {project.techStack?.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-xs px-1.5 py-0.5 rounded
                group-hover:bg-black/10 dark:group-hover:bg-white/10
                transition-colors duration-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="text-right flex-1 flex justify-end shrink-0 gap-x-2 items-center">
        <span
          className={`text-xs px-2 py-0.5 rounded-full shrink-0 transition-all duration-500 text-right
        ${
          project.status === "completed"
            ? " group-hover:bg-green-100 group-hover:text-green-600 dark:group-hover:bg-green-900/30 dark:group-hover:text-green-400"
            : project.status === "in-progress"
              ? " group-hover:bg-yellow-100 group-hover:text-yellow-600 dark:group-hover:bg-yellow-900/30 dark:group-hover:text-yellow-400"
              : ""
        }`}
        >
          {project.status}
        </span>

        {/* Arrow */}
        <span
          className="
        group-hover:text-black dark:group-hover:text-white
        group-hover:translate-x-1 transition-all duration-300 shrink-0"
        >
          <BsArrowRight />
        </span>
      </div>
    </motion.div>
  );
}
export default ProjectListItem;
