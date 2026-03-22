import { useState, useRef } from "preact/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../context/DataContext";
import { submitContact } from "../services/portfolioService";
import { availabilityLabel } from "../utils/helpers";
import SectionHeading from "../components/ui/SectionHeading";
import {
  FiMail,
  FiMapPin,
  FiPhone,
  FiAlertCircle,
  FiArrowRight,
} from "react-icons/fi";
import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaXTwitter,
  FaInstagram,
} from "react-icons/fa6";
import FloatingField from "./contact/FloatingField";
import InfoCard from "./contact/InfoCard";
import SuccessScreen from "./contact/SuccessScreen";

// Social icon map
const SOCIAL_ICONS = {
  github: { Icon: FaGithub, color: "hover:text-white" },
  linkedin: { Icon: FaLinkedin, color: "hover:text-blue-400" },
  facebook: { Icon: FaFacebook, color: "hover:text-blue-500" },
  twitter: { Icon: FaXTwitter, color: "hover:text-sky-400" },
  x: { Icon: FaXTwitter, color: "hover:text-white" },
  instagram: { Icon: FaInstagram, color: "hover:text-pink-400" },
};
const getSocialMeta = (p = "") => {
  const k = p.toLowerCase();
  return (
    Object.entries(SOCIAL_ICONS).find(([key]) => k.includes(key))?.[1] || null
  );
};

// Field validation
const validate = ({ name, email, subject, message }) => {
  const e = {};
  if (!name.trim()) e.name = "Name is required";
  if (!email.trim()) e.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
  if (!subject.trim()) e.subject = "Subject is required";
  if (!message.trim()) e.message = "Message is required";
  else if (message.trim().length < 20)
    e.message = "Message must be at least 20 characters";
  return e;
};

const INIT = { name: "", email: "", subject: "", message: "" };

const fieldCls = (err) =>
  `w-full bg-transparent border-b py-3 text-sm outline-none
   transition-all duration-300
   ${
     err
       ? "border-red-400"
       : "border-black/10 dark:border-white/10 focus:border-black dark:focus:border-white"
   }`;

//  Main Contact component
export default function Contact({ standalone = true }) {
  const { bio } = useData();
  const [form, setForm] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [apiErr, setApiErr] = useState("");
  const formRef = useRef(null);

  const avail = availabilityLabel(bio?.availability);
  const socials = bio?.socialLinks || [];

  const onChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
    if (apiErr) setApiErr("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setStatus("loading");
    setApiErr("");
    try {
      await submitContact(form);
      setStatus("success");
      setForm(INIT);
    } catch (err) {
      setStatus("error");
      setApiErr(
        err?.response?.data?.message || "Failed to send. Please try again.",
      );
    }
  };

  const onReset = () => {
    setStatus("idle");
    setErrors({});
  };

  // Subject suggestions
  const suggestions = [
    "Project Inquiry",
    "Freelance Work",
    "Job Opportunity",
    "Just saying HI,",
  ];

  return (
    <div className="bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-gray-200 w-full h-auto">
      <section
        className={`px-4 md:px-6 overflow-hidden
      ${standalone ? "py-14" : "py-7"}`}
      >
        <div className="max-w-6xl mx-auto relative">
          {standalone && (
            <SectionHeading
              label="Get in touch"
              title="Let's Work Together"
              subtitle="Have a project in mind or just want to say hello? I'd love to hear from you."
            />
          )}

          {!standalone && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="text-xs tracking-[0.4em] uppercase mb-4">
                Get in touch
              </p>
              <h2 className="text-4xl md:text-5xl font-bold">
                Let's Work
                <span className="block opacity-20">Together</span>
              </h2>
            </motion.div>
          )}

          <div className="grid md:grid-cols-12 gap-10 md:gap-16">
            {/* LEFT: Info */}
            <div className="md:col-span-4 space-y-8">
              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-sm  leading-relaxed">
                  {bio?.about
                    ? bio.about.slice(0, 180) +
                      (bio.about.length > 180 ? "…" : "")
                    : "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision."}
                </p>
              </motion.div>

              {/* Availability */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 py-3
                border-y border-black/5 dark:border-white/5"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  {bio?.availability === "available" && (
                    <span
                      className="animate-ping absolute inline-flex h-full w-full
                    rounded-full bg-green-400 opacity-75"
                    />
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${avail.dot}`}
                  />
                </span>
                <span className={`text-xs ${avail.color}`}>{avail.label}</span>
              </motion.div>

              {/* Contact info cards */}
              <div className="space-y-3 flex flex-col gap-y-2.5">
                {bio?.email && (
                  <InfoCard
                    icon={FiMail}
                    label="Email"
                    value={bio.email}
                    href={`mailto:${bio.email}`}
                    delay={0.1}
                  />
                )}
                {bio?.phone && (
                  <InfoCard
                    icon={FiPhone}
                    label="Phone"
                    value={bio.phone}
                    href={`tel:${bio.phone}`}
                    delay={0.15}
                  />
                )}
                {bio?.location && (
                  <InfoCard
                    icon={FiMapPin}
                    label="Location"
                    value={bio.location}
                    href={null}
                    delay={0.2}
                  />
                )}
              </div>

              {/* Social links */}
              {socials.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-xs tracking-[0.3em] uppercase mb-4">
                    Follow me
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {socials.map((s, i) => {
                      const meta = getSocialMeta(s.platform);
                      const Icon = meta?.Icon;
                      return (
                        <motion.a
                          key={s.platform}
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                          whileHover={{ y: -3, scale: 1.1 }}
                          className={`w-10 h-10 flex items-center justify-center
                          border border-black/5 dark:border-white/5 rounded-xl
                          hover:border-black/30 dark:hover:border-white/30
                          transition-all duration-300
                          ${meta?.color || "hover:text-black dark:hover:text-white"}`}
                          aria-label={s.platform}
                        >
                          {Icon ? (
                            <Icon size={15} />
                          ) : (
                            <span className="text-xs uppercase">
                              {s.platform.slice(0, 2)}
                            </span>
                          )}
                        </motion.a>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            {/*  RIGHT: Form  */}
            <div className="md:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="border border-black/5 dark:border-white/5
                rounded-3xl p-8 md:p-10 overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {/* Success state */}
                  {status === "success" && (
                    <motion.div key="success">
                      <SuccessScreen onReset={onReset} />
                    </motion.div>
                  )}

                  {/* Form */}
                  {status !== "success" && (
                    <motion.form
                      key="form"
                      ref={formRef}
                      onSubmit={onSubmit}
                      noValidate
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-8"
                    >
                      {/* API error banner */}
                      <AnimatePresence>
                        {apiErr && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="flex items-center gap-2 p-4 rounded-xl
                            border border-red-200 dark:border-red-800
                            bg-red-50 dark:bg-red-950/30
                            text-red-500 text-sm"
                          >
                            <FiAlertCircle size={16} className="shrink-0" />
                            {apiErr}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Row 1: Name + Email */}
                      <div className="grid sm:grid-cols-2 gap-8">
                        <FloatingField
                          label="Your Name"
                          error={errors.name}
                          required
                        >
                          <input
                            type="text"
                            value={form.name}
                            onInput={onChange("name")}
                            placeholder="Uhai Mong"
                            className={fieldCls(errors.name)}
                          />
                        </FloatingField>
                        <FloatingField
                          label="Email Address"
                          error={errors.email}
                          required
                        >
                          <input
                            type="email"
                            value={form.email}
                            onInput={onChange("email")}
                            placeholder="uhaimong.me@gmail.com"
                            className={fieldCls(errors.email)}
                          />
                        </FloatingField>
                      </div>

                      {/* Subject */}
                      <FloatingField
                        label="Subject"
                        error={errors.subject}
                        required
                      >
                        <input
                          type="text"
                          value={form.subject}
                          onInput={onChange("subject")}
                          placeholder="What's this about?"
                          className={fieldCls(errors.subject)}
                        />
                        {/* Quick suggestion chips */}
                        {!form.subject && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-2 flex-wrap mt-3"
                          >
                            {suggestions.map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() =>
                                  setForm((p) => ({ ...p, subject: s }))
                                }
                                className="text-xs px-3 py-1 rounded-full
                                border border-black/5 dark:border-white/5
                                hover:border-black/20 dark:hover:border-white/20
                                hover:text-black/60 dark:hover:text-white/60
                                transition-all duration-200"
                              >
                                {s}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </FloatingField>

                      {/* Message */}
                      <FloatingField
                        label="Message"
                        error={errors.message}
                        required
                      >
                        <textarea
                          rows={5}
                          value={form.message}
                          onInput={onChange("message")}
                          placeholder="Tell me about your project, idea, or just say hello..."
                          className={fieldCls(errors.message) + " resize-none"}
                        />
                        <div className="flex justify-end mt-1">
                          <span
                            className={`text-xs transition-colors duration-300
                          ${
                            form.message.length < 20 && form.message.length > 0
                              ? "text-red-400"
                              : "text-gray-900 dark:text-gray-200"
                          }`}
                          >
                            {form.message.length} / 20 min
                          </span>
                        </div>
                      </FloatingField>

                      {/* Submit */}
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-xs">
                          I typically reply within 24–48 hours.
                        </p>
                        <motion.button
                          type="submit"
                          disabled={status === "loading"}
                          whileHover={{ scale: 1.02, x: 2 }}
                          whileTap={{ scale: 0.97 }}
                          className="group flex items-center gap-3
                          px-8 py-4 text-sm tracking-widest uppercase
                          bg-gray-900 dark:bg-white text-gray-200 dark:text-gray-900
                          hover:bg-black/80 dark:hover:bg-white/80
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transition-all duration-300"
                        >
                          {status === "loading" ? (
                            <>
                              <span
                                className="w-4 h-4 border-2 border-white/30 dark:border-black/30
                              border-t-white dark:border-t-black rounded-full animate-spin"
                              />
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <motion.span
                                animate={{ x: [0, 3, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                              >
                                <FiArrowRight size={16} />
                              </motion.span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
