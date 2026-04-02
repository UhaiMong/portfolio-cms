// Skeleton
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
        >
          <div className="aspect-video bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-5/6" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div
                  key={j}
                  className="h-4 w-14 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonGrid;
