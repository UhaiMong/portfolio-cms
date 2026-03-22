import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiClock, FiArrowRight } from "react-icons/fi";

//  Related card
function RelatedCard({ blog, index }) {
  return (
    <Link to={`/blog/${blog.slug}`}>
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08 }}
        whileHover="hover"
        className="group flex gap-4 p-4
          border border-black/5 dark:border-white/5
          hover:border-black/15 dark:hover:border-white/15
          rounded-2xl transition-all duration-400"
      >
        <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-black/3 dark:bg-white/3">
          {blog.thumbnail ? (
            <motion.img
              src={blog.thumbnail}
              alt={blog.title}
              variants={{ hover: { scale: 1.08 } }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-cente">
              ✍
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] tracking-widest uppercase">
            {blog.category}
          </span>
          <h4
            className="text-sm font-semibold
            group-hover:opacity-60 transition-opacity duration-300
            line-clamp-2 mt-0.5 leading-snug"
          >
            {blog.title}
          </h4>
          <span className="text-xs flex items-center gap-1 mt-1">
            <FiClock size={10} /> {blog.readTime} min
          </span>
        </div>
        <motion.span
          variants={{ hover: { x: 3 } }}
          className=" group-hover:text-black dark:group-hover:text-white transition-colors mt-1 shrink-0"
        >
          <FiArrowRight size={13} />
        </motion.span>
      </motion.article>
    </Link>
  );
}
export default RelatedCard;
