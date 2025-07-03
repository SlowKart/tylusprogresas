import React from "react";
import { SkipBack } from "lucide-react";
import { IconButton } from "./ui/IconButton";

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
