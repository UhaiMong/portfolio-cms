export default function ProjectCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800">
      <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}
