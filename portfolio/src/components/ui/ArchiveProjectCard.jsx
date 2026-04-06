import { motion } from "framer-motion";
import { Link } from "react-router-dom";
export default function ArchiveProjectCard({ project }) {
  return (
    <Link to={`/archives/${project.slug}`} className="block group">
      <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative rounded-2xl overflow-hidden bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl"
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={project.thumbnail}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">
            <span className="text-white text-sm tracking-wide">
              View Project →
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold dark:text-gray-200">
            {project.title}
          </h3>

          <p className="text-sm text-gray-500 line-clamp-2">
            {project.shortDescription}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
