// Status dot
function StatusDot({ status }) {
  const map = {
    completed: { dot: "bg-emerald-400", label: "Completed" },
    "in-progress": { dot: "bg-amber-400 animate-pulse", label: "In Progress" },
    archived: { dot: "bg-neutral-500", label: "Archived" },
  };
  const s = map[status] ?? map.completed;
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      <span className="text-[10px] font-medium tracking-widest uppercase text-gray-500 dark:text-gray-400">
        {s.label}
      </span>
    </span>
  );
}
export default StatusDot;
