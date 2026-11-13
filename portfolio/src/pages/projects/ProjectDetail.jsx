//  Project detail panel
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa6";
import { FiExternalLink, FiGithub, FiX, FiEye } from "react-icons/fi";
import RichTextContent from "../../components/ui/RichTextContent";
import { Link } from "react-router-dom";
function ProjectDetail({ project, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25 }}
      className="h-[72vh] w-full overflow-y-auto flex flex-col [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-xs tracking-widest uppercase
          hover:text-black dark:hover:text-white
          transition-colors duration-200 mb-5 self-start"
      >
        <FiX size={14} /> Back to list
      </button>

      {/* Thumbnail — grayscale → color */}
      {project.thumbnail && (
        <div className="relative h-44 rounded-xl overflow-hidden mb-5 group">
          <img
            loading="lazy"
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          {project.featured && (
            <span
              className="absolute top-3 left-3 flex items-center gap-1
              text-xs bg-white/10 backdrop-blur-sm text-white px-2 py-1 rounded-full"
            >
              <FaStar size={9} className="text-amber-400" /> Featured
            </span>
          )}
        </div>
      )}

      {/* Title + meta */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-1">{project.title}</h2>
        <div className="flex items-center gap-2 text-xs">
          <span>{project.category}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <FiEye size={11} /> {project.views || 0}
          </span>
        </div>
      </div>

      {/* Long Description */}
      {/* <p className="text-sm leading-relaxed mb-4">
        {project.longDescription || project.description}
      </p> */}
      <RichTextContent content={project.longDescription} />
      {/* Video embed (YouTube) */}
      {project.videoId ? (
        <div className="mb-4">
          <div className="relative w-full pb-[56.25%]">
            <iframe
              loading="lazy"
              className="absolute inset-0 w-full h-full rounded-md"
              src={`https://www.youtube.com/embed/${project.videoId}`}
              title={`${project.title} demo`}
              allowFullScreen
            />
          </div>
        </div>
      ) : null}
      {/* Aditional Image */}
      <h2 className="text-2xl md:text-3xl font-bold my-3">
        Aditional Project Images
      </h2>
      {project.images && (
        <div className="flex flex-col justify-start w-full mt-3">
          {project.images.map((img, i) => (
            <img
              loading="lazy"
              className="w-full h-auto object-cover"
              key={i}
              src={img}
              alt={`Aditional project image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Tech stack */}
      {project.techStack?.length > 0 && (
        <div className="mb-5 mt-5">
          <p className="text-xs tracking-widest uppercase  mb-2">Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1 border border-black/10 dark:border-white/10
                   rounded-full
                  hover:border-black dark:hover:border-white
                  hover:text-black dark:hover:text-white
                  transition-all duration-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="flex gap-3 mt-auto pt-4 border-t border-black/5 dark:border-white/5">
        {project.liveUrl && (
          <Link
            to={`/project/live-preview/${project.slug}`}
            className="flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-2.5
              hover:bg-black/80 dark:hover:bg-white/80
              transition-all duration-300"
          >
            <FiExternalLink size={12} /> Live Preview
          </Link>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-2.5
              border border-black/10 dark:border-white/10
              hover:border-black dark:hover:border-white
              hover:text-black dark:hover:text-white
              transition-all duration-300"
          >
            <FiGithub size={12} /> Source
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default ProjectDetail;
