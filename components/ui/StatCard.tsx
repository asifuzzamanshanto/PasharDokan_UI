import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label?: string };
  accent?: "emerald" | "amber" | "blue" | "red" | "slate";
  className?: string;
}

export default function StatCard({ title, value, subtitle, icon, trend, accent = "emerald", className }: StatCardProps) {
  const accentBg = {
    emerald: "bg-primary-50 text-primary-600",
    amber: "bg-accent-50 text-accent-600",
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    slate: "bg-slate-100 text-slate-600",
  }[accent];

  return (
    <div className={cn("bg-surface rounded-xl border border-border shadow-xs p-4", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide">{title}</p>
          <p className="text-xl font-bold text-text-primary mt-1.5">{value}</p>
          {subtitle && <p className="text-xs text-text-tertiary mt-0.5">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={cn("text-xs font-semibold", trend.value >= 0 ? "text-emerald-600" : "text-red-600")}>
                {trend.value >= 0 ? "+" : ""}{trend.value}%
              </span>
              <span className="text-[11px] text-text-tertiary">{trend.label || "vs yesterday"}</span>
            </div>
          )}
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", accentBg)}>
          {icon}
        </div>
      </div>
    </div>
  );
}
