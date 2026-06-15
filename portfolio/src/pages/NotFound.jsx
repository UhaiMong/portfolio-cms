import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BackgroundGridBluePrint from "../components/ui/BackgroundGridBluePrint";

export default function NotFound() {
  return (
    <div className="relative w-full h-full overflow-y-scroll bg-white text-gray-900 dark:bg-linear-to-b from-slate-900 via-indigo-950 to-slate-900 dark:text-white">
      <BackgroundGridBluePrint />
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-xs tracking-[0.4em] uppercase
           mb-6"
          >
            Error 404
          </p>
          <h1
            className="text-[8rem] md:text-[12rem] font-bold leading-none
           select-none"
          >
            404
          </h1>
          <p className="text-xl font-medium mt-4 mb-2">Page not found</p>
          <p className="text-sm mb-10 max-w-sm">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm tracking-widest uppercase
            px-8 py-4 border border-black/20 dark:border-white/20
            hover:border-black dark:hover:border-white
            hover:text-black dark:hover:text-white
            transition-all duration-300"
          >
            ← Back home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
