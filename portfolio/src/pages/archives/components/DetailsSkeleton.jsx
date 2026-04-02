// Skeleton
function DetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-24" />
      <div className="aspect-16/7 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl"
          />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-4 bg-gray-200 dark:bg-gray-800 rounded"
            style={{ width: `${90 - i * 5}%` }}
          />
        ))}
      </div>
    </div>
  );
}
export default DetailsSkeleton;
