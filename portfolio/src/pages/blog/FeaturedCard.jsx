import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiClock, FiEye, FiArrowRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa6";
import { formatDate, truncate } from "../../utils/helpers";

// Featured blog card (large)
function FeaturedCard({ blog }) {
  return (
    <Link to={`/blog/${blog.slug}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover="hover"
        className="group relative grid md:grid-cols-2 gap-0
          border border-black/5 dark:border-white/5
          hover:border-black/20 dark:hover:border-white/20
          rounded-3xl overflow-hidden transition-all duration-500"
      >
        {/* Image */}
        <div className="relative h-64 md:h-auto overflow-hidden bg-black/3 dark:bg-white/3">
          {blog.thumbnail ? (
            <motion.img
              src={blog.thumbnail}
              alt={blog.title}
              variants={{ hover: { scale: 1.05 } }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full h-full object-cover
                grayscale group-hover:grayscale-0
                transition-all duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              ✍
            </div>
          )}
          {/* Featured badge */}
          <div
            className="absolute top-4 left-4 flex items-center gap-1.5
            bg-black/80 dark:bg-white/10 backdrop-blur-sm
            text-white text-xs px-3 py-1.5 rounded-full"
          >
            <FaStar size={9} className="text-amber-400" />
            Featured
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between p-8 md:p-10">
          <div>
            {/* Category + meta */}
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-xs tracking-widest uppercase
                group-hover:text-black dark:group-hover:text-white
                transition-colors duration-300"
              >
                {blog.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-black/10 dark:bg-white/10" />
              <span className="flex items-center gap-1 text-xs ">
                <FiClock size={11} /> {blog.readTime} min read
              </span>
            </div>

            <h2
              className="text-2xl md:text-3xl font-bold leading-snug
               mb-4
              group-hover:opacity-80 transition-opacity duration-300"
            >
              {blog.title}
            </h2>

            <p className="text-sm leading-relaxed">
              {truncate(blog.excerpt, 160)}
            </p>
          </div>

          <div
            className="flex items-center justify-between mt-8
            pt-6 border-t border-black/5 dark:border-white/5"
          >
            <div className="flex items-center gap-4 text-xs ">
              <span>
                {formatDate(blog.publishedAt || blog.createdAt, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <FiEye size={11} /> {blog.views}
              </span>
            </div>
            <motion.span
              variants={{ hover: { x: 4 } }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 text-xs tracking-widest uppercase
                
                group-hover:text-black dark:group-hover:text-white
                transition-colors duration-300"
            >
              Read <FiArrowRight size={12} />
            </motion.span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
export default FeaturedCard;
