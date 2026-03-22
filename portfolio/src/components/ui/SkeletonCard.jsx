// Generic skeleton pulse block
const Skeleton = ({ className = "" }) => (
  <div className={`bg-white/5 animate-pulse rounded ${className}`} />
);

// Project / Blog card skeleton
export const CardSkeleton = () => (
  <div className="border border-white/5 rounded-xl overflow-hidden">
    <Skeleton className="h-48 rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  </div>
);

// Text block skeleton
export const TextSkeleton = ({ lines = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={`h-3 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
      />
    ))}
  </div>
);

export default Skeleton;
