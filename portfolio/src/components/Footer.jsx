import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa6";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";
import { FiMail, FiNavigation, FiPhone, FiPhoneCall } from "react-icons/fi";
import BackgroundGridBluePrint from "./ui/BackgroundGridBluePrint";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/archives", label: "All Work" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

// Map platform names to icons
const ICON_MAP = {
  github: { Icon: FaGithub, hover: "hover:text-white" },
  linkedin: { Icon: FaLinkedin, hover: "hover:text-blue-400" },
  facebook: { Icon: FaFacebook, hover: "hover:text-blue-500" },
  twitter: { Icon: FaXTwitter, hover: "hover:text-white" },
  x: { Icon: FaXTwitter, hover: "hover:text-white" },
  instagram: { Icon: FaInstagram, hover: "hover:text-pink-400" },
  youtube: { Icon: FaYoutube, hover: "hover:text-red-500" },
};

const getSocialIcon = (platform = "") => {
  const key = platform.toLowerCase();
  return Object.entries(ICON_MAP).find(([k]) => key.includes(k))?.[1] || null;
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Footer() {
  const { bio } = useData();
  const { theme } = useTheme();

  const socials = bio?.socialLinks?.length
    ? bio.socialLinks
    : [
        { platform: "GitHub", url: "https://github.com/UhaiMong" },
        { platform: "LinkedIn", url: "https://www.linkedin.com/in/uhai-mong/" },
        { platform: "Facebook", url: "https://www.facebook.com/uhaimong.bd" },
        { platform: "Twitter", url: "https://x.com/Uhaimongmarma2" },
      ];

  const name = bio?.name || "Uhai Mong";
  const tagline =
    bio?.subtitle ||
    "Focus on building clean, high-performance applications with elegant UI.";

  return (
    <footer className="w-full h-auto bg-gray-200  text-gray-900 dark:text-gray-200 dark:bg-linear-to-b from-slate-900 via-indigo-950 to-slate-900">
      <div className="relative border-t border-black/10 dark:border-white/70 overflow-hidden">
        {/* Subtle background grid */}
        <BackgroundGridBluePrint />

        <div className="container mx-auto px-6 py-16 relative">
          {/* Top: Big name + tagline  */}

          {/* ── Main grid  */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {/* Brand col */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="col-span-2 md:col-span-1"
            >
              <Link to="/" className="group inline-block mb-4">
                <span
                  className="text-lg font-bold uppercase
                 tracking-tight"
                >
                  {name.split(" ")[0]}
                </span>
                <span
                  className="text-lg font-bold uppercase ml-1
                 tracking-tight
                group-hover:text-black/60 dark:group-hover:text-white/60
                transition-colors duration-300"
                >
                  {name.split(" ").slice(1).join(" ")}
                </span>
              </Link>

              {/* Availability */}
              {bio?.availability === "available" && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="relative flex h-1.5 w-1.5">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full
                    rounded-full bg-green-400 opacity-75"
                    />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                  </span>
                  <span className="text-xs">Available for work</span>
                </div>
              )}
            </motion.div>

            {/* Navigation */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <h4
                className="text-xs tracking-[0.3em] uppercase
               mb-5"
              >
                Navigate
              </h4>
              <ul className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="group flex items-center gap-2 text-sm
                      
                      hover:text-black dark:hover:text-white
                      transition-colors duration-300"
                    >
                      <span
                        className="w-0 group-hover:w-3 h-px bg-current
                      transition-all duration-300 overflow-hidden"
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact info */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4
                className="text-xs tracking-[0.3em] uppercase
               mb-5"
              >
                Contact
              </h4>
              <ul
                className="flex flex-col gap-3 text-sm
              "
              >
                {bio?.email && (
                  <li className="flex justify-start items-center gap-1">
                    <span>
                      {" "}
                      <FiMail />{" "}
                    </span>
                    <a
                      href={`mailto:${bio.email}`}
                      className="hover:text-black dark:hover:text-white transition-colors duration-300 break-all"
                    >
                      {bio.email}
                    </a>
                  </li>
                )}
                {bio?.location && (
                  <li className="flex items-center justify-start gap-1">
                    <span className="text-xs">
                      {" "}
                      <FiNavigation />{" "}
                    </span>
                    {bio.location}
                  </li>
                )}
                {bio?.phone && (
                  <li className="flex justify-start items-center gap-1">
                    <FiPhoneCall />
                    <a
                      href={`tel:${bio.phone}`}
                      className="hover:text-black dark:hover:text-white transition-colors duration-300"
                    >
                      {bio.phone}
                    </a>
                  </li>
                )}
              </ul>
            </motion.div>

            {/* Social */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <h4
                className="text-xs tracking-[0.3em] uppercase
               mb-5"
              >
                Connect
              </h4>
              <div className="flex flex-col gap-3">
                {socials.map((s) => {
                  const meta = getSocialIcon(s.platform);
                  const Icon = meta?.Icon;
                  return (
                    <motion.a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className={`flex items-center gap-2.5 text-sm
                      
                      transition-all duration-300
                      ${meta?.hover || "hover:text-black dark:hover:text-white"}`}
                    >
                      {Icon && (
                        <Icon
                          size={14}
                          className="grayscale hover:grayscale-0 transition-all duration-500"
                        />
                      )}
                      <span>{s.platform}</span>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/*  Bottom bar */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-between
            gap-4 mt-16 pt-8 border-t border-black/5 dark:border-white/5"
          >
            <p className="text-xs  tracking-widest uppercase">
              © {new Date().getFullYear()} {name}. All rights reserved.
            </p>
            <p className="text-xs  tracking-widest uppercase">
              Built with Preact · Tailwind · Framer Motion
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
