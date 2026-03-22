import { useState } from "preact/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../context/DataContext";
import SectionHeading from "../components/ui/SectionHeading";
import { FiDownload, FiMapPin, FiMail, FiPhone } from "react-icons/fi";
import Resume from "./Resume";
import SkillsTab from "./aboutme/SkillsTab";
import AboutTab from "./aboutme/AboutTab";
import TimelineItem from "./aboutme/TimelineItem";
import EmptyState from "./aboutme/EmptyState";
const BASE_URL = import.meta.env.VITE_API_URL;

//  Tabs
const TABS = ["About", "Skills", "Experience", "Education", "Resume"];

// Main About component
export default function About({ standalone = true }) {
  const { bio, resume, loading, error } = useData();
  const [activeTab, setActiveTab] = useState("About");

  // Skeleton
  if (!bio)
    return (
      <section
        className={`px-4 md:px-6 bg-gray-200 dark:bg-gray-900 ${standalone ? "py-14" : "py-7"}`}
      >
        <div className="max-w-6xl mx-auto animate-pulse space-y-8">
          <div className="h-8 bg-gray-300 dark:bg-gray-800 rounded w-48 mx-auto" />
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="h-64 bg-gray-300 dark:bg-gray-800 rounded-2xl" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-3 bg-gray-300 dark:bg-gray-800 rounded"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );

  return (
    <div className="w-full h-auto bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-gray-200">
      <section
        className={`px-4 md:px-6 ${standalone ? "py-14" : "py-7"}
      relative overflow-hidden`}
      >
        {/* Subtle dot grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #000 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-6xl mx-auto relative">
          {standalone && (
            <SectionHeading
              label="Who I am"
              title="About Me"
              subtitle={
                bio.subtitle ||
                "Crafting digital experiences with passion and precision."
              }
            />
          )}

          {!standalone && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs tracking-[0.3em] uppercase mb-12 text-center"
            >
              Who I am
            </motion.p>
          )}

          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start justify-center">
            {/* LEFT: Avatar + stats */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start gap-6">
              {/* Avatar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative group w-full max-w-xs"
              >
                {/* Decorative frame */}
                <div
                  className="absolute -top-3 -left-3 w-full h-full
                border border-black/5 dark:border-white/5 rounded-2xl
                group-hover:border-black/20 dark:group-hover:border-white/20
                transition-colors duration-500"
                />

                <div
                  className="relative overflow-hidden rounded-2xl bg-black/3 dark:bg-white/3
                aspect-4/5"
                >
                  {bio.avatar ? (
                    <img
                      src={bio.avatar}
                      alt={bio.name}
                      className="w-full h-full object-cover object-top
                      grayscale group-hover:grayscale-0
                      transition-all duration-700 ease-out
                      scale-105 group-hover:scale-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">👤</span>
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div
                    className="absolute inset-0 bg-linear-to-t
                  from-black/30 via-transparent to-transparent
                  opacity-100 group-hover:opacity-0
                  transition-opacity duration-700"
                  />

                  {/* Name overlay */}
                  <div
                    className="absolute bottom-0 left-0 right-0 p-4
                  translate-y-0 group-hover:translate-y-2
                  transition-transform duration-500"
                  >
                    <p className="text-[16px] font-bold uppercase tracking-wide">
                      {bio.name}
                    </p>
                    <p className="text-[14px] font-semibold mt-0.5">
                      {bio.title}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                {[
                  {
                    num: `${bio.experience?.length || 0}+`,
                    label: "Positions",
                  },
                  { num: `${bio.skills?.length || 0}+`, label: "Technologies" },
                  { num: `${bio.education?.length || 0}`, label: "Degrees" },
                  { num: "20+", label: "Projects" },
                ].map(({ num, label }) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -2 }}
                    className="group p-4 border border-black/5 dark:border-white/5
                    rounded-xl hover:border-black/20 dark:hover:border-white/20
                    transition-all duration-300 text-center"
                  >
                    <p className="text-2xl font-bold leading-none">{num}</p>
                    <p className="text-xs  mt-1 uppercase tracking-wider">
                      {label}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Resume download */}
              {resume?.fileUrl && (
                <motion.a
                  href={`${BASE_URL}/resume/download`}
                  download={resume?.fileUrl}
                  aria-disabled={!resume}
                  rel="noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group w-full max-w-xs flex items-center justify-center gap-3
                  py-3.5 border border-black/10 dark:border-white/10
                  hover:border-black dark:hover:border-white
                  hover:text-black dark:hover:text-white
                  text-xs tracking-widest uppercase
                  transition-all duration-300"
                >
                  <FiDownload
                    size={14}
                    className="group-hover:-translate-y-0.5 transition-transform duration-300"
                  />
                  Download Resume
                  <span className="text-xs ml-1">v{resume.version}</span>
                </motion.a>
              )}
            </div>

            {/*  RIGHT: Tabbed content */}
            <div className="md:col-span-8">
              {/* Tab bar */}
              <div className="flex gap-0 border-b flex-wrap md:flex-nowrap border-black/30 dark:border-white/30 mb-8 overflow-x-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-5 py-3 text-xs tracking-wide md:tracking-widest uppercase
                    transition-colors duration-300 whitespace-nowrap
                    ${
                      activeTab === tab
                        ? "text-black dark:text-white"
                        : "hover:text-black/50 dark:hover:text-white/50"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-px bg-black dark:bg-white"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab panels */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.25 }}
                >
                  {activeTab === "About" && <AboutTab bio={bio} />}

                  {activeTab === "Skills" && (
                    <SkillsTab skills={bio.skills || []} />
                  )}

                  {activeTab === "Experience" &&
                    (bio.experience?.length ? (
                      <div>
                        {bio.experience.map((e, i) => (
                          <TimelineItem
                            key={i}
                            item={e}
                            index={i}
                            type="experience"
                          />
                        ))}
                      </div>
                    ) : (
                      <EmptyState label="No experience added yet" />
                    ))}

                  {activeTab === "Education" &&
                    (bio.education?.length ? (
                      <div>
                        {bio.education.map((e, i) => (
                          <TimelineItem
                            key={i}
                            item={e}
                            index={i}
                            type="education"
                          />
                        ))}
                      </div>
                    ) : (
                      <EmptyState label="No education added yet" />
                    ))}
                  {activeTab === "Resume" && (
                    <Resume
                      resume={resume}
                      loading={loading}
                      error={error}
                      onDownload={() => dispatch(incrementDownloadCount())}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
