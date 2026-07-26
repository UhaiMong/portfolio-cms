import {
  pricingPackages,
  serviceCapabilities,
} from "../../pages/services/data";
import { useState } from "preact/hooks";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Bot,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const iconMap = {
  Code2: Code2,
  Bot: Bot,
  Zap: Zap,
};

export default function ServicesSection({ standalone = true }) {
  const [activeTab, setActiveTab] = useState("packages"); // "packages" | "capabilities"

  return (
    <section
      id="services"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gray-100 text-slate-800 dark:bg-transparent dark:text-gray-200 transition-colors duration-300 overflow-hidden"
    >
      {/* Background Subtle Ambient Glows (Adapts to Light / Dark) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-400/20 dark:bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[200px] bg-indigo-400/20 dark:bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {standalone && (
            <div className="text-center">
              <SectionHeading
                label="AI & Engineering Services"
                title="Architecting High-Impact Web & AI Solutions"
                subtitle="Whether you need a full-stack platform built from scratch, AI
            integrations, or existing application optimization—here is how we
            can collaborate"
              />
            </div>
          )}

          {/* Tab Switcher */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 inline-flex p-1 rounded-xl bg-slate-200/80 border border-slate-300/70 dark:bg-slate-900/80 dark:border-slate-800 backdrop-blur-md"
          >
            <button
              onClick={() => setActiveTab("packages")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === "packages"
                  ? "bg-linear-to-r from-cyan-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 text-white shadow-md shadow-cyan-500/20"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Engagement Packages
            </button>
            <button
              onClick={() => setActiveTab("capabilities")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === "capabilities"
                  ? "bg-linear-to-r from-cyan-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 text-white shadow-md shadow-cyan-500/20"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Core Capabilities
            </button>
          </motion.div>
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          {activeTab === "packages" ? (
            /* PACKAGES TIER DISPLAY */
            <motion.div
              key="packages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
            >
              {pricingPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col justify-between rounded-2xl p-8 transition-all duration-300 border backdrop-blur-md ${
                    pkg.popular
                      ? "bg-white/90 border-cyan-500/60 shadow-xl shadow-cyan-500/10 dark:bg-slate-900/90 dark:border-cyan-500/50 dark:shadow-cyan-500/10 scale-[1.02]"
                      : "bg-white/70 border-slate-200/80 hover:border-slate-300 dark:bg-slate-900/40 dark:border-slate-800 dark:hover:border-slate-700 shadow-sm hover:shadow-md"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-linear-to-r from-cyan-500 to-indigo-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md">
                      {pkg.badge}
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-200 text-cyan-800 border border-slate-300 dark:bg-slate-800 dark:text-cyan-400 dark:border-slate-700">
                        {pkg.deliveryTime}
                      </span>
                      {!pkg.popular && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {pkg.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 min-h-10 leading-relaxed">
                      {pkg.tagline}
                    </p>

                    <div className="my-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 font-bold">
                        What's Included
                      </p>
                      <ul className="space-y-3">
                        {pkg.inclusions.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300"
                          >
                            <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8">
                    <a
                      href="#contact"
                      className={`w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium text-sm transition-all duration-300 ${
                        pkg.popular
                          ? "bg-linear-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 dark:from-cyan-500 dark:to-blue-600 text-white shadow-md shadow-cyan-500/20"
                          : "bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-slate-700"
                      }`}
                    >
                      <span>{pkg.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            /* CAPABILITIES DISPLAY */
            <motion.div
              key="capabilities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {serviceCapabilities.map((cap) => {
                const IconComponent = iconMap[cap.icon];
                return (
                  <div
                    key={cap.id}
                    className="rounded-2xl p-8 bg-white/70 border border-slate-200/80 hover:border-cyan-500/40 dark:bg-slate-900/40 dark:border-slate-800 dark:hover:border-cyan-500/30 transition-all duration-300 group hover:-translate-y-1 shadow-sm hover:shadow-md backdrop-blur-md"
                  >
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                      {IconComponent && <IconComponent className="w-6 h-6" />}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {cap.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                      {cap.description}
                    </p>

                    <ul className="space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                      {cap.features.map((feat, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Tech Badge Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center p-6 rounded-2xl bg-white/60 border border-slate-200/80 dark:bg-slate-900/30 dark:border-slate-800/60 max-w-4xl mx-auto backdrop-blur-md"
        >
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 font-bold">
            Tech Stack I Use
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 font-mono flex flex-wrap justify-center gap-x-4 gap-y-2">
            <span>React / Next.js</span> • <span>TypeScript</span> •{" "}
            <span>Node.js / Express</span> • <span>PostgreSQL / Prisma</span> •{" "}
            <span>MongoDB / Mongoose</span> • <span>Tailwind CSS</span> •{" "}
            <span>Redux</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
