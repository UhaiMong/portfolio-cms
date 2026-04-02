// Info pill
function InfoPill({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1 p-4 rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/50">
      <div className="flex items-center gap-2 text-gray-400">
        <Icon size={13} />
        <span className="text-[10px] font-bold tracking-widest uppercase">
          {label}
        </span>
      </div>
      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug">
        {value}
      </span>
    </div>
  );
}
export default InfoPill;
