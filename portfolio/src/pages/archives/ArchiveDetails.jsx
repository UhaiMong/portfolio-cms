import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiExternalLink,
  FiGithub,
  FiCalendar,
  FiTag,
  FiStar,
  FiClock,
  FiUser,
  FiLayers,
} from "react-icons/fi";
import Breadcrumbs from "../../components/ui/BreadCrumbs";
import StatusBadge from "./components/StatusBadge";
import Lightbox from "./components/LightBox";
import ShareButton from "./components/ShareButton";
import InfoPill from "./components/InfoPill";
import useProjectDetails from "../../hooks/useProjectDetails";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import DetailsSkeleton from "./components/DetailsSkeleton";
import TechBadge from "./components/TechBadge";

// Main Component
export default function ProjectGalleryDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { project, prev, next, loading } = useProjectDetails(slug);

  if (loading) {
    return <DetailsSkeleton />;
  }
  const [allProjects, setAllProjects] = useState([]);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const contentRef = useRef(null);

  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  const goTo = useCallback(
    (target) => {
      if (target) navigate(`/archives/${target.slug}`);
    },
    [navigate],
  );

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (lightbox) return;
      if (e.key === "ArrowLeft" && prevProject) goTo(prevProject);
      if (e.key === "ArrowRight" && nextProject) goTo(nextProject);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prevProject, nextProject, goTo]);

  // Gallery images (thumbnail + additionalImages)
  const galleryImages = project
    ? [project.thumbnail, ...(project.images ?? [])].filter(Boolean)
    : [];

  const formatDate = (d) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">😕</div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {error ?? "Project not found"}
        </h2>
        <Link
          to="/archives"
          className="px-6 py-2.5 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
        >
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            images={lightbox.images}
            startIndex={lightbox.index}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>

      <article className="min-h-screen bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-gray-200">
        {/* ── Hero banner ── */}
        <div className="relative w-full mt-5 overflow-hidden">
          {/* Content over hero */}
          <div className="relative max-w-5xl mx-auto px-4 pt-10 pb-0">
            {/* Title block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {project.category && (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-green-400">
                    <FiTag size={9} /> {project.category}
                  </span>
                )}
                <StatusBadge status={project.status} />
                {project.featured && (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-amber-400">
                    <FiStar size={9} className="fill-amber-400" /> Featured
                  </span>
                )}
              </div>
              <Breadcrumbs />

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-4">
                {project.title}
              </h1>
              <p className="max-w-2xl leading-relaxed">
                {project.shortDescription}
              </p>
            </motion.div>

            {/* Hero image */}
            {project.thumbnail && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.15,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative -mb-1 rounded-t-2xl overflow-hidden cursor-pointer aspect-16/7 shadow-[0_-8px_40px_rgba(0,0,0,0.4)]"
                onClick={() => setLightbox({ images: galleryImages, index: 0 })}
              >
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-950/30 to-transparent" />
                {galleryImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium">
                    <FiLayers size={11} /> {galleryImages.length} images
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="max-w-5xl mx-auto px-4 py-10">
          {/* ── Top meta bar ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap items-center justify-between gap-3 mb-10"
          >
            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-sm font-semibold transition-colors shadow-[0_4px_16px_rgba(139,92,246,0.35)] hover:shadow-[0_4px_24px_rgba(139,92,246,0.5)]"
                >
                  <FiExternalLink size={14} /> Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:border-green-400/60 hover:text-green-500 transition-colors"
                >
                  <FiGithub size={14} /> Source Code
                </a>
              )}
              <ShareButton />
            </div>

            {/* Keyboard nav hint (desktop) */}
            {(prevProject || nextProject) && (
              <span className="hidden lg:block text-[10px] text-gray-400 font-mono">
                ← → to navigate
              </span>
            )}
          </motion.div>

          {/* ── Two-column layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
            {/* ── LEFT: main content ── */}
            <div className="min-w-0">
              {/* Tabs */}
              {galleryImages.length > 1 && (
                <div className="flex gap-1 mb-8 border-b border-gray-200 dark:border-gray-800">
                  {["overview", "gallery"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2.5 text-sm font-semibold capitalize border-b-2 -mb-px transition-colors ${
                        activeTab === tab
                          ? "border-green-500 text-green-500 dark:text-green-400"
                          : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                {activeTab === "overview" ? (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    ref={contentRef}
                  >
                    {/* Long description rendered from TinyMCE HTML */}
                    {project.longDescription ? (
                      <div
                        className="
                          prose prose-sm sm:prose-base max-w-none
                          dark:prose-invert
                          prose-headings:font-black prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                          prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                          prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                          prose-a:text-green-500 prose-a:no-underline hover:prose-a:underline
                          prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-bold
                          prose-code:text-green-500 dark:prose-code:text-green-400 prose-code:bg-green-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-['']
                          prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-pre:rounded-xl prose-pre:border prose-pre:border-gray-700
                          prose-blockquote:border-l-green-500 prose-blockquote:text-gray-500 dark:prose-blockquote:text-gray-400
                          prose-img:rounded-xl prose-img:shadow-lg prose-img:cursor-pointer
                          prose-ul:text-gray-600 dark:prose-ul:text-gray-300
                          prose-ol:text-gray-600 dark:prose-ol:text-gray-300
                          prose-li:marker:text-green-500
                          prose-hr:border-gray-200 dark:prose-hr:border-gray-800
                        "
                        dangerouslySetInnerHTML={{
                          __html: project.longDescription,
                        }}
                        onClick={(e) => {
                          // Allow clicking on images in the rich text to open lightbox
                          if (e.target.tagName === "IMG") {
                            const imgs = [
                              ...contentRef.current.querySelectorAll("img"),
                            ].map((i) => i.src);
                            const idx = imgs.indexOf(e.target.src);
                            setLightbox({
                              images: imgs.length ? imgs : [e.target.src],
                              index: idx >= 0 ? idx : 0,
                            });
                          }
                        }}
                      />
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic text-sm">
                        No detailed description provided.
                      </p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="gallery"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Video embed (YouTube) */}
                    {project.videoId ? (
                      <div className="mb-4">
                        <div className="relative w-full pb-[56.25%]">
                          <iframe
                            className="absolute inset-0 w-full h-full rounded-md"
                            src={`https://www.youtube.com/embed/${project.videoId}`}
                            title={`${project.title} demo`}
                            allowFullScreen
                          />
                        </div>
                      </div>
                    ) : null}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {galleryImages.map((img, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.94 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.06 }}
                          className="relative aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 cursor-pointer group"
                          onClick={() =>
                            setLightbox({ images: galleryImages, index: i })
                          }
                        >
                          <img
                            src={img}
                            alt={`${project.title} screenshot ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <FiExternalLink
                              className="opacity-0 group-hover:opacity-100 text-white transition-opacity"
                              size={20}
                            />
                          </div>
                          <span className="absolute bottom-2 right-2 text-[10px] font-mono text-white/60 bg-black/40 px-1.5 py-0.5 rounded">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── RIGHT: sidebar ── */}
            <motion.aside
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="flex flex-col gap-6"
            >
              {/* Project info pills */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                <InfoPill
                  icon={FiCalendar}
                  label="Started"
                  value={formatDate(project.startDate)}
                />
                <InfoPill
                  icon={FiCalendar}
                  label="Completed"
                  value={
                    formatDate(project.endDate) ??
                    (project.status === "in-progress" ? "Ongoing" : null)
                  }
                />
                <InfoPill
                  icon={FiTag}
                  label="Category"
                  value={project.category}
                />
                <InfoPill icon={FiUser} label="Role" value={project.role} />
                {project.duration && (
                  <InfoPill
                    icon={FiClock}
                    label="Duration"
                    value={project.duration}
                  />
                )}
              </div>

              {/* Tech stack */}
              {project.techStack?.length > 0 && (
                <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3 flex items-center gap-2">
                    <FiLayers size={11} /> Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((t) => (
                      <TechBadge key={t} tech={t} />
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {project.tags?.length > 0 && (
                <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick links */}
              {(project.liveUrl || project.githubUrl) && (
                <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-col gap-2">
                  <h3 className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">
                    Links
                  </h3>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-green-500 hover:text-green-600 font-medium transition-colors"
                    >
                      <FiExternalLink size={13} /> Live Site
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors"
                    >
                      <FiGithub size={13} /> GitHub Repo
                    </a>
                  )}
                </div>
              )}
            </motion.aside>
          </div>
        </div>
      </article>
      {/* Navigation */}
      <div className="max-w-4xl mx-auto my-10 flex items-center justify-start gap-4 overflow-hidden">
        {prev ? (
          <Link
            to={`/archives/${prev.slug}`}
            className="flex items-center p-4 rounded-xl bg-gray-200 dark:bg-gray-800 hover:scale-105 transition"
          >
            <FaArrowLeft /> {prev.title}
          </Link>
        ) : (
          <div />
        )}

        {next && (
          <Link
            to={`/archives/${next.slug}`}
            className="flex items-center p-4 rounded-xl bg-green-600 text-gray-100 dark:bg-gray-800 dark:text-green-600 text-right hover:scale-105 transition"
          >
            {next.title} <FaArrowRight />
          </Link>
        )}
      </div>
    </>
  );
}
