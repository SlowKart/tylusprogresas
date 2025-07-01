import React from "react";
import { SkipBack } from "lucide-react";
import { cn } from "@/lib/utils";

// Reusable IconButton component
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

export function StepLayout({
  children,
  onBack,
  title,
}: {
  children: React.ReactNode;
  onBack?: () => void;
  title: string;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center mb-8">
        {onBack && (
          <IconButton onClick={onBack} label="Back">
            <SkipBack
              size={24}
              strokeWidth={2}
              className="text-primary"
              aria-hidden="true"
            />
          </IconButton>
        )}
        <h1 className="text-3xl font-bold text-primary ml-2">{title}</h1>
      </div>
      {children}
    </main>
  );
}
