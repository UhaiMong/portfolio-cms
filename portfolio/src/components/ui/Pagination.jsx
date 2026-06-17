import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Pagination = ({ page, pagination, setPage }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-12 flex items-center justify-center gap-2"
    >
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:border-green-400/60 transition-colors"
      >
        <ArrowLeft />
      </button>

      <div className="flex gap-1.5">
        {Array.from({ length: pagination.pages }, (_, i) => i + 1)
          .filter(
            (p) => p === 1 || p === pagination.pages || Math.abs(p - page) <= 1,
          )
          .reduce((acc, p, i, arr) => {
            if (i > 0 && p - arr[i - 1] > 1) acc.push("…");
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === "…" ? (
              <span
                key={`dots-${i}`}
                className="px-2 py-2 text-gray-400 text-sm"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold border transition-all ${
                  page === p
                    ? "bg-linear-to-r from-brand-primary to-indigo-800 text-white border-brand-primary shadow-md"
                    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-brand-primary/60"
                }`}
              >
                {p}
              </button>
            ),
          )}
      </div>

      <button
        onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
        disabled={page === pagination.pages}
        className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:border-green-400/60 transition-colors"
      >
        <ArrowRight />
      </button>
    </motion.div>
  );
};

export default Pagination;
