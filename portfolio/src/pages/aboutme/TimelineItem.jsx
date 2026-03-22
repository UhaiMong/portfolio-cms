import { motion } from "framer-motion";

function TimelineItem({ item, index, type }) {
  const isExp = type === "experience";
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="group relative flex gap-6"
    >
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className="w-2 h-2 rounded-full mt-1.5
          bg-black/20 dark:bg-white/20
          group-hover:bg-black dark:group-hover:bg-white
          transition-colors duration-500"
        />
        <div className="flex-1 w-px bg-black/5 dark:bg-white/5 mt-2" />
      </div>

      {/* Content */}
      <div className="pb-10 flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <div>
            <h3
              className="font-semibold  text-sm
              group-hover:text-black dark:group-hover:text-white transition-colors duration-300"
            >
              {isExp ? item.position : item.degree}
            </h3>
            <p className="text-xs mt-0.5">
              {isExp ? item.company : item.institution}
              {!isExp && item.field && ` · ${item.field}`}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span
              className="text-xs font-mono
              group-hover:text-black/40 dark:group-hover:text-white/40 transition-colors duration-300"
            >
              {item.duration}
            </span>
            {isExp && item.current && (
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-500">Current</span>
              </div>
            )}
            {!isExp && item.grade && (
              <p className="text-xs mt-1">{item.grade}</p>
            )}
          </div>
        </div>
        {isExp && item.description && (
          <p className="text-xs leading-relaxed">{item.description}</p>
        )}
      </div>
    </motion.div>
  );
}
export default TimelineItem;
