// Skeleton
function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-8 max-w-2xl mx-auto">
      <div className="space-y-3">
        <div className="h-3 w-24 bg-black/5 dark:bg-white/5 rounded" />
        <div className="h-8 bg-black/5 dark:bg-white/5 rounded w-4/5" />
        <div className="h-8 bg-black/5 dark:bg-white/5 rounded w-3/5" />
        <div className="h-3 w-32 bg-black/5 dark:bg-white/5 rounded" />
      </div>
      <div className="h-72 bg-black/5 dark:bg-white/5 rounded-2xl" />
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-4 bg-black/5 dark:bg-white/5 rounded"
          style={{ width: `${70 + Math.random() * 30}%` }}
        />
      ))}
    </div>
  );
}

export default DetailSkeleton;
