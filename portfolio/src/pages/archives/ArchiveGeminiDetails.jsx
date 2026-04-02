import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
// import useProjectDetails from "../hooks/useProjectDetails";
import DOMPurify from "dompurify";
import useProjectDetails from "../../hooks/useProjectDetails";

export default function ProjectGalleryDetails() {
  const { slug } = useParams();
  const { project, prev, next, loading } = useProjectDetails(slug);

  if (loading) {
    return <Skeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-4 py-10"
    >
      {/* Hero */}
      <motion.img
        src={project.thumbnail}
        className="rounded-xl mb-6 w-full h-80 object-cover"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      <h1 className="text-3xl font-bold dark:text-gray-200">{project.title}</h1>

      {/* Rich Content */}
      <div
        className="prose dark:prose-invert mt-6"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(project.longDescription),
        }}
      />

      {/* Navigation */}
      <div className="mt-16 grid grid-cols-2 gap-4">
        {prev ? (
          <Link
            to={`/archives/gemini/${prev.slug}`}
            className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:scale-105 transition"
          >
            ← {prev.title}
          </Link>
        ) : (
          <div />
        )}

        {next && (
          <Link
            to={`/archives/gemini/${next.slug}`}
            className="p-4 rounded-xl bg-indigo-600 text-white text-right hover:scale-105 transition"
          >
            {next.title} →
          </Link>
        )}
      </div>
    </motion.div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse max-w-5xl mx-auto p-6">
      <div className="h-80 bg-gray-300 dark:bg-gray-700 rounded-xl mb-6"></div>
      <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 mb-4"></div>
      <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 mb-2"></div>
      <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700"></div>
    </div>
  );
}
