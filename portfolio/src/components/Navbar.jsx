import { useState, useEffect, useRef } from "preact/hooks";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";
import { FaSun, FaMoon, FaGithub, FaLinkedin } from "react-icons/fa6";
import { CgMenuGridO } from "react-icons/cg";
import { useTheme } from "../context/ThemeContext";
import { useData } from "../context/DataContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/archives", label: "All Work" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const socialIcon = (platform = "") => {
  const p = platform.toLowerCase();
  if (p.includes("github")) return FaGithub;
  if (p.includes("linkedin")) return FaLinkedin;
  return null;
};

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { bio } = useData();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > lastY.current && y > 100);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const quickSocials = (bio?.socialLinks || [])
    .filter((s) => socialIcon(s.platform))
    .slice(0, 2);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
          ${
            scrolled
              ? "bg-gray-200 dark:bg-gray-900 backdrop-blur-xl border-b border-black/5 dark:border-white/5 shadow-sm"
              : "bg-transparent"
          }`}
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="relative"
            >
              <span
                className="text-xl font-bold tracking-tight uppercase
                text-black dark:text-white
                transition-all duration-500"
              >
                {bio?.name?.split(" ")[0] || "Portfolio"}
              </span>
              <span
                className="text-xl font-bold tracking-tight uppercase ml-1
                grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100
                text-indigo-500 transition-all duration-500"
              >
                {bio?.name?.split(" ").slice(1).join(" ") || ""}
              </span>
              <span
                className="absolute -bottom-0.5 left-0 w-0 group-hover:w-full h-px
                bg-black dark:bg-white transition-all duration-500"
              />
            </motion.div>
          </Link>

          {/* Desktop right controls */}
          <div className="flex items-center gap-3">
            {quickSocials.map((s) => {
              const Icon = socialIcon(s.platform);
              return Icon ? (
                <motion.a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="hidden md:flex p-2 rounded-lg
                    text-black/30 dark:text-white/30
                    hover:text-black dark:hover:text-white
                    transition-colors duration-300"
                  aria-label={s.platform}
                >
                  <Icon size={16} />
                </motion.a>
              ) : null;
            })}

            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg
                text-black/40 dark:text-white/40
                hover:text-black dark:hover:text-white
                hover:bg-black/5 dark:hover:bg-white/5
                transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "dark" ? (
                    <FaSun size={16} />
                  ) : (
                    <FaMoon size={16} />
                  )}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            {/* Menu toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="p-2 rounded-lg
                text-black dark:text-white
                hover:bg-black/5 dark:hover:bg-white/5
                transition-all duration-300"
            >
              <CgMenuGridO size={24} />
            </motion.button>
          </div>
        </div>
      </motion.header>
      {createPortal(
        <AnimatePresence mode="wait">
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-998"
              />

              {/* Slide-in panel */}
              <motion.nav
                key="panel"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                aria-label="Main navigation"
                className="fixed top-0 right-0 h-full w-80 max-w-[85vw] z-999
                  bg-gray-100 dark:bg-slate-950
                  text-gray-900 dark:text-gray-100
                  border-l border-black/10 dark:border-white/10
                  flex flex-col p-8 shadow-2xl"
              >
                {/* Panel header */}
                <div className="flex items-center justify-between mb-12">
                  <span className="text-xs tracking-[0.3em] uppercase text-black/60 dark:text-white/60">
                    Menu
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="p-2 rounded-lg
                      text-black/60 hover:text-black dark:text-white/70 dark:hover:text-white
                      transition-colors duration-200"
                  >
                    <HiX size={20} />
                  </motion.button>
                </div>

                {/* Nav links */}
                <div className="flex flex-col gap-1 flex-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.3 }}
                    >
                      <NavLink
                        to={link.to}
                        end={link.to === "/"}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `group flex items-center justify-between
                          py-4 border-b border-black/5 dark:border-white/5
                          text-2xl font-bold tracking-tight uppercase
                          transition-all duration-300
                          ${isActive ? "text-black dark:text-white underline underline-offset-8" : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"}`
                        }
                      >
                        <span>{link.label}</span>
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          whileHover={{ opacity: 1, x: 0 }}
                          className="text-sm opacity-0 group-hover:opacity-100 transition-all"
                        >
                          →
                        </motion.span>
                      </NavLink>
                    </motion.div>
                  ))}
                </div>

                {/* Panel footer */}
                <div className="pt-8 border-t border-black/5 dark:border-white/5">
                  <p className="text-xs tracking-[0.3em] uppercase text-black/60 dark:text-white/60 mb-4">
                    Connect
                  </p>
                  <div className="flex gap-4">
                    {(bio?.socialLinks || []).map((s) => {
                      const Icon = socialIcon(s.platform);
                      return (
                        <motion.a
                          key={s.platform}
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          whileHover={{ scale: 1.15, y: -2 }}
                          className="text-black/60 hover:text-black dark:text-white/70 dark:hover:text-white
                            transition-colors duration-300"
                          aria-label={s.platform}
                        >
                          {Icon ? (
                            <Icon size={18} />
                          ) : (
                            <span className="text-xs uppercase">
                              {s.platform.slice(0, 2)}
                            </span>
                          )}
                        </motion.a>
                      );
                    })}
                  </div>

                  {bio?.availability === "available" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mt-6 flex items-center gap-2"
                    >
                      <span className="relative flex h-2 w-2">
                        <span
                          className="animate-ping absolute inline-flex h-full w-full
                          rounded-full bg-green-400 opacity-75"
                        />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                      </span>
                      <span className="text-xs text-black/60 dark:text-white/70">
                        Available for work
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
