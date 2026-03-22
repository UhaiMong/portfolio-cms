import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiClock, FiArrowRight } from "react-icons/fi";
import { formatDate } from "../../utils/helpers";

// Regular blog card
function BlogCard({ blog, index }) {
  return (
    <Link to={`/blog/${blog.slug}`}>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.07, duration: 0.5 }}
        whileHover="hover"
        className="group flex flex-col h-full
          border border-black/5 dark:border-white/5
          hover:border-black/20 dark:hover:border-white/20
          rounded-2xl overflow-hidden transition-all duration-500"
      >
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden bg-black/3 dark:bg-white/3 shrink-0">
          {blog.thumbnail ? (
            <motion.img
              src={blog.thumbnail}
              alt={blog.title}
              variants={{ hover: { scale: 1.06 } }}
              transition={{ duration: 0.7 }}
              className="w-full h-full object-cover
                grayscale group-hover:grayscale-0
                transition-all duration-700"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center
               text-4xl"
            >
              ✍
            </div>
          )}

          {/* Tags overlay */}
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {blog.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full
                  bg-black/60 dark:bg-black/70 backdrop-blur-sm
                  text-white/70 group-hover:text-white
                  transition-colors duration-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-6">
          {/* Category */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-xs tracking-widest uppercase
              
              group-hover:text-black/60 dark:group-hover:text-white/60
              transition-colors duration-300"
            >
              {blog.category}
            </span>
            <span className="flex items-center gap-1 text-xs">
              <FiClock size={10} /> {blog.readTime} min
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-bold text-base leading-snug
            mb-3
            group-hover:opacity-70 transition-opacity duration-300 line-clamp-2"
          >
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p
            className="text-xs
            leading-relaxed flex-1 line-clamp-3"
          >
            {blog.excerpt}
          </p>

          {/* Footer */}
          <div
            className="flex items-center justify-between mt-5 pt-4
            border-t border-black/5 dark:border-white/5"
          >
            <span className="text-xs ">
              {formatDate(blog.publishedAt || blog.createdAt, {
                month: "short",
                day: "numeric",
              })}
            </span>
            <motion.span
              variants={{ hover: { x: 3 } }}
              className="
                group-hover:text-black dark:group-hover:text-white
                transition-colors duration-300"
            >
              <FiArrowRight size={14} />
            </motion.span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
export default BlogCard;
