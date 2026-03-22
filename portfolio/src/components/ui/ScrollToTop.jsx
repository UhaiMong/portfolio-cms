import { useState, useEffect } from "preact/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { scrollToTop } from "../../utils/helpers";
import { FiArrowUp } from "react-icons/fi";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-8 z-40
            w-10 h-10 border border-black/10 dark:border-white/10
            bg-white/60 dark:bg-black/50
            hover:border-black dark:hover:border-white
            text-black/40 dark:text-white/40
            hover:text-black dark:hover:text-white
            flex items-center justify-center
            transition-all duration-300 shadow-lg"
        >
          <FiArrowUp />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
