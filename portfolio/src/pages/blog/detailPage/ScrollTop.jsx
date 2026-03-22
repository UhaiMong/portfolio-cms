import { motion, AnimatePresence } from "framer-motion";
import { FiChevronUp } from "react-icons/fi";

// Scroll-to-top button
function ScrollTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const check = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-40
            w-10 h-10 rounded-full flex items-center justify-center
            border border-black/10 dark:border-white/10
            bg-white/80 dark:bg-black/80 backdrop-blur-sm
            
            hover:text-black dark:hover:text-white
            hover:border-black/20 dark:hover:border-white/20
            transition-all duration-300"
        >
          <FiChevronUp size={16} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
export default ScrollTop;
