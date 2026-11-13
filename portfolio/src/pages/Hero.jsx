import { useEffect, useRef, useState } from "preact/hooks";
import { motion, useScroll, useTransform } from "framer-motion";
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

// Fallback tech stack shown in the marquee when DataContext has no skills yet
const DEFAULT_SKILLS = [
  "js",
  "ts",
  "react",
  "nextjs",
  "nodejs",
  "express",
  "mongodb",
  "postgres",
  "tailwind",
  "html",
  "css",
  "git",
  "github",
  "figma",
  "docker",
  "redux",
];

// Map common skill names (as they might appear in DataContext) to skillicons.dev codes
const SKILL_ICON_MAP = {
  javascript: "js",
  js: "js",
  typescript: "ts",
  ts: "ts",
  node: "nodejs",
  nodejs: "nodejs",
  "node.js": "nodejs",
  next: "nextjs",
  nextjs: "nextjs",
  "next.js": "nextjs",
  react: "react",
  "react.js": "react",
  vue: "vue",
  "vue.js": "vue",
  angular: "angular",
  tailwind: "tailwind",
  tailwindcss: "tailwind",
  "tailwind css": "tailwind",
  mongodb: "mongodb",
  mongo: "mongodb",
  postgres: "postgres",
  postgresql: "postgres",
  mysql: "mysql",
  express: "express",
  "express.js": "express",
  html: "html",
  html5: "html",
  css: "css",
  css3: "css",
  sass: "sass",
  scss: "sass",
  git: "git",
  github: "github",
  figma: "figma",
  docker: "docker",
  redux: "redux",
  graphql: "graphql",
  python: "python",
  java: "java",
  "c++": "cpp",
  cpp: "cpp",
  "c#": "cs",
  csharp: "cs",
  php: "php",
  laravel: "laravel",
  django: "django",
  flutter: "flutter",
  firebase: "firebase",
  aws: "aws",
  vite: "vite",
  webpack: "webpack",
  vscode: "vscode",
  "vs code": "vscode",
  linux: "linux",
  framer: "framer",
  "framer motion": "framer",
};

// `duration` is free text like "Jan 2022 - Present", so use the earliest 4-digit year.
function yearsOfExperience(experience = []) {
  const years = experience
    .flatMap((e) => String(e?.duration || "").match(/\b(19|20)\d{2}\b/g) || [])
    .map(Number);
  if (!years.length) return null;
  const total = new Date().getFullYear() - Math.min(...years);
  return total > 0 ? `${total}+` : "1";
}

function toSkillIcon(skill) {
  if (!skill) return null;
  const key = String(skill).trim().toLowerCase();
  if (SKILL_ICON_MAP[key]) return SKILL_ICON_MAP[key];
  const cleaned = key.replace(/[^a-z0-9]/g, "");
  return cleaned || null;
}

// Lightweight isometric "wireframe cube" - pure SVG, animated with CSS only
// (no Framer Motion infinite loop), so it can't fight scroll-linked values.
function WireCube({ className = "" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={`hero-cube ${className}`}
      aria-hidden="true"
    >
      <polygon
        points="50,3 95,27 95,73 50,97 5,73 5,27"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.35"
      />
      <polyline
        points="5,27 50,50 95,27"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.35"
      />
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="97"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.35"
      />
    </svg>
  );
}

export default function Hero() {
  const { data } = useFetch(getProjectStats);

  const { banner, bio, resume } = useData();
  useTheme();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
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

  // Skills for the marquee strip
  const rawSkills = bio?.skills?.length ? bio.skills : DEFAULT_SKILLS;
  const skillNames = rawSkills.map((s) =>
    typeof s === "string" ? s : s?.icon || s?.name || "",
  );
  const skillIcons = skillNames.map(toSkillIcon).filter(Boolean);
  const marqueeIcons = skillIcons.length ? [...skillIcons, ...skillIcons] : [];

  return (
    <div className="relative page-surface-hero transition-colors duration-500">
      <section
        ref={sectionRef}
        className="relative w-full min-h-screen overflow-hidden flex flex-col"
      >
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="hero-orb-a absolute -top-32 -left-24 w-104 h-104 sm:w-lg sm:h-lg rounded-full blur-3xl bg-cyan-400/25 dark:bg-cyan-500/15" />
          <div className="hero-orb-b absolute -bottom-24 -right-24 w-md h-112 sm:w-136 sm:h-136 rounded-full blur-3xl bg-sky-300/20 dark:bg-sky-500/10" />
          <div
            className="absolute inset-0 opacity-[0.07] text-accent"
            style={{
              backgroundImage:
                "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <WireCube className="absolute right-[6%] top-[14%] w-28 h-28 lg:w-40 lg:h-40 hidden md:block text-accent" />
          <WireCube className="hero-cube-reverse absolute left-[6%] bottom-[16%] w-20 h-20 lg:w-28 lg:h-28 hidden lg:block text-accent/70" />
        </div>

        {/* ================= MAIN CONTENT (centered, z-10) ================= */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 flex-1 flex items-center justify-center px-6 pt-28 pb-10"
        >
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
            {/* Greeting */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xs tracking-[0.35em] uppercase mb-6 text-accent font-semibold"
            >
              {greeting}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight mb-4 uppercase text-ink"
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
              <span className="w-6 h-px bg-slate-400 dark:bg-white/30" />
              <span
                className="text-sm tracking-widest uppercase font-bold min-h-6 text-accent"
                aria-hidden="true"
              >
                {typed}
                <span className="inline-block w-0.5 h-4 bg-current ml-0.5 animate-pulse align-middle" />
              </span>
              <span className="sr-only">{typingTexts[0]}</span>
              <span className="w-6 h-px bg-slate-400 dark:bg-white/30" />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base md:text-lg max-w-xl leading-relaxed mb-10 text-ink-muted"
            >
              {description}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-wrap items-center justify-center gap-4"
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
                <span className="text-xs tracking-widest uppercase text-ink-muted">
                  Available for work
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ================= STATS STRIP (large screens only, z-10) ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="hidden xl:flex absolute top-1/2 -translate-y-1/2 right-10 z-10
          flex-col gap-6 text-right"
        >
          {[
            { num: yearsOfExperience(bio?.experience) || "3+", label: "Years Exp." },
            { num: data ? data : "20+", label: "Projects" },
            { num: bio?.skills?.length || "15+", label: "Technologies" },
          ].map(({ num, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold leading-none text-ink">{num}</p>
              <p className="text-xs tracking-widest uppercase mt-1 text-ink-faint">
                {label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* ================= SKILLS MARQUEE (centered, fixed-but-responsive width, z-10) ================= */}
        {marqueeIcons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="relative z-10 w-full pb-10 sm:pb-12"
          >
            <p
              className="text-center text-xs tracking-[0.3em] uppercase mb-5 text-ink-faint font-semibold"
            >
              Tech stack
            </p>

            {/* Fixed-but-responsive centered width */}
            <div className="mx-auto w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl px-4">
              <div
                className="relative w-full overflow-hidden"
                style={{
                  maskImage:
                    "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                }}
              >
                <div className="animate-marquee-forward flex w-max items-center gap-10 sm:gap-14">
                  {marqueeIcons.map((icon, i) => (
                    <img
                      key={`${icon}-${i}`}
                      src={`https://skillicons.dev/icons?i=${icon}`}
                      alt={icon}
                      width={40}
                      height={40}
                      loading="lazy"
                      className="h-9 w-9 sm:h-10 sm:w-10 opacity-80 hover:opacity-100
                      transition-opacity duration-300 shrink-0"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= ANIMATED MOUSE SCROLL INDICATOR (z-10) ================= */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="relative z-10 flex items-center justify-center pb-6 sm:pb-8 pointer-events-none"
        >
          <svg
            width="24"
            height="38"
            viewBox="0 0 24 38"
            fill="none"
            className="text-slate-400 dark:text-slate-400"
          >
            <rect
              x="1"
              y="1"
              width="22"
              height="36"
              rx="11"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <motion.circle
              cx="12"
              r="2.5"
              fill="currentColor"
              animate={{ cy: [9, 22, 9], opacity: [1, 1, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </svg>
        </motion.div>
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
       text-white bg-accent hover:bg-accent-strong shadow-lg shadow-cyan-500/20
       transition-all duration-300`
    : `px-8 py-3.5 text-sm tracking-widest uppercase font-medium rounded-full
       border border-line text-ink-muted hover:border-accent hover:text-accent
       transition-all duration-300`;
