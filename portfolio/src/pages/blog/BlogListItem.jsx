import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiClock, FiArrowRight } from "react-icons/fi";

// List style card (for compact view)
function BlogListItem({ blog, index }) {
  return (
    <Link to={`/blog/${blog.slug}`}>
      <motion.article
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.06 }}
        className="group flex items-start gap-5 py-6
          border-b border-black/5 dark:border-white/5
          hover:border-black/10 dark:hover:border-white/10
          transition-all duration-300"
      >
        {/* Index */}
        <span className="text-xs font-mono mt-1 w-6 shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Thumbnail */}
        <div
          className="w-20 h-16 rounded-xl overflow-hidden shrink-0
          bg-black/3 dark:bg-white/3"
        >
          {blog.thumbnail ? (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-full object-cover
                grayscale group-hover:grayscale-0
                transition-all duration-500"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center
              "
            >
              ✍
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-xs tracking-widest uppercase
              "
            >
              {blog.category}
            </span>
            <span className="">·</span>
            <span className="text-xs flex items-center gap-1">
              <FiClock size={10} /> {blog.readTime} min
            </span>
          </div>
          <h3
            className="font-semibold text-sm 
            group-hover:opacity-60 transition-opacity duration-300 truncate"
          >
            {blog.title}
          </h3>
          <p className="text-xs mt-1 line-clamp-1">{blog.excerpt}</p>
        </div>

        {/* Arrow */}
        <motion.span
          whileHover={{ x: 4 }}
          className="
            group-hover:text-black dark:group-hover:text-white
            transition-colors duration-300 mt-1 shrink-0"
        >
          <FiArrowRight size={14} />
        </motion.span>
      </motion.article>
    </Link>
  );
}
export default BlogListItem;
