import { motion } from "framer-motion";

export default function SectionHeading({ label, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      {label && (
        <span className="inline-block text-xs tracking-[0.4em] uppercase text-black/60 dark:text-white/60 mb-4">
          {label}
        </span>
      )}
      <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-cyan-600 via-sky-600 to-indigo-600 dark:from-cyan-400 dark:via-sky-300 dark:to-indigo-400 leading-tight ">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4  text-black/60 dark:text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      {/* Decorative line */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <div className="w-12 h-px bg-black/50 dark:bg-white/50" />
        <div className="w-2 h-2 bg-green-500 rotate-45" />
        <div className="w-12 h-px bg-black/50 dark:bg-white/50" />
      </div>
    </motion.div>
  );
}
