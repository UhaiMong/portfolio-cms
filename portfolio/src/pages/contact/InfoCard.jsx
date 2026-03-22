import { motion, AnimatePresence } from "framer-motion";

// Info card
function InfoCard({ icon: Icon, label, value, href, delay }) {
  const content = (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -3 }}
        className="group flex items-start gap-4 p-5
        border border-black/30 dark:border-white/20
        hover:border-black/50 dark:hover:border-white/20
        rounded-2xl transition-all duration-300 cursor-pointer"
      >
        <div
          className="w-10 h-10 flex items-center justify-center
        border border-black/50 dark:border-white/5 rounded-xl shrink-0
        group-hover:border-black/20 dark:group-hover:border-white/20
        transition-colors duration-300"
        >
          <Icon
            size={15}
            className="
            group-hover:text-black dark:group-hover:text-white
            transition-colors duration-300"
          />
        </div>
        <div className="min-w-0">
          <p
            className="text-xs tracking-widest uppercase
           mb-1"
          >
            {label}
          </p>
          <p
            className="text-sm
          group-hover:text-black dark:group-hover:text-white
          transition-colors duration-300 break-all"
          >
            {value}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return href ? (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
    >
      {content}
    </a>
  ) : (
    <div>{content}</div>
  );
}
export default InfoCard;
