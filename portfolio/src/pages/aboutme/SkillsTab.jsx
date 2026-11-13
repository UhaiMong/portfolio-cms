import { motion } from "framer-motion";
import EmptyState from "./EmptyState";

function SkillsTab({ skills }) {
  if (!skills?.length) return <EmptyState label="No skills added yet" />;

  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      {Object.entries(grouped).map(([cat, items], gi) => (
        <motion.div
          key={cat}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: gi * 0.05 }}
        >
          <p className="text-xs tracking-[0.25em] uppercase text-ink-muted mb-4">
            {cat}
          </p>
          <div className="flex flex-wrap gap-2">
            {items.map((s) => (
              <span
                key={s.name || s}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
                  border border-line bg-surface-elevated text-sm text-ink"
              >
                {s.name || s}
                {s.years ? (
                  <span className="text-[10px] tracking-wide uppercase text-ink-faint">
                    {s.years}y
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default SkillsTab;
