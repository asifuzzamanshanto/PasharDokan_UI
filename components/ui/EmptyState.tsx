import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-surface-sunken flex items-center justify-center text-text-tertiary mb-4">
          {icon}
        </div>
      )}
      <h3 className="font-semibold text-text-primary text-sm">{title}</h3>
      {description && <p className="text-sm text-text-tertiary mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
