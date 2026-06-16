import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";

const FeaturedProjectCard = ({ project }) => {
  console.log(project);
  return (
    <motion.div
      className="py-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="grid grid-cols-12 justify-between items-center gap-5">
        <div className="col-span-12 md:col-span-6">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-neutral-900 via-neutral-700 to-neutral-500 dark:from-white dark:via-neutral-200 dark:to-neutral-500 mb-4 uppercase">
            Recent Featured <span className="block">Work</span>
          </h2>
          <h3 className="text-lg md:text-2xl font-semibold uppercase my-4">
            {project?.title}
          </h3>
          <p className="text-justify py-1.5">{project?.description}</p>
        </div>
        <div className="col-span-12 md:col-span-6">
          <img src={project?.thumbnail} alt="Featured project thumbnail" />
        </div>
      </div>
      <Link
        className="flex justify-between items-center text-xl bg-linear-to-r from-indigo-700 to-indigo-400 text-gray-100 px-2 py-1 rounded-2xl w-36 mt-6"
        to={`/archives/${project?.slug}`}
      >
        View Detail <ArrowRight />
      </Link>
    </motion.div>
  );
};

export default FeaturedProjectCard;
