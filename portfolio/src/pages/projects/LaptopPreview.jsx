// ── Laptop / Project preview
import { motion } from "framer-motion";

function ProjectPreview({ project }) {
  if (!project)
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center
       gap-4"
      >
        <div className="w-16 h-16 border border-current rounded-full flex items-center justify-center">
          <span className="text-2xl">⌨</span>
        </div>
        <p className="text-xs tracking-widest uppercase">Hover a project</p>
      </div>
    );
  return (
    <motion.div
      key={project._id}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex justify-center"
    >
      <div className="relative w-full">
        {" "}
        <div className="absolute z-20 top-[6%] left-[12%] flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="absolute top-[5.7%] left-[10.2%] w-[80%] h-[73%] object-contain overflow-hidden rounded-md">
          {project.thumbnail ? (
            <img
              loading="lazy"
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover object-top
                grayscale hover:grayscale-0 transition-all duration-700"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center
              text-white/10 text-xs uppercase tracking-widest"
            >
              No preview
            </div>
          )}
        </div>
        <img
          loading="lazy"
          src="/images/laptopScreen.svg"
          alt="Laptop"
          className="w-full"
        />
      </div>
    </motion.div>
  );
}
export default ProjectPreview;
