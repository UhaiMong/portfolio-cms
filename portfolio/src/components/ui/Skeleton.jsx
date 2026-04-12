const Skeleton = () => (
  <div className="grid grid-cols-3 gap-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="animate-pulse bg-gray-200 h-40 rounded" />
    ))}
  </div>
);
export default Skeleton;
