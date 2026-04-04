import { useEffect, useRef, useState } from "preact/hooks";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";
import useFetch from "../hooks/useFetch";
import { getProjectStats } from "../services/portfolioService";

// Simple typewriter hook
function useTypewriter(texts = [], speed = 80, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!texts.length) return;
    const current = texts[textIdx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setTextIdx((t) => (t + 1) % texts.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, textIdx, texts, speed, pause]);

  useEffect(() => {
    if (texts.length) setDisplay(texts[textIdx]?.slice(0, charIdx) || "");
  }, [charIdx, textIdx, texts]);

  return display;
}

export default function Hero() {
  const { data } = useFetch(getProjectStats);

  const { banner, bio, resume, loading } = useData();
  const { theme } = useTheme();
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Typewriter texts from banner or fallback
  const typingTexts = banner?.typingTexts?.length
    ? banner.typingTexts
    : ["Full Stack Developer", "UI/UX Enthusiast", "Open Source Contributor"];

  const typed = useTypewriter(typingTexts);

  // Data with fallbacks
  const greeting = banner?.greeting || "Hi, I'm";
  const name = banner?.name || bio?.name || "Uhai Mong";
  const description =
    banner?.description ||
    bio?.about ||
    "Building modern, scalable and visually crafted web applications.";
  const ctaButtons = banner?.ctaButtons?.length
    ? banner.ctaButtons
    : [
        { label: "View Projects", url: "/archives", variant: "primary" },
        { label: "About Me", url: "/about", variant: "outline" },
      ];

  // Scroll indicator
  const [showScroll, setShowScroll] = useState(true);
  useEffect(() => {
    const fn = () => setShowScroll(window.scrollY < 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  // console.log(data, bio, resume, loading);

  return (
    <div className="bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-gray-200">
      <section
        ref={sectionRef}
        className="relative w-full h-screen overflow-hidden flex items-center"
      >
        {/* Background video with parallax  */}
        <motion.div
          style={{ scale: videoScale }}
          className="absolute inset-0 origin-center"
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover grayscale transition-all duration-700"
            src="/videos/hero-bg.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </motion.div>

        {/* Overlay */}
        <div
          className={`absolute inset-0 pointer-events-none transition-colors duration-300 blur-sm
        ${theme === "dark" ? "bg-black/75" : "bg-white/30"}`}
        />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content  */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 container mx-auto px-6"
        >
          <div className="max-w-3xl">
            {/* Greeting */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xs tracking-[0.4em] uppercase mb-6"
            >
              {greeting}
            </motion.p>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-6xl md:text-8xl font-bold leading-none tracking-tight mb-4
               uppercase"
            >
              {name.split(" ").map((word, i) => (
                <span key={i} className={`block ${i > 0 ? "opacity-60" : ""}`}>
                  {word}
                </span>
              ))}
            </motion.h1>

            {/* Typewriter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 mb-6"
            >
              <span className="w-6 h-px bg-black/50 dark:bg-white/30" />
              <span
                className="text-sm tracking-widest uppercase font-bold
               min-h-6"
              >
                {typed}
                <span className="inline-block w-0.5 h-4 bg-current ml-0.5 animate-pulse" />
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base md:text-lg max-w-xl leading-relaxed mb-10"
            >
              {description}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-wrap gap-4"
            >
              {ctaButtons.map((btn, i) => (
                <CTAButton key={i} btn={btn} index={i} resume={resume} />
              ))}
            </motion.div>

            {/* Availability */}
            {bio?.availability === "available" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-2 mt-8"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-xs tracking-widest uppercase">
                  Available for work
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="absolute bottom-20 right-6 md:right-12 z-10
          flex flex-col gap-6 text-right"
        >
          {[
            { num: bio?.experience?.length || "3+", label: "Years Exp." },
            { num: data ? data : "20+", label: "Projects" },
            { num: bio?.skills?.length || "15+", label: "Technologies" },
          ].map(({ num, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold leading-none">{num}</p>
              <p className="text-xs tracking-widest uppercase mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        {/*  Scroll indicator */}
        <AnimatePresence>
          {showScroll && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10
              flex flex-col items-center gap-2"
            >
              <span className="text-xs tracking-[0.3em] uppercase">Scroll</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-px h-8 bg-linear-to-b from-black/50 to-transparent dark:from-white/60"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/*  Bottom fade  */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none
        bg-linear-to-t from-white dark:from-black to-transparent"
        />
      </section>
    </div>
  );
}

// CTA button component
function CTAButton({ btn, index, resume }) {
  const isPrimary = btn.variant === "primary" || index === 0;
  const isResume = btn.url?.includes("resume");

  if (isResume && resume?.fileUrl) {
    return (
      <motion.a
        href={resume.fileUrl}
        target="_blank"
        rel="noreferrer"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={btnClass(isPrimary)}
      >
        {btn.label}
      </motion.a>
    );
  }

  return (
    <motion.a
      href={btn.url}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={btnClass(isPrimary)}
    >
      {btn.label}
    </motion.a>
  );
}

const btnClass = (isPrimary) =>
  isPrimary
    ? `px-8 py-3.5 text-sm tracking-widest uppercase font-medium
       bg-black dark:bg-white text-white dark:text-black
       hover:bg-black/80 dark:hover:bg-white/80
       transition-all duration-300`
    : `px-8 py-3.5 text-sm tracking-widest uppercase font-medium
       border border-black/20 dark:border-white/20
       text-black/60 dark:text-white/60
       hover:border-black dark:hover:border-white
       hover:text-black dark:hover:text-white
       transition-all duration-300`;
