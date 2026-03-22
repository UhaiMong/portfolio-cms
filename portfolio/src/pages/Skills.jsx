import { motion } from "framer-motion";
import SectionTitle from "../components/ui/SectionTitle";
import { FiCornerLeftDown } from "react-icons/fi";

export default function Skills() {
  <SectionTitle title="Skills & Capabilities" />;
  const expertSkills = [
    { category: "Frontend", skills: ["HTML5", "CSS3", "JavaScript", "React"] },
    { category: "Backend", skills: ["Node.js", "Express.js", "Django"] },
    { category: "Database", skills: ["MongoDB", "MySQL", "PostgreSQL"] },
    {
      category: "Deployment & CI/CD",
      skills: ["Vercel", "Render", "Netlify", "GitHub Actions"],
    },
    { category: "Testing", skills: ["Jest", "Postman"] },
    {
      category: "Others",
      skills: ["REST API", "JWT Auth", "WebSocket", "Responsive UI"],
    },
  ];

  const exploring = [
    "Next.js",
    "Figma",
    "AI Integrations",
    "Docker",
    "TypeScript",
    "GraphQL",
    "Firebase",
    "Tailwind Advanced Patterns",
  ];

  return (
    <section className="w-full py-16 px-6 md:px-12 lg:px-20 ">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-md font-bold text-right mb-4 text-neutral-700 dark:text-neutral-400"
      >
        <FiCornerLeftDown /> Skills & Technologies
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left - Expert Skills */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className=" rounded-xl shadow-md p-6"
        >
          <h3 className="text-sm font-semibold mb-4 text-neutral-700 dark:text-neutral-400">
            Expert In
          </h3>

          <div className="space-y-4 text-sm">
            {expertSkills.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="font-semibold text-neutral-800 dark:text-neutral-500">
                  {item.category}:
                </p>
                <p className="text-neutral-500 dark:text-neutral-500">
                  {item.skills.join(", ")}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right - Exploring Skills */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-xl shadow-xl p-6"
        >
          <h3 className="text-sm font-semibold mb-4 text-neutral-700 dark:text-neutral-400">
            Exploring & Passionate About
          </h3>

          <motion.ul className="space-y-3">
            {exploring.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.07 }}
                viewport={{ once: true }}
                className="text-sm text-neutral-700 dark:text-neutral-400 bg-black/75 rounded-md px-4 py-2 hover:scale-105 transition transform"
              >
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
