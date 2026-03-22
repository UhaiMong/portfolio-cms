import { motion } from "framer-motion";
import { FiMapPin, FiMail, FiPhone } from "react-icons/fi";
import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaXTwitter,
  FaInstagram,
} from "react-icons/fa6";
import { availabilityLabel } from "../../utils/helpers";

// Social icon map
const SOCIAL_ICONS = {
  github: { Icon: FaGithub, color: "hover:text-white" },
  linkedin: { Icon: FaLinkedin, color: "hover:text-blue-400" },
  facebook: { Icon: FaFacebook, color: "hover:text-blue-500" },
  twitter: { Icon: FaXTwitter, color: "hover:text-sky-400" },
  x: { Icon: FaXTwitter, color: "hover:text-white" },
  instagram: { Icon: FaInstagram, color: "hover:text-pink-400" },
};
const getSocialMeta = (platform = "") => {
  const k = platform.toLowerCase();
  return (
    Object.entries(SOCIAL_ICONS).find(([key]) => k.includes(key))?.[1] || null
  );
};

function AboutTab({ bio }) {
  const avail = availabilityLabel(bio.availability);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* About text */}
      <div>
        <p className="text-xs tracking-[0.3em] uppercase mb-4">About me</p>
        <p
          className="text-sm md:text-base
          leading-relaxed whitespace-pre-line"
        >
          {bio.about || "No bio added yet."}
        </p>
      </div>

      {/* Contact info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            icon: FiMail,
            label: "Email",
            value: bio.email,
            href: `mailto:${bio.email}`,
          },
          {
            icon: FiPhone,
            label: "Phone",
            value: bio.phone,
            href: `tel:${bio.phone}`,
          },
          {
            icon: FiMapPin,
            label: "Location",
            value: bio.location,
            href: null,
          },
        ]
          .filter((i) => i.value)
          .map(({ icon: Icon, label, value, href }) => (
            <div
              key={label}
              className="group flex items-center gap-3
            p-3 border border-black/5 dark:border-white/5 rounded-xl
            hover:border-black/20 dark:hover:border-white/20 transition-colors duration-300"
            >
              <div
                className="w-8 h-8 flex items-center justify-center
              bg-black/3 dark:bg-white/3 rounded-lg shrink-0"
              >
                <Icon
                  size={14}
                  className="
                group-hover:text-black dark:group-hover:text-white transition-colors duration-300"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider">{label}</p>
                {href ? (
                  <a
                    href={href}
                    className="text-xs 
                    hover:text-black dark:hover:text-white transition-colors truncate block"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-xs truncate">{value}</p>
                )}
              </div>
            </div>
          ))}

        {/* Availability */}
        <div
          className="group flex items-center gap-3
          p-3 border border-black/5 dark:border-white/5 rounded-xl
          hover:border-black/20 dark:hover:border-white/20 transition-colors duration-300"
        >
          <div
            className="w-8 h-8 flex items-center justify-center
            bg-black/3 dark:bg-white/3 rounded-lg shrink-0"
          >
            <span className={`w-2 h-2 rounded-full ${avail.dot}`} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider">Status</p>
            <p className={`text-xs font-medium ${avail.color}`}>
              {avail.label}
            </p>
          </div>
        </div>
      </div>

      {/* Social links */}
      {bio.socialLinks?.length > 0 && (
        <div>
          <p className="text-xs tracking-[0.3em] uppercasemb-4 mb-2">Connect</p>
          <div className="flex gap-3 flex-wrap">
            {bio.socialLinks.map((s) => {
              const meta = getSocialMeta(s.platform);
              const Icon = meta?.Icon;
              return (
                <motion.a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -3, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className={`flex items-center gap-2 px-4 py-2.5
                    border border-black/5 dark:border-white/5
                    
                    hover:border-black/30 dark:hover:border-white/30
                    rounded-xl text-xs transition-all duration-300
                    ${meta?.color || "hover:text-black dark:hover:text-white/60"}`}
                >
                  {Icon && (
                    <Icon
                      size={14}
                      className="grayscale group-hover:grayscale-0"
                    />
                  )}
                  {s.platform}
                </motion.a>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
export default AboutTab;
