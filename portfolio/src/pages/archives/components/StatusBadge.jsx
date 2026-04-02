//  Status label
function StatusBadge({ status }) {
  const map = {
    completed: {
      cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      label: "Completed",
    },
    "in-progress": {
      cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      label: "In Progress",
      pulse: true,
    },
    archived: {
      cls: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
      label: "Archived",
    },
  };
  const s = map[status] ?? map.completed;
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-lg border ${s.cls}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${s.pulse ? "bg-amber-400 animate-pulse" : "bg-current"}`}
      />
      {s.label}
    </span>
  );
}
export default StatusBadge;
