import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        {
          sm: "text-[11px] px-2 py-0.5",
          md: "text-xs px-2.5 py-0.5",
        }[size],
        {
          default: "bg-gray-100 text-gray-700",
          success: "bg-emerald-100 text-emerald-700",
          warning: "bg-amber-100 text-amber-700",
          danger: "bg-red-100 text-red-700",
          info: "bg-blue-100 text-blue-700",
          purple: "bg-purple-100 text-purple-700",
          outline: "border border-border text-text-secondary bg-surface",
        }[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
