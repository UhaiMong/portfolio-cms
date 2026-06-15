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

// ---------------------------------------------------------------------
// NOTE: The skills marquee falls back to Devicon icon classes when a
// skill from bio.skills doesn't provide its own icon URL. Add this once
// in your index.html <head> for the fallback icons to render:
//   <link rel="stylesheet"
//     href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
// If bio.skills already provides { name, icon: <url> } objects, the
// marquee will use those images directly instead.
// ---------------------------------------------------------------------

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

// Fallback tech stack (Devicon slugs) used only if bio.skills is empty
const DEFAULT_SKILLS = [
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextjs" },
  { name: "TypeScript", icon: "typescript" },
  { name: "JavaScript", icon: "javascript" },
  { name: "Node.js", icon: "nodejs" },
  { name: "Express", icon: "express" },
  { name: "MongoDB", icon: "mongodb" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "Redux", icon: "redux" },
  { name: "Tailwind CSS", icon: "tailwindcss" },
  { name: "Git", icon: "git" },
  { name: "Docker", icon: "docker" },
];

const isUrl = (val = "") => /^https?:\/\//.test(val) || val.startsWith("/");

export default function Hero() {
  const { data } = useFetch(getProjectStats);

  const { banner, bio, resume, loading } = useData();
  const { theme } = useTheme();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -60]);

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

  // Normalize skills for the marquee (works with string[] or object[])
  const rawSkills = bio?.skills?.length ? bio.skills : DEFAULT_SKILLS;
  const skillItems = rawSkills.map((s) =>
    typeof s === "string"
      ? { name: s, icon: s.toLowerCase().replace(/[^a-z0-9]/g, "") }
      : {
          name: s.name,
          icon: s.icon || s.name?.toLowerCase().replace(/[^a-z0-9]/g, ""),
        },
  );

  // Scroll indicator
  const [showScroll, setShowScroll] = useState(true);
  useEffect(() => {
    const fn = () => setShowScroll(window.scrollY < 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="relative bg-white dark:bg-slate-950 transition-colors duration-500">
      <section
        ref={sectionRef}
        className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center px-6 pt-28 pb-32"
      >
        {/* ---------- 3D background layer ---------- */}
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0 -z-20 overflow-hidden"
        >
          {/* base premium gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-indigo-50 via-white to-violet-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950" />

          {/* glow orbs */}
          <motion.div
            className="absolute -top-32 -left-24 w-80 h-80 md:w-96 md:h-96 rounded-full bg-violet-400/30 dark:bg-violet-600/25 blur-3xl"
            animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
            transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-40 -right-24 w-[26rem] h-[26rem] rounded-full bg-cyan-300/30 dark:bg-cyan-500/15 blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
            transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-64 h-64 md:w-72 md:h-72 rounded-full bg-fuchsia-300/25 dark:bg-fuchsia-500/15 blur-3xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
          />

          {/* floating 3D cubes — dev/tech vibe */}
          <FloatingCube
            size={90}
            className="top-[18%] left-[8%] opacity-70 hidden sm:block"
            duration={9}
          />
          <FloatingCube
            size={56}
            className="bottom-[26%] left-[18%] opacity-60 hidden md:block"
            duration={12}
          />
          <FloatingCube
            size={120}
            className="top-[12%] right-[10%] opacity-60 hidden lg:block"
            duration={15}
          />

          {/* subtle dot-grid / circuit texture */}
          <div
            className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08] text-slate-900 dark:text-white"
            style={{
              backgroundImage:
                "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </motion.div>

        {/* ---------- readability overlay ---------- */}
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-white/10 via-white/60 to-white dark:from-slate-950/10 dark:via-slate-950/60 dark:to-slate-950" />

        {/* ---------- centered content ---------- */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto"
        >
          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs tracking-[0.4em] uppercase mb-6 text-violet-600 dark:text-violet-300"
          >
            {greeting}
          </motion.p>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-8xl font-bold leading-none tracking-tight mb-4 uppercase
              bg-clip-text text-transparent bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-500
              dark:from-indigo-300 dark:via-violet-300 dark:to-fuchsia-300"
          >
            {name}
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <span className="w-6 h-px bg-violet-500/50 dark:bg-violet-300/40" />
            <span className="text-sm tracking-widest uppercase font-bold min-h-6 text-slate-700 dark:text-slate-200">
              {typed}
              <span className="inline-block w-0.5 h-4 bg-violet-500 dark:bg-violet-300 ml-0.5 animate-pulse" />
            </span>
            <span className="w-6 h-px bg-violet-500/50 dark:bg-violet-300/40" />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base md:text-lg max-w-xl leading-relaxed mb-10 text-slate-600 dark:text-slate-300"
          >
            {description}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-wrap justify-center gap-4"
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
              <span className="text-xs tracking-widest uppercase text-slate-500 dark:text-slate-400">
                Available for work
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* ---------- stats strip (lg+ only) ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="hidden lg:flex absolute top-1/2 -translate-y-1/2 right-8 xl:right-14 z-10
          flex-col gap-6 text-right"
        >
          {[
            { num: bio?.experience?.length || "3+", label: "Years Exp." },
            { num: data ? data : "20+", label: "Projects" },
            { num: bio?.skills?.length || "15+", label: "Technologies" },
          ].map(({ num, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold leading-none bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-fuchsia-500 dark:from-indigo-300 dark:to-fuchsia-300">
                {num}
              </p>
              <p className="text-xs tracking-widest uppercase mt-1 text-slate-500 dark:text-slate-400">
                {label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* ---------- skills marquee + scroll indicator ---------- */}
        <div className="absolute bottom-0 left-0 w-full flex flex-col items-center gap-5 pb-6 z-10">
          <div className="w-full max-w-3xl lg:max-w-4xl mx-auto px-4">
            <p className="text-center text-[11px] tracking-[0.35em] uppercase mb-3 text-slate-400 dark:text-slate-500">
              Skills On:
            </p>
            <SkillsMarquee items={skillItems} />
          </div>

          <AnimatePresence>
            {showScroll && <MouseScrollIndicator />}
          </AnimatePresence>
        </div>
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
    ? `px-8 py-3.5 text-sm tracking-widest uppercase font-medium rounded-full
       bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-500 text-white
       shadow-lg shadow-violet-500/30 dark:shadow-violet-900/40
       hover:shadow-violet-500/50 hover:brightness-110
       transition-all duration-300`
    : `px-8 py-3.5 text-sm tracking-widest uppercase font-medium rounded-full
       border border-violet-500/30 dark:border-violet-300/20
       text-slate-600 dark:text-slate-300 backdrop-blur-sm
       hover:border-violet-500 dark:hover:border-violet-300
       hover:text-violet-600 dark:hover:text-violet-300
       transition-all duration-300`;

// Floating 3D cube (CSS 3D transforms — dev/tech aesthetic)
function FloatingCube({ size = 80, className = "", duration = 10 }) {
  const half = size / 2;
  const face =
    "absolute inset-0 rounded-md border border-violet-400/20 dark:border-violet-300/10 " +
    "bg-linear-to-br from-indigo-400/15 via-violet-400/10 to-cyan-300/15 " +
    "dark:from-indigo-400/10 dark:via-violet-400/10 dark:to-cyan-300/10 backdrop-blur-[2px]";

  return (
    <motion.div
      className={`absolute ${className}`}
      style={{ width: size, height: size, perspective: "900px" }}
      animate={{ y: [0, -18, 0] }}
      transition={{
        repeat: Infinity,
        duration: duration * 0.8,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
        transition={{ repeat: Infinity, duration, ease: "linear" }}
      >
        <div className={face} style={{ transform: `translateZ(${half}px)` }} />
        <div
          className={face}
          style={{ transform: `translateZ(-${half}px) rotateY(180deg)` }}
        />
        <div
          className={face}
          style={{ transform: `rotateY(90deg) translateZ(${half}px)` }}
        />
        <div
          className={face}
          style={{ transform: `rotateY(-90deg) translateZ(${half}px)` }}
        />
        <div
          className={face}
          style={{ transform: `rotateX(90deg) translateZ(${half}px)` }}
        />
        <div
          className={face}
          style={{ transform: `rotateX(-90deg) translateZ(${half}px)` }}
        />
      </motion.div>
    </motion.div>
  );
}

// Skills marquee — smooth, seamless, horizontal, responsive width
function SkillsMarquee({ items }) {
  const loopItems = [...items, ...items];
  return (
    <div className="relative w-full overflow-hidden">
      {/* edge fades so it looks framed within the section */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-16 md:w-24 z-10 bg-linear-to-r from-white dark:from-slate-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-16 md:w-24 z-10 bg-linear-to-l from-white dark:from-slate-950 to-transparent" />

      <motion.div
        className="flex items-center gap-8 md:gap-12 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: Math.max(items.length * 2.5, 15),
        }}
      >
        {loopItems.map((skill, i) => (
          <div
            key={`${skill.name}-${i}`}
            className="flex flex-col items-center gap-1.5 shrink-0 w-14"
          >
            {isUrl(skill.icon) ? (
              <img
                src={skill.icon}
                alt={skill.name}
                loading="lazy"
                className="w-7 h-7 md:w-8 md:h-8 object-contain opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
              />
            ) : (
              <i
                className={`devicon-${skill.icon}-plain colored text-2xl md:text-3xl opacity-80 hover:opacity-100 transition-opacity`}
              />
            )}
            <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap">
              {skill.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// Animated mouse scroll indicator
function MouseScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center"
    >
      <div className="w-6 h-10 rounded-full border-2 border-slate-400/50 dark:border-white/25 flex justify-center pt-2">
        <motion.span
          animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-300"
        />
      </div>
    </motion.div>
  );
}
