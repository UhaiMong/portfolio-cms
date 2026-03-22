import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  color?: "indigo" | "emerald" | "amber" | "rose" | "purple" | "sky";
  trend?: { value: number; label: string };
}

const colorMap = {
  indigo: {
    bg: "bg-indigo-600/20",
    border: "border-indigo-500/30",
    icon: "text-indigo-400",
    badge: "bg-indigo-900/50 text-indigo-300",
  },
  emerald: {
    bg: "bg-emerald-600/20",
    border: "border-emerald-500/30",
    icon: "text-emerald-400",
    badge: "bg-emerald-900/50 text-emerald-300",
  },
  amber: {
    bg: "bg-amber-600/20",
    border: "border-amber-500/30",
    icon: "text-amber-400",
    badge: "bg-amber-900/50 text-amber-300",
  },
  rose: {
    bg: "bg-rose-600/20",
    border: "border-rose-500/30",
    icon: "text-rose-400",
    badge: "bg-rose-900/50 text-rose-300",
  },
  purple: {
    bg: "bg-purple-600/20",
    border: "border-purple-500/30",
    icon: "text-purple-400",
    badge: "bg-purple-900/50 text-purple-300",
  },
  sky: {
    bg: "bg-sky-600/20",
    border: "border-sky-500/30",
    icon: "text-sky-400",
    badge: "bg-sky-900/50 text-sky-300",
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "indigo",
  trend,
}: Props) {
  const c = colorMap[color];
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${c.bg} border ${c.border}`}>
          <Icon size={20} className={c.icon} />
        </div>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${c.badge}`}
          >
            {trend.value > 0 ? "+" : ""}
            {trend.value} {trend.label}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm font-medium text-gray-300">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}
