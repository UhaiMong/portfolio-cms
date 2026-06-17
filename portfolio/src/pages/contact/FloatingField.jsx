import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

// Floating label input
function FloatingField({ label, error, children, required }) {
  return (
    <div className="relative group">
      {label && (
        <label
          className={`block text-xs tracking-widest uppercase mb-2
        transition-colors duration-300
        ${
          error
            ? "text-red-400"
            : " group-focus-within:text-black dark:group-focus-within:text-white"
        }`}
        >
          {label}
          {required && <span className="ml-0.5 opacity-50">*</span>}
        </label>
      )}
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1 text-xs text-red-400 mt-1.5"
          >
            <FiAlertCircle size={11} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
export default FloatingField;
