import { useState, useEffect, useRef } from "preact/hooks";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getBlogBySlug, getBlogs } from "../../../services/portfolioService";
import useFetch from "../../../hooks/useFetch";
import ErrorState from "../../../components/ui/ErrorState";
import { formatDate } from "../../../utils/helpers";
import {
  FiClock,
  FiEye,
  FiArrowLeft,
  FiArrowRight,
  FiShare2,
  FiBookmark,
  FiCheck,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa6";
import RichTextContent from "../../../components/ui/RichTextContent";
import ScrollTop from "./ScrollTop";
import ReadingProgress from "./ReadingProgress";
import TableOfContents from "./TableOfContents";
import DetailSkeleton from "./DetailSkeleton";
import RelatedCard from "./RelatedCard";

//  Main component
export default function BlogDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useFetch(getBlogBySlug, slug, [
    slug,
  ]);
  const { data: allData } = useFetch(getBlogs, {}, []);

  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [headings, setHeadings] = useState([]);
  const contentRef = useRef(null);

  const blog = data?.blog || data;
  const blogs = allData?.blogs || [];

  // Related posts (same category, exclude current)
  const related = blogs
    .filter((b) => b.slug !== slug && b.category === blog?.category)
    .slice(0, 3);

  // Prev / Next (by date order)
  const sorted = [...blogs].sort(
    (a, b) =>
      new Date(a.publishedAt || a.createdAt) -
      new Date(b.publishedAt || b.createdAt),
  );
  const idx = sorted.findIndex((b) => b.slug === slug);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : null;

  // Extract headings for ToC from rendered content
  useEffect(() => {
    if (!contentRef.current) return;
    const els = contentRef.current.querySelectorAll("h2, h3");
    const list = [];
    els.forEach((el, i) => {
      if (!el.id) el.id = `heading-${i}`;
      list.push({
        id: el.id,
        text: el.textContent,
        level: el.tagName === "H2" ? 2 : 3,
      });
    });
    setHeadings(list);
  }, [blog]);

  // Intersection observer for active ToC link
  useEffect(() => {
    if (!headings.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-10% 0px -80% 0px" },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [headings]);

  // Copy link
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full overflow-y-scroll bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-gray-200">
      <div className="min-h-screen">
        <ReadingProgress />
        <ScrollTop />

        {/* Back nav */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-28 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-xs tracking-widest uppercase transition-colors duration-300"
          >
            <motion.span whileHover={{ x: -3 }} transition={{ duration: 0.2 }}>
              <FiArrowLeft size={13} />
            </motion.span>
            Back
          </button>
        </div>

        {/*  States */}
        {error && (
          <div className="max-w-2xl mx-auto px-4 md:px-6 py-16">
            <ErrorState message={error} onRetry={refetch} />
          </div>
        )}

        {loading && (
          <div className="max-w-2xl mx-auto px-4 md:px-6 pb-24 pt-8">
            <DetailSkeleton />
          </div>
        )}

        {!loading && !error && blog && (
          <div className="max-w-6xl mx-auto px-4 md:px-6 pb-24">
            <div className="flex gap-12 xl:gap-20">
              {/* Left sidebar (desktop) */}
              <aside className="hidden lg:flex flex-col gap-8 w-44 xl:w-52 shrink-0 pt-8">
                {/* Sticky wrapper */}
                <div className="sticky top-24 space-y-10">
                  {/* Meta */}
                  <div className="space-y-3">
                    <p className="text-[10px] tracking-widest uppercase">
                      Published
                    </p>
                    <p className="text-xs">
                      {formatDate(blog.publishedAt || blog.createdAt, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] tracking-widest uppercase">
                      Reading time
                    </p>
                    <p className="text-xs flex items-center gap-1.5">
                      <FiClock size={11} /> {blog.readTime} min read
                    </p>
                  </div>

                  {blog.views != null && (
                    <div className="space-y-3">
                      <p className="text-[10px] tracking-widest uppercase">
                        Views
                      </p>
                      <p className="text-xs flex items-center gap-1.5">
                        <FiEye size={11} /> {blog.views?.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      title="Copy link"
                      className="w-8 h-8 rounded-lg flex items-center justify-center
                      border border-black/8 dark:border-white/8
                    
                      hover:border-black/20 dark:hover:border-white/20
                      hover:text-black dark:hover:text-white
                      transition-all duration-300"
                    >
                      {copied ? <FiCheck size={13} /> : <FiShare2 size={13} />}
                    </button>
                    <button
                      onClick={() => setBookmarked((b) => !b)}
                      title="Bookmark"
                      className={`w-8 h-8 rounded-lg flex items-center justify-center
                      border transition-all duration-300
                      ${
                        bookmarked
                          ? "bg-black dark:bg-white text-white dark:text-black border-transparent"
                          : "border-black/8 dark:border-white/8 hover:border-black/20 dark:hover:border-white/20 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      <FiBookmark size={13} />
                    </button>
                  </div>

                  {/* Table of contents */}
                  <TableOfContents headings={headings} activeId={activeId} />
                </div>
              </aside>

              {/* Main content */}
              <main className="flex-1 min-w-0 pt-8">
                {/* Header */}
                <motion.header
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-10"
                >
                  {/* Category + featured */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs tracking-widest uppercase ">
                      {blog.category}
                    </span>
                    {blog.featured && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-black/10 dark:bg-white/10" />
                        <span className="flex items-center gap-1 text-xs text-amber-500">
                          <FaStar size={9} /> Featured
                        </span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h1
                    className="text-3xl md:text-4xl xl:text-5xl font-bold
                  leading-[1.15] tracking-tight mb-6"
                  >
                    {blog.title}
                  </h1>

                  {/* Excerpt */}
                  {blog.excerpt && (
                    <p className="text-base leading-relaxed max-w-2xl">
                      {blog.excerpt}
                    </p>
                  )}

                  {/* Meta row */}
                  <div
                    className="flex flex-wrap items-center gap-4 mt-7
                  pt-6 border-t border-black/5 dark:border-white/5"
                  >
                    {/* Author */}
                    {blog.author && (
                      <div className="flex items-center gap-2">
                        {blog.author.avatar ? (
                          <img
                            src={blog.author.avatar}
                            alt={blog.author.name}
                            className="w-7 h-7 rounded-full object-cover grayscale"
                          />
                        ) : (
                          <div
                            className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/5
                          flex items-center justify-center text-xs"
                          >
                            {blog.author.name?.[0]}
                          </div>
                        )}
                        <span className="text-xs">{blog.author.name}</span>
                      </div>
                    )}

                    <span className="text-xs">
                      {formatDate(blog.publishedAt || blog.createdAt, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>

                    <span className="flex items-center gap-1 text-xs">
                      <FiClock size={11} /> {blog.readTime} min read
                    </span>

                    {blog.views != null && (
                      <span className="flex items-center gap-1 text-xs ">
                        <FiEye size={11} /> {blog.views?.toLocaleString()}
                      </span>
                    )}

                    {/* Mobile actions */}
                    <div className="flex gap-2 ml-auto lg:hidden">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-xs
                        hover:text-black dark:hover:text-white transition-colors duration-300"
                      >
                        {copied ? (
                          <FiCheck size={12} />
                        ) : (
                          <FiShare2 size={12} />
                        )}
                        {copied ? "Copied" : "Share"}
                      </button>
                      <button
                        onClick={() => setBookmarked((b) => !b)}
                        className={`flex items-center gap-1.5 text-xs transition-colors duration-300
                        ${bookmarked ? "text-black dark:text-white" : "hover:text-black dark:hover:text-white"}`}
                      >
                        <FiBookmark size={12} />
                      </button>
                    </div>
                  </div>
                </motion.header>

                {/* Hero image */}
                {blog.thumbnail && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.6 }}
                    className="mb-12 rounded-2xl overflow-hidden
                    border border-black/5 dark:border-white/5
                    aspect-16/7"
                  >
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}

                {/* Tags row (mobile) */}
                {blog.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8 lg:hidden">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full
                        border border-black/8 dark:border-white/8"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Content */}
                <motion.div
                  ref={contentRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                >
                  <RichTextContent content={blog.content} />
                </motion.div>

                {/* Tags (desktop) */}
                {blog.tags?.length > 0 && (
                  <div
                    className="flex flex-wrap gap-2 mt-14 pt-8
                  border-t border-black/5 dark:border-white/5"
                  >
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1.5 rounded-full
                        border border-black/8 dark:border-white/8
                        hover:border-black/20 dark:hover:border-white/20
                        hover:text-black dark:hover:text-white
                        transition-all duration-300 cursor-default"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Prev / Next navigation  */}
                {(prev || next) && (
                  <div
                    className="grid grid-cols-2 gap-4 mt-16
                  pt-10 border-t border-black/5 dark:border-white/5"
                  >
                    {prev ? (
                      <Link
                        to={`/blog/${prev.slug}`}
                        className="group flex flex-col gap-2 p-5
                        border border-black/5 dark:border-white/5
                        hover:border-black/15 dark:hover:border-white/15
                        rounded-2xl transition-all duration-300"
                      >
                        <span
                          className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase group-hover:text-black/40 dark:group-hover:text-white/40
                        transition-colors duration-300"
                        >
                          <FiArrowLeft size={10} /> Previous
                        </span>
                        <span
                          className="text-sm font-semibold
                        group-hover:opacity-60 transition-opacity line-clamp-2 leading-snug"
                        >
                          {prev.title}
                        </span>
                      </Link>
                    ) : (
                      <div />
                    )}

                    {next ? (
                      <Link
                        to={`/blog/${next.slug}`}
                        className="group flex flex-col gap-2 p-5 text-right
                        border border-black/5 dark:border-white/5
                        hover:border-black/15 dark:hover:border-white/15
                        rounded-2xl transition-all duration-300"
                      >
                        <span
                          className="flex items-center justify-end gap-1.5 text-[10px] tracking-widest uppercase
                        group-hover:text-black/40 dark:group-hover:text-white/40
                        transition-colors duration-300"
                        >
                          Next <FiArrowRight size={10} />
                        </span>
                        <span
                          className="text-sm font-semibold 
                        group-hover:opacity-60 transition-opacity line-clamp-2 leading-snug"
                        >
                          {next.title}
                        </span>
                      </Link>
                    ) : (
                      <div />
                    )}
                  </div>
                )}

                {/* Related posts */}
                {related.length > 0 && (
                  <section className="mt-20 pt-10 border-t border-black/5 dark:border-white/5">
                    <p className="text-[10px] tracking-widest uppercase mb-6">
                      Related posts
                    </p>
                    <div className="space-y-3">
                      {related.map((b, i) => (
                        <RelatedCard key={b._id} blog={b} index={i} />
                      ))}
                    </div>
                  </section>
                )}
              </main>

              {/* Right sidebar (desktop)  */}
              <aside className="hidden xl:block w-44 shrink-0 pt-8">
                <div className="sticky top-24 space-y-8">
                  {/* Tags */}
                  {blog.tags?.length > 0 && (
                    <div>
                      <p className="text-[10px] tracking-widest uppercase mb-3">
                        Tags
                      </p>
                      <div className="flex flex-col gap-2">
                        {blog.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs 
                            hover:text-black dark:hover:text-white
                            transition-colors duration-300 cursor-default"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related snippets */}
                  {related.length > 0 && (
                    <div>
                      <p className="text-[10px] tracking-widest uppercase mb-3">
                        Also in {blog.category}
                      </p>
                      <div className="space-y-4">
                        {related.slice(0, 2).map((b) => (
                          <Link
                            key={b._id}
                            to={`/blog/${b.slug}`}
                            className="group block"
                          >
                            <p
                              className="text-xs
                            group-hover:text-black dark:group-hover:text-white
                            transition-colors duration-300 line-clamp-2 leading-snug"
                            >
                              {b.title}
                            </p>
                            <span className="text-[10px]  mt-1 block">
                              {b.readTime} min
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Back to blog */}
                  <Link
                    to="/blog"
                    className="group flex items-center gap-1.5 text-[10px] tracking-widest uppercase
                    
                    hover:text-black dark:hover:text-white
                    transition-colors duration-300"
                  >
                    <FiArrowLeft size={10} />
                    All posts
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
