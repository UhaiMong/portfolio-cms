import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";

// Success screen
function SuccessScreen({ onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center gap-6"
    >
      {/* Animated check */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="relative w-20 h-20"
      >
        <div
          className="absolute inset-0 border border-black/10 dark:border-white/10 rounded-full
          animate-ping opacity-30"
        />
        <div
          className="relative w-20 h-20 border border-black/10 dark:border-white/10
          rounded-full flex items-center justify-center"
        >
          <motion.div initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}>
            <FiCheck size={28} className="" />
          </motion.div>
        </div>
      </motion.div>

      <div>
        <h3 className="text-xl font-bold ">Message sent!</h3>
        <p className="text-sm  max-w-xs">
          Thanks for reaching out. I'll get back to you as soon as possible.
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onReset}
        className="text-xs tracking-widest uppercase
          border border-black/10 dark:border-white/10
          hover:border-black dark:hover:border-white
          hover:text-black dark:hover:text-white
          px-8 py-3.5 transition-all duration-300"
      >
        Send another
      </motion.button>
    </motion.div>
  );
}
export default SuccessScreen;
