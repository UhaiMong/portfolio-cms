import { useState, useEffect } from "preact/hooks";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { getBlogs } from "../services/portfolioService";
import useFetch from "../hooks/useFetch";
import SectionHeading from "../components/ui/SectionHeading";
import ErrorState from "../components/ui/ErrorState";
import { FiSearch, FiX } from "react-icons/fi";
import BlogSkeleton from "./blog/BlogSkeleton";
import FeaturedCard from "./blog/FeaturedCard";
import BlogCard from "./blog/BlogCard";
import BlogListItem from "./blog/BlogListItem";
import Seo from "../components/Seo";
import { SITE } from "../config/site";

// Main Blog page
export default function Blog() {
  const { data, loading, error, refetch } = useFetch(getBlogs, {}, []);
  const { theme } = useTheme();

  // LinkedIn's script scans the DOM once on load, so re-inject it whenever the badge remounts.
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.linkedin.com/badges/js/profile.js";
    script.async = true;
    document.body.appendChild(script);
    return () => script.remove();
  }, [theme]);

  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [activeCat, setActiveCat] = useState("All");
  const [viewMode, setViewMode] = useState("grid");

  const blogs = data?.blogs || [];
  const featured = blogs.find((b) => b.featured);
  const rest = blogs.filter((b) => !b.featured);

  // Derive filter options
  const categories = [
    "All",
    ...new Set(blogs.map((b) => b.category).filter(Boolean)),
  ];
  const allTags = ["All", ...new Set(blogs.flatMap((b) => b.tags || []))].slice(
    0,
    10,
  );

  // Filter logic
  const filtered = rest.filter((b) => {
    const matchSearch =
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      b.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCat === "All" || b.category === activeCat;
    const matchTag = activeTag === "All" || b.tags?.includes(activeTag);
    return matchSearch && matchCat && matchTag;
  });

  return (
    <div className="w-full bg-gray-200  text-gray-900 dark:text-gray-200 dark:bg-linear-to-b from-slate-900 via-indigo-950 to-slate-900">
      <Seo
        title="Blog"
        description={`Articles and notes by ${SITE.name} on code, design, and building products.`}
        path="/blog"
      />
      <div className="min-h-screen">
        {/*  Hero banner  */}
        <section className="relative pt-32 pb-20 px-4 md:px-6 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.015]"
            style={{
              backgroundImage:
                "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="max-w-6xl mx-auto relative">
            <SectionHeading
              label="Writing"
              title="Thoughts & Ideas"
              subtitle="Explorations in code, design, and everything in between."
            />
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 md:px-6 pb-24 space-y-16">
          {/* Error */}
          {error && <ErrorState message={error} onRetry={refetch} />}

          {/* Loading */}
          {loading && (
            <div className="space-y-12">
              <div className="h-80 bg-black/5 dark:bg-white/5 rounded-3xl animate-pulse" />
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <BlogSkeleton key={i} />
                ))}
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Featured post */}
              {featured && <FeaturedCard blog={featured} />}

              {/* Filters */}
              <div className="space-y-4">
                {/* Search + view toggle */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <FiSearch
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2
                      "
                    />
                    <input
                      value={search}
                      onInput={(e) => setSearch(e.target.value)}
                      placeholder="Search posts..."
                      className="w-full pl-9 pr-9 py-2.5 text-sm
                      bg-transparent border border-black/5 dark:border-white/5
                      hover:border-black/10 dark:hover:border-white/10
                      focus:border-black/20 dark:focus:border-white/20
                   
                      placeholder-black/20 dark:placeholder-white/20
                      rounded-xl outline-none transition-all duration-300"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2
                        
                        hover:text-black dark:hover:text-white transition-colors"
                      >
                        <FiX size={13} />
                      </button>
                    )}
                  </div>

                  {/* View mode */}
                  <div className="flex items-center gap-1 border border-black/5 dark:border-white/5 rounded-xl p-1">
                    {["grid", "list"].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-200
                        ${
                          viewMode === mode
                            ? "bg-black dark:bg-white text-white dark:text-black"
                            : "text-black/10 dark:text-white/30 hover:text-black dark:hover:text-white"
                        }`}
                      >
                        {mode === "grid" ? "⊞" : "≡"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category pills */}
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCat(cat)}
                      className={`text-xs px-4 py-1.5 rounded-full
                      tracking-wide transition-all duration-300
                      ${
                        activeCat === cat
                          ? "bg-black dark:bg-white text-white dark:text-black"
                          : "border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Tag pills */}
                {allTags.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setActiveTag(tag)}
                        className={`text-xs px-3 py-1 rounded-full
                        transition-all duration-300
                        ${
                          activeTag === tag
                            ? "text-black dark:text-white"
                            : " hover:text-black/50 dark:hover:text-white/50"
                        }`}
                      >
                        {tag === "All" ? "All tags" : `#${tag}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Posts */}
              <AnimatePresence mode="wait">
                {filtered.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-center"
                  >
                    <p className="text-5xl mb-6">✍</p>
                    <p className="text-sm">No posts match your search</p>
                    <button
                      onClick={() => {
                        setSearch("");
                        setActiveCat("All");
                        setActiveTag("All");
                      }}
                      className="mt-4 text-xs tracking-widest uppercase
                      
                      hover:text-black dark:hover:text-white
                      transition-colors duration-300"
                    >
                      Clear filters
                    </button>
                  </motion.div>
                ) : viewMode === "grid" ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {filtered.map((b, i) => (
                      <BlogCard key={b._id} blog={b} index={i} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {filtered.map((b, i) => (
                      <BlogListItem key={b._id} blog={b} index={i} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Post count */}
              {filtered.length > 0 && (
                <p className="text-center text-xs tracking-widest uppercase">
                  {filtered.length} post{filtered.length !== 1 ? "s" : ""}
                  {activeCat !== "All" || activeTag !== "All" || search
                    ? " found"
                    : " total"}
                </p>
              )}
            </>
          )}
        </div>
        <div className="max-w-6xl mx-auto px-4 md:px-6 pb-16 flex justify-center">
          <div
            key={theme}
            className="badge-base LI-profile-badge"
            data-locale="en_US"
            data-size="medium"
            data-theme={theme}
            data-type="HORIZONTAL"
            data-vanity="uhai-mong"
            data-version="v1"
          >
            <a
              className="badge-base__link LI-simple-link"
              href="https://bd.linkedin.com/in/uhai-mong?trk=profile-badge"
            >
              Uhai Mong
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
