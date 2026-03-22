type Variant = "green" | "yellow" | "red" | "blue" | "gray" | "purple";

const variants: Record<Variant, string> = {
  green: "bg-emerald-900/50 text-emerald-300 border-emerald-700/50",
  yellow: "bg-amber-900/50   text-amber-300   border-amber-700/50",
  red: "bg-rose-900/50    text-rose-300    border-rose-700/50",
  blue: "bg-sky-900/50     text-sky-300     border-sky-700/50",
  gray: "bg-gray-800       text-gray-400    border-gray-700",
  purple: "bg-purple-900/50  text-purple-300  border-purple-700/50",
};

export default function Badge({
  label,
  variant = "gray",
}: {
  label: string;
  variant?: Variant;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}
    >
      {label}
    </span>
  );
}
