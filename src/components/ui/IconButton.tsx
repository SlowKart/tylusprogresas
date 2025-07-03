import React from "react";
import { cn } from "@/lib/utils";

export function IconButton({
  onClick,
  label,
  children,
  className = "",
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "mr-2 p-2 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary leading-none",
        className
      )}
    >
      {children}
    </button>
  );
}
