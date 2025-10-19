import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors";

  const variantStyles = {
    default: "bg-primary/10 text-primary",
    outline: "border border-gray-300 text-gray-700",
    secondary: "bg-gray-100 text-gray-700"
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

