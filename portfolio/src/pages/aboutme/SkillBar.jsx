import { useRef } from "preact/hooks";
import { motion, useScroll, useTransform } from "framer-motion";

function SkillBar({ skill, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const width = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `${skill.level}%`],
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="text-xs font-medium 
          group-hover:text-black dark:group-hover:text-white transition-colors duration-300"
        >
          {skill.name}
        </span>
        <span
          className="text-xs
          group-hover:text-black/50 dark:group-hover:text-white/50 transition-colors duration-300 font-mono"
        >
          {skill.level}%
        </span>
      </div>
      {/* Track */}
      <div className="h-px bg-black/5 dark:bg-white/5 overflow-hidden">
        <motion.div
          style={{ width }}
          className="h-full bg-black/20 dark:bg-white/20
            group-hover:bg-black dark:group-hover:bg-white
            transition-colors duration-500"
        />
      </div>
    </motion.div>
  );
}
export default SkillBar;
