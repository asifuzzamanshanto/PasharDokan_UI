import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

export default function Card({ children, className, padding = "md", hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface rounded-xl border border-border shadow-xs",
        hover && "hover:shadow-sm hover:border-border-strong transition-all duration-150",
        { none: "", sm: "p-3", md: "p-4", lg: "p-5" }[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
