// Tech badge colours
const TECH_COLORS = {
  React: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Next.js": "bg-neutral-500/10 text-neutral-300 border-neutral-500/20",
  "Node.js": "bg-green-500/10 text-green-400 border-green-500/20",
  "Express.js": "bg-orange-500 text-gray-200 border-orange-600",
  MongoDB: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Mongoose: "bg-emerald-700/10 text-emerald-200 border-emerald-500/20",
  TypeScript: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Tailwind: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Python: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  default: "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

function TechBadge({ tech }) {
  const cls = TECH_COLORS[tech] ?? TECH_COLORS.default;
  return (
    <span
      className={`inline-block text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded border ${cls}`}
    >
      {tech}
    </span>
  );
}
export default TechBadge;
