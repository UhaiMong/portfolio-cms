export default function Spinner({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const s = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" }[size];
  return (
    <div className="flex items-center justify-center w-full py-10">
      <div
        className={`${s} border-2 border-gray-700 border-t-indigo-500 rounded-full animate-spin`}
      />
    </div>
  );
}
