// Skeleton
function DetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-6 mt-28 max-w-7xl mx-auto">
      {/* Category */}
      <div className="h-6 bg-gray-400 dark:bg-gray-800 rounded w-30" />
      {/* Bread crumbs */}
      <div className="flex items-center">
        <div className="h-6 w-20 bg-gray-400 dark:bg-gray-800 rounded" />
        <span className="text-gray-800 dark:text-gray-200"> /</span>
        <div className="h-6 w-20 bg-gray-400 dark:bg-gray-800 rounded" />
        <span className="text-gray-800 dark:text-gray-200"> /</span>
        <div className="h-6 w-40 bg-gray-400 dark:bg-gray-800 rounded" />
      </div>
      {/* Title */}
      <div className="h-6 max-w-3xl bg-gray-400 dark:bg-gray-800" />
      {/* Short description */}
      <div className="flex flex-col gap-y-2.5">
        <div className="h-3 max-w-3xl bg-gray-400 dark:bg-gray-800" />
        <div className="h-3 max-w-4xl bg-gray-400 dark:bg-gray-800" />
        <div className="h-3 max-w-5xl bg-gray-400 dark:bg-gray-800" />
        <div className="h-3 max-w-3xl bg-gray-400 dark:bg-gray-800" />
      </div>
      {/* Cover Image */}
      <div className="aspect-16/6 bg-gray-400 dark:bg-gray-800 rounded-md" />
      {/* Description */}
      <div className="space-y-4">
        <div className="h-10 bg-gray-400 dark:bg-gray-800 rounded w-2/3" />
        <div className="h-4 bg-gray-400 dark:bg-gray-800 rounded" />
        <div className="h-4 bg-gray-400 dark:bg-gray-800 rounded w-5/6" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-16 bg-gray-400 dark:bg-gray-800 rounded-xl"
          />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-4 bg-gray-400 dark:bg-gray-800 rounded"
            style={{ width: `${90 - i * 5}%` }}
          />
        ))}
      </div>
    </div>
  );
}
export default DetailsSkeleton;
