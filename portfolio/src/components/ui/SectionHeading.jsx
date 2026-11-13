import { motion } from "framer-motion";

export default function SectionHeading({ label, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-14 md:mb-16"
    >
      {label && (
        <span className="inline-block text-xs tracking-[0.3em] uppercase text-ink-muted mb-4">
          {label}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-bold text-ink leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-ink-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="flex items-center justify-center gap-2 mt-6" aria-hidden="true">
        <div className="w-10 h-px bg-line" />
        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
        <div className="w-10 h-px bg-line" />
      </div>
    </motion.div>
  );
}
