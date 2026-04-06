import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "xs" | "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-150 cursor-pointer",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
          {
            primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm",
            secondary: "bg-surface-sunken text-text-primary hover:bg-border active:bg-border-strong border border-border",
            outline: "border border-border text-text-primary hover:bg-surface-sunken active:bg-border",
            ghost: "text-text-secondary hover:text-text-primary hover:bg-surface-sunken",
            danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
            success: "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm",
          }[variant],
          {
            xs: "text-[11px] px-2 py-1 rounded-md gap-1",
            sm: "text-xs px-3 py-1.5 rounded-md gap-1.5",
            md: "text-sm px-4 py-2 rounded-lg gap-2",
            lg: "text-sm px-5 py-2.5 rounded-lg gap-2",
          }[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
