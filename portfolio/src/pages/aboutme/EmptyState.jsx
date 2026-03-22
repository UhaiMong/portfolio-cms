// Empty state
function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="w-12 h-12 border bg-gray-300 dark:bg-gray-800
        rounded-full flex items-center justify-center mb-4"
      >
        <span className=" text-xl">0</span>
      </div>
      <p className="text-xs  uppercase tracking-widest">{label}</p>
    </div>
  );
}
export default EmptyState;
