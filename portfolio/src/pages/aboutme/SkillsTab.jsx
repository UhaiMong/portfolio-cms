import SkillBar from "./SkillBar";
import { motion } from "framer-motion";
import EmptyState from "./EmptyState";

function SkillsTab({ skills }) {
  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  if (!skills.length) return <EmptyState label="No skills added yet" />;

  return (
    <div className="space-y-10">
      {Object.entries(grouped).map(([cat, items], gi) => (
        <motion.div
          key={cat}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: gi * 0.1 }}
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-5">{cat}</p>
          <div className="space-y-4">
            {items.map((s, i) => (
              <SkillBar key={s.name} skill={s} index={i} />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
export default SkillsTab;
